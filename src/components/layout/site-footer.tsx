import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import { footerColumns, siteConfig } from "@/lib/site-config";
import { Separator } from "@/components/ui/separator";

function SocialIcon({ d, label }: { d: string; label: string }) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d={d} />
    </svg>
  );
}

const FACEBOOK_PATH =
  "M22 12a10 10 0 1 0-11.6 9.87v-6.98H7.9V12h2.5V9.8c0-2.47 1.47-3.84 3.72-3.84 1.08 0 2.2.2 2.2.2v2.42h-1.24c-1.22 0-1.6.76-1.6 1.54V12h2.72l-.43 2.89h-2.29v6.98A10 10 0 0 0 22 12z";
const TWITTER_PATH =
  "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644z";
const LINKEDIN_PATH =
  "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.23 0z";
const INSTAGRAM_PATH =
  "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.88 5.88 0 0 0 1.38 2.13c.66.66 1.33 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--ink)] text-white">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="Dollar Contracting — Home">
              <span className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 shadow-md">
                <Image
                  src="/logo.png"
                  alt="Dollar Contracting Ltd."
                  width={180}
                  height={90}
                  className="h-12 w-auto"
                />
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-white/70">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex items-center gap-3 text-white/70">
              <a href={siteConfig.social.facebook} aria-label="Facebook" className="hover:text-[var(--brand)]">
                <SocialIcon label="Facebook" d={FACEBOOK_PATH} />
              </a>
              <a href={siteConfig.social.twitter} aria-label="Twitter" className="hover:text-[var(--brand)]">
                <SocialIcon label="Twitter" d={TWITTER_PATH} />
              </a>
              <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="hover:text-[var(--brand)]">
                <SocialIcon label="LinkedIn" d={LINKEDIN_PATH} />
              </a>
              <a href={siteConfig.social.instagram} aria-label="Instagram" className="hover:text-[var(--brand)]">
                <SocialIcon label="Instagram" d={INSTAGRAM_PATH} />
              </a>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[var(--brand)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contact Us
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--brand)] shrink-0" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.city}, {siteConfig.address.region}
                  <br />
                  {siteConfig.address.country}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--brand)]" />
                <a href={siteConfig.phoneHref} className="hover:text-[var(--brand)]">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--brand)]" />
                <a href={siteConfig.emailHref} className="hover:text-[var(--brand)] break-all">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <p className="text-center text-xs text-white/60">
          Proudly serving Thunder Bay &amp; Northern Ontario
        </p>
      </div>

      <div className="border-t-2 border-[var(--brand)]/40 bg-black/40">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-3.5 text-center text-xs text-white/80 sm:flex-row sm:text-left">
          <p>
            Designed by{" "}
            <a
              href="https://ribbonitservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--brand)] hover:underline"
            >
              Ribbon IT Services
            </a>
          </p>
          <p>
            All rights reserved &copy; {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
