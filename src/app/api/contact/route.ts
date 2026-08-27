import nodemailer from "nodemailer";
import { after } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Keep the function alive long enough for the background SMTP send to finish.
export const maxDuration = 60;

const MAX_TOTAL_BYTES = 25 * 1024 * 1024;

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

  const variant = str(formData.get("variant"), 20) === "quote" ? "quote" : "contact";
  const name = str(formData.get("name"), 200);
  const email = str(formData.get("email"), 200);
  const phone = str(formData.get("phone"), 50);
  const city = str(formData.get("city"), 200);
  const address = str(formData.get("address"), 300);
  const subject = str(formData.get("subject"), 200);
  const description = str(formData.get("description"), 8000);

  if (!name || !email || !phone || !subject || !description) {
    return Response.json(
      { error: "Name, email, phone, subject, and description are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  const photoEntries = formData.getAll("photos");
  const files = photoEntries.filter((p): p is File => p instanceof File && p.size > 0);

  let total = 0;
  for (const f of files) {
    total += f.size;
    if (total > MAX_TOTAL_BYTES) {
      return Response.json(
        { error: "Photos exceed 25 MB total. Please reduce file sizes." },
        { status: 413 },
      );
    }
    if (f.type && !f.type.startsWith("image/")) {
      return Response.json({ error: `Not an image: ${f.name}` }, { status: 400 });
    }
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name,
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type || "application/octet-stream",
    })),
  );

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to =
    (variant === "quote" ? process.env.QUOTES_TO : process.env.CONTACT_TO) ||
    siteConfig.email;
  // Derive the sender address from MAIL_FROM (which may be a full
  // `"Name" <addr>` string) or fall back to the SMTP user, then rebuild the
  // "From" header with a per-variant display name so quote emails read
  // "Dollar Contracting Quote" instead of inheriting the shared Careers name.
  const fromAddr =
    process.env.MAIL_FROM?.match(/<([^>]+)>/)?.[1] || process.env.MAIL_FROM || user;
  const fromName =
    variant === "quote" ? `${siteConfig.name} Quote` : siteConfig.name;
  const from = fromAddr ? `"${fromName}" <${fromAddr}>` : "";

  if (!host || !user || !pass || !from) {
    console.error("Contact form: SMTP not configured");
    return Response.json(
      { error: "Email service is not configured. Please call us instead." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const kindLabel = variant === "quote" ? "Quote Request" : "Contact Form";
  const mailSubject = `[${kindLabel}] ${subject} — ${name}`;

  const lines: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["City", city],
    ["Project Address", address],
    ["Subject", subject],
  ].filter(([, v]) => v) as [string, string][];

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
      <h2 style="color:#0f172a;border-bottom:3px solid #b91c1c;padding-bottom:8px">New ${esc(kindLabel)}</h2>
      <table style="width:100%;border-collapse:collapse;margin-top:12px">
        ${lines
          .map(
            ([k, v]) => `
              <tr>
                <td style="padding:6px 8px;background:#f1f5f9;font-weight:600;width:160px">${esc(k)}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #e2e8f0">${esc(v)}</td>
              </tr>`,
          )
          .join("")}
      </table>
      <h3 style="margin-top:18px;color:#0f172a">Description</h3>
      <div style="white-space:pre-wrap;padding:10px;background:#f8fafc;border-left:3px solid #b91c1c">${esc(description)}</div>
      ${
        files.length
          ? `<p style="margin-top:18px;font-size:12px;color:#64748b">Attachments: ${files.length} photo${files.length === 1 ? "" : "s"}</p>`
          : ""
      }
    </div>
  `;

  const text = [
    `New ${kindLabel}`,
    "",
    ...lines.map(([k, v]) => `${k}: ${v}`),
    "",
    `Description:\n${description}`,
  ].join("\n");

  // Auto-acknowledgement sent back to the person who submitted the form.
  const firstName = name.split(/\s+/)[0] || name;
  const ackSubject =
    variant === "quote"
      ? `Thank you for your quote request — ${siteConfig.name}`
      : `Thank you for contacting ${siteConfig.name}`;
  const ackParagraphs = [
    `Thank you for connecting with us. We have received your ${
      variant === "quote" ? "quote request" : "message"
    } and truly appreciate you reaching out.`,
    "Our team will review the details and coordinate with you within 24 hours.",
    `If your request is urgent, feel free to call us directly at ${siteConfig.phone}.`,
  ];
  const ackHtml = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#0f172a">
      <h2 style="color:#0f172a;border-bottom:3px solid #b91c1c;padding-bottom:8px">${
        variant === "quote" ? "Quote Request Received" : "Message Received"
      }</h2>
      <p style="margin-top:16px">Dear ${esc(firstName)},</p>
      ${ackParagraphs.map((p) => `<p style="margin-top:12px;line-height:1.6">${esc(p)}</p>`).join("")}
      <p style="margin-top:18px;line-height:1.6">Warm regards,<br />The ${esc(siteConfig.name)} Team<br />${esc(siteConfig.name)}</p>
    </div>
  `;
  const ackText = [
    `Dear ${firstName},`,
    "",
    ...ackParagraphs.flatMap((p) => [p, ""]),
    "Warm regards,",
    `The ${siteConfig.name} Team`,
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
        subject: mailSubject,
        text,
        html,
        attachments,
      });
      console.log("Contact form: sent", {
        variant,
        to,
        from,
        subject: mailSubject,
        attachments: attachments.length,
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });
    } catch (err) {
      console.error("Contact form: sendMail failed (background)", {
        variant,
        to,
        from,
        subject: mailSubject,
        attachments: attachments.length,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    // Auto-acknowledgement to the submitter. Sent independently so a failure
    // here never affects the business notification above (and vice versa).
    try {
      const ackInfo = await transporter.sendMail({
        from,
        to: email,
        replyTo: to,
        subject: ackSubject,
        text: ackText,
        html: ackHtml,
      });
      console.log("Contact form: acknowledgement sent", {
        variant,
        to: email,
        from,
        subject: ackSubject,
        messageId: ackInfo.messageId,
        accepted: ackInfo.accepted,
        rejected: ackInfo.rejected,
        response: ackInfo.response,
      });
    } catch (err) {
      console.error("Contact form: acknowledgement sendMail failed (background)", {
        variant,
        to: email,
        from,
        subject: ackSubject,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return Response.json({ ok: true });
}
