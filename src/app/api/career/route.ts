import nodemailer from "nodemailer";
import { after } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Keep the function alive long enough for the background SMTP send to finish.
export const maxDuration = 60;

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function str(v: FormDataEntryValue | null, max = 5000) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const name = str(formData.get("name"), 200);
  const email = str(formData.get("email"), 200);
  const phone = str(formData.get("phone"), 50);
  const city = str(formData.get("city"), 200);
  const position = str(formData.get("position"), 200);
  const experience = str(formData.get("experience"), 200);
  const message = str(formData.get("message"), 5000);

  if (!name || !email || !phone || !position) {
    return Response.json(
      { error: "Name, email, phone, and position are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const resume = formData.get("resume");
  const photoEntries = formData.getAll("photos");

  if (!(resume instanceof File) || resume.size === 0) {
    return Response.json({ error: "Resume file is required." }, { status: 400 });
  }

  const photoFiles = photoEntries.filter(
    (p): p is File => p instanceof File && p.size > 0,
  );
  const files: File[] = [resume, ...photoFiles];

  let total = 0;
  for (const f of files) {
    total += f.size;
    if (total > MAX_TOTAL_BYTES) {
      return Response.json(
        { error: "Attachments exceed 25 MB total. Please reduce file sizes." },
        { status: 413 }
      );
    }
    if (f.type && !ALLOWED_TYPES.has(f.type) && !f.type.startsWith("image/")) {
      return Response.json({ error: `File type not allowed: ${f.name}` }, { status: 400 });
    }
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type || "application/octet-stream",
    }))
  );

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CAREERS_TO || siteConfig.email;
  const from = process.env.MAIL_FROM || (user ? `"${siteConfig.name} Careers" <${user}>` : "");

  if (!host || !user || !pass || !from) {
    console.error("Career form: SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASS/MAIL_FROM)");
    return Response.json(
      { error: "Email service is not configured. Please call us instead." },
      { status: 500 }
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const subject = `New Application — ${position} — ${name}`;
  const lines = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["City", city],
    ["Position", position],
    ["Experience", experience],
  ].filter(([, v]) => v);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
      <h2 style="color:#0f172a;border-bottom:3px solid #b91c1c;padding-bottom:8px">New Career Application</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        ${lines
          .map(
            ([k, v]) => `
              <tr>
                <td style="padding:6px 8px;background:#f1f5f9;font-weight:600;width:140px">${esc(k)}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0">${esc(v)}</td>
              </tr>`
          )
          .join("")}
      </table>
      ${
        message
          ? `<h3 style="margin-top:18px;color:#0f172a">Cover Note</h3>
             <div style="white-space:pre-wrap;padding:10px;background:#f8fafc;border-left:3px solid #b91c1c">${esc(
               message
             )}</div>`
          : ""
      }
      <p style="margin-top:18px;font-size:12px;color:#64748b">
        Attachments: resume${photoFiles.length ? ` + ${photoFiles.length} work sample(s)` : ""}
      </p>
    </div>
  `;

  const text = [
    "New Career Application",
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    message ? `Cover Note:\n${message}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  // Auto-acknowledgement sent back to the applicant.
  const firstName = name.split(/\s+/)[0] || name;
  const ackSubject = `Thank you for your application${position ? ` — ${position}` : ""}`;
  const ackParagraphs = [
    "Thank you for applying for the position with our company.",
    "We appreciate your interest and the time you took to submit your application. Our team will review your qualifications and contact you if we require any additional information or would like to schedule an interview.",
    "If you do not hear from us within one week of submitting your application, please consider that we have decided to move forward with other candidates at this time.",
    "Thank you again for your interest, and we wish you success in your job search.",
  ];
  const ackHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
      <h2 style="color:#0f172a;border-bottom:3px solid #b91c1c;padding-bottom:8px">Application Received</h2>
      <p style="margin-top:16px">Dear ${esc(firstName)},</p>
      ${ackParagraphs.map((p) => `<p style="margin-top:12px;line-height:1.6">${esc(p)}</p>`).join("")}
      <p style="margin-top:18px;line-height:1.6">Kind regards,<br />Hiring Team<br />${esc(siteConfig.name)}</p>
    </div>
  `;
  const ackText = [
    `Dear ${firstName},`,
    "",
    ...ackParagraphs.flatMap((p) => [p, ""]),
    "Kind regards,",
    "Hiring Team",
    siteConfig.name,
  ].join("\n");

  // Send asynchronously so the user doesn't wait on the SMTP handshake +
  // attachment upload. `after()` keeps the function alive (up to maxDuration)
  // until the promise settles, then logs the outcome to Vercel logs.
  after(async () => {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        replyTo: `"${name}" <${email}>`,
        subject,
        text,
        html,
        attachments,
      });
      console.log("Career form: sent", {
        to,
        from,
        subject,
        attachments: attachments.length,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    } catch (err) {
      console.error("Career form: sendMail failed (background)", {
        to,
        from,
        subject,
        attachments: attachments.length,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Auto-acknowledgement to the applicant. Sent independently so a failure
    // here never affects the HR notification above (and vice versa).
    try {
      const ackInfo = await transporter.sendMail({
        from,
        to: email,
        replyTo: to,
        subject: ackSubject,
        text: ackText,
        html: ackHtml,
      });
      console.log("Career form: acknowledgement sent", {
        to: email,
        from,
        subject: ackSubject,
        messageId: ackInfo.messageId,
        accepted: ackInfo.accepted,
        rejected: ackInfo.rejected,
        response: ackInfo.response,
      });
    } catch (err) {
      console.error("Career form: acknowledgement sendMail failed (background)", {
        to: email,
        from,
        subject: ackSubject,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return Response.json({ ok: true });
}
