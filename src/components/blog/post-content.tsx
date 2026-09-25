import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info, Lightbulb, TriangleAlert } from "lucide-react";
import {
  buildOutline,
  hasRenderableContent,
  isExternalHref,
  parseVideoUrl,
  safeHref,
  type Block,
  type CalloutBlock,
  type OutlineItem,
} from "@/lib/blog/blocks";
import { blogImageUrl } from "@/lib/blog/images";
import { InlineText } from "./inline-text";

const CALLOUT_STYLES: Record<CalloutBlock["tone"], { box: string; icon: typeof Info; iconClass: string }> = {
  tip: { box: "border-amber-200 bg-amber-50", icon: Lightbulb, iconClass: "text-amber-600" },
  info: { box: "border-sky-200 bg-sky-50", icon: Info, iconClass: "text-sky-600" },
  warning: { box: "border-red-200 bg-red-50", icon: TriangleAlert, iconClass: "text-red-600" },
};

function BlockView({ block, anchor }: { block: Block; anchor?: string }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2 id={anchor} className="heading-display mt-12 scroll-mt-28 text-2xl text-foreground first:mt-0 sm:text-3xl">
          <InlineText text={block.text} />
        </h2>
      ) : (
        <h3 id={anchor} className="mt-9 scroll-mt-28 text-xl font-bold text-foreground first:mt-0">
          <InlineText text={block.text} />
        </h3>
      );

    case "paragraph":
      return (
        <>
          {block.text
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i} className="mt-5 first:mt-0">
                <InlineText text={p} />
              </p>
            ))}
        </>
      );

    case "image": {
      const img = block.image!;
      const wide = block.size === "wide";
      return (
        <figure className={`mt-8 first:mt-0 ${wide ? "lg:-mx-20" : ""}`}>
          <Image
            src={blogImageUrl(img.path)}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes={wide ? "(min-width: 1024px) 928px, 100vw" : "(min-width: 1024px) 768px, 100vw"}
            className="h-auto w-full rounded-xl"
          />
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "gallery":
      return (
        <figure className="mt-8 first:mt-0">
          <div className={`grid gap-3 ${block.columns === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
            {block.images.map((img) => (
              <a
                key={img.path}
                href={blogImageUrl(img.path)}
                target="_blank"
                rel="noopener"
                className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={blogImageUrl(img.path)}
                  alt={img.alt}
                  fill
                  sizes={block.columns === 3 ? "(min-width: 640px) 256px, 50vw" : "(min-width: 640px) 384px, 100vw"}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </a>
            ))}
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "list": {
      const items = block.items.map((i) => i.trim()).filter(Boolean);
      const className = "mt-5 space-y-2 pl-6 first:mt-0 marker:text-[var(--brand)]";
      const children = items.map((item, i) => (
        <li key={i} className="pl-1">
          <InlineText text={item} />
        </li>
      ));
      return block.style === "number" ? (
        <ol className={`${className} list-decimal marker:font-semibold`}>{children}</ol>
      ) : (
        <ul className={`${className} list-disc`}>{children}</ul>
      );
    }

    case "quote":
      return (
        <blockquote className="mt-8 border-l-4 border-[var(--brand)] py-1 pl-5 first:mt-0">
          <p className="whitespace-pre-line text-xl font-medium italic leading-relaxed text-foreground">
            {block.text}
          </p>
          {block.cite && (
            <footer className="mt-2 text-sm font-semibold not-italic text-muted-foreground">
              — {block.cite}
            </footer>
          )}
        </blockquote>
      );

    case "callout": {
      const style = CALLOUT_STYLES[block.tone];
      const Icon = style.icon;
      return (
        <aside className={`mt-8 flex gap-3 rounded-xl border p-5 first:mt-0 ${style.box}`}>
          <Icon className={`mt-1 h-5 w-5 shrink-0 ${style.iconClass}`} />
          <div className="min-w-0 text-[16px] text-slate-800">
            {block.title && <p className="font-bold text-slate-900">{block.title}</p>}
            {block.text && (
              <p className={block.title ? "mt-1" : ""}>
                <InlineText text={block.text} />
              </p>
            )}
          </div>
        </aside>
      );
    }

    case "video": {
      const video = parseVideoUrl(block.url)!;
      return (
        <figure className="mt-8 first:mt-0">
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe
              src={video.embedUrl}
              title={block.caption || "Video"}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "cta": {
      const href = safeHref(block.href)!;
      const label = block.label.trim() || "Learn more";
      const buttonClass =
        "mt-5 inline-flex items-center gap-2 rounded-md bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-[var(--brand)]/90";
      return (
        <aside className="relative mt-10 overflow-hidden rounded-2xl bg-[var(--ink)] p-6 text-white first:mt-0 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(60% 80% at 100% 0%, oklch(0.55 0.22 27 / 0.45) 0%, transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="heading-display text-2xl text-white">{block.title}</p>
            {block.body && <p className="mt-2 text-white/80">{block.body}</p>}
            {href.startsWith("/") ? (
              <Link href={href} className={buttonClass}>
                {label} <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <a
                href={href}
                className={buttonClass}
                {...(isExternalHref(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label} <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </aside>
      );
    }

    case "divider":
      return <hr className="my-10 border-border" />;
  }
}

/** Renders a post body. Blocks with nothing to show (e.g. an empty image slot) are skipped. */
export function PostContent({ blocks, outline }: { blocks: Block[]; outline?: OutlineItem[] }) {
  const anchors = new Map((outline ?? buildOutline(blocks)).map((o) => [o.blockId, o.anchor]));
  return (
    <div className="flow-root text-[17px] leading-[1.75] text-foreground/85">
      {blocks.filter(hasRenderableContent).map((block) => (
        <BlockView key={block.id} block={block} anchor={anchors.get(block.id)} />
      ))}
    </div>
  );
}

export function TableOfContents({ outline }: { outline: OutlineItem[] }) {
  return (
    <nav aria-label="On this page">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
        On this page
      </p>
      <ol className="mt-3 space-y-2 border-l border-border text-sm">
        {outline.map((item) => (
          <li key={item.anchor} className={item.level === 3 ? "pl-7" : "pl-4"}>
            <a
              href={`#${item.anchor}`}
              className="block leading-snug text-muted-foreground hover:text-[var(--brand)]"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
