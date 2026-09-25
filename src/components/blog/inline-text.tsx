import Link from "next/link";
import type { ReactNode } from "react";
import { INLINE_TOKEN, isExternalHref, safeHref } from "@/lib/blog/blocks";

const LINK_CLASS =
  "font-medium text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-2 hover:decoration-[var(--brand)]";

type Counter = { n: number };

function withBreaks(text: string, key: Counter): ReactNode[] {
  return text
    .split("\n")
    .flatMap((part, i) => (i === 0 ? [part] : [<br key={`br-${key.n++}`} />, part]));
}

function parse(text: string, key: Counter): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  while (rest) {
    const m = INLINE_TOKEN.exec(rest);
    if (!m) {
      out.push(...withBreaks(rest, key));
      break;
    }
    if (m.index > 0) out.push(...withBreaks(rest.slice(0, m.index), key));
    const k = `t-${key.n++}`;
    const [, bold, linkText, rawHref, italic] = m;

    if (bold !== undefined) {
      out.push(
        <strong key={k} className="font-semibold text-foreground">
          {parse(bold, key)}
        </strong>,
      );
    } else if (linkText !== undefined) {
      const href = safeHref(rawHref);
      if (!href) {
        out.push(...withBreaks(linkText, key));
      } else if (isExternalHref(href)) {
        out.push(
          <a key={k} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {parse(linkText, key)}
          </a>,
        );
      } else if (href.startsWith("/")) {
        out.push(
          <Link key={k} href={href} className={LINK_CLASS}>
            {parse(linkText, key)}
          </Link>,
        );
      } else {
        out.push(
          <a key={k} href={href} className={LINK_CLASS}>
            {parse(linkText, key)}
          </a>,
        );
      }
    } else if (italic !== undefined) {
      out.push(<em key={k}>{parse(italic, key)}</em>);
    }
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}

/**
 * Render editor text with its inline markup as React elements. Never uses
 * dangerouslySetInnerHTML, and link targets go through `safeHref`, so post
 * content can't inject script.
 */
export function InlineText({ text }: { text: string }) {
  return <>{parse(text, { n: 0 })}</>;
}
