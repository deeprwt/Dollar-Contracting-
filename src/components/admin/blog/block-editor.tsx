"use client";

import { Fragment, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  CopyPlus,
  Heading2,
  ImagePlus,
  Images,
  Lightbulb,
  List,
  Megaphone,
  Minus,
  Pilcrow,
  Plus,
  Quote,
  Trash2,
  Video,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  BLOCK_TYPES,
  blockText,
  cloneBlock,
  createBlock,
  readingMinutes,
  type Block,
  type BlockType,
} from "@/lib/blog/blocks";
import {
  CalloutFields,
  CtaFields,
  DividerFields,
  GalleryFields,
  HeadingFields,
  ImageFields,
  ListFields,
  ParagraphFields,
  QuoteFields,
  VideoFields,
} from "./block-fields";

const ICONS: Record<BlockType, LucideIcon> = {
  paragraph: Pilcrow,
  heading: Heading2,
  image: ImagePlus,
  gallery: Images,
  list: List,
  quote: Quote,
  callout: Lightbulb,
  video: Video,
  cta: Megaphone,
  divider: Minus,
};

const LABELS = Object.fromEntries(BLOCK_TYPES.map((t) => [t.type, t.label])) as Record<
  BlockType,
  string
>;

type Props = {
  postId: string;
  blocks: Block[];
  setBlocks: Dispatch<SetStateAction<Block[]>>;
  onUploadingChange: (delta: 1 | -1) => void;
};

export function BlockEditor({ postId, blocks, setBlocks, onUploadingChange }: Props) {
  // The block to focus when it mounts — set when the editor adds one.
  const [focusId, setFocusId] = useState<string | null>(null);

  function insertAt(index: number, type: BlockType) {
    const block = createBlock(type);
    setBlocks((prev) => [...prev.slice(0, index), block, ...prev.slice(index)]);
    setFocusId(block.id);
  }

  function move(id: string, dir: -1 | 1) {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function duplicate(id: string) {
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      if (i < 0) return prev;
      return [...prev.slice(0, i + 1), cloneBlock(prev[i]), ...prev.slice(i + 1)];
    });
  }

  function remove(block: Block, index: number) {
    setBlocks((prev) => prev.filter((b) => b.id !== block.id));
    toast(`${LABELS[block.type]} block removed`, {
      duration: 6000,
      action: {
        label: "Undo",
        onClick: () =>
          setBlocks((prev) =>
            prev.some((b) => b.id === block.id)
              ? prev
              : [...prev.slice(0, index), block, ...prev.slice(index)],
          ),
      },
    });
  }

  function updaterFor<T extends Block>(id: string) {
    return (fn: (b: T) => T) =>
      setBlocks((prev) => prev.map((b) => (b.id === id ? fn(b as T) : b)));
  }

  function fields(block: Block) {
    const common = { postId, onUploadingChange, autoFocus: focusId === block.id };
    switch (block.type) {
      case "heading":
        return <HeadingFields block={block} update={updaterFor(block.id)} {...common} />;
      case "paragraph":
        return <ParagraphFields block={block} update={updaterFor(block.id)} {...common} />;
      case "image":
        return <ImageFields block={block} update={updaterFor(block.id)} {...common} />;
      case "gallery":
        return <GalleryFields block={block} update={updaterFor(block.id)} {...common} />;
      case "list":
        return <ListFields block={block} update={updaterFor(block.id)} {...common} />;
      case "quote":
        return <QuoteFields block={block} update={updaterFor(block.id)} {...common} />;
      case "callout":
        return <CalloutFields block={block} update={updaterFor(block.id)} {...common} />;
      case "video":
        return <VideoFields block={block} update={updaterFor(block.id)} {...common} />;
      case "cta":
        return <CtaFields block={block} update={updaterFor(block.id)} {...common} />;
      case "divider":
        return <DividerFields />;
    }
  }

  const words = blocks.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;

  return (
    <div>
      {blocks.length === 0 && (
        <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          The post is empty. Add your first block below.
        </p>
      )}

      {blocks.map((block, i) => {
        const Icon = ICONS[block.type];
        return (
          <Fragment key={block.id}>
            {i > 0 && <InsertPoint onPick={(type) => insertAt(i, type)} />}
            <section
              aria-label={`${LABELS[block.type]} block`}
              className="overflow-hidden rounded-lg border border-border bg-background focus-within:border-[var(--brand)]/40"
            >
              <header className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-1">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  {LABELS[block.type]}
                </span>
                <div className="flex items-center">
                  <HeaderButton title="Move up" disabled={i === 0} onClick={() => move(block.id, -1)}>
                    <ChevronUp className="h-3.5 w-3.5" />
                  </HeaderButton>
                  <HeaderButton
                    title="Move down"
                    disabled={i === blocks.length - 1}
                    onClick={() => move(block.id, 1)}
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </HeaderButton>
                  <HeaderButton title="Duplicate" onClick={() => duplicate(block.id)}>
                    <CopyPlus className="h-3.5 w-3.5" />
                  </HeaderButton>
                  <HeaderButton title="Remove" danger onClick={() => remove(block, i)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </HeaderButton>
                </div>
              </header>
              <div className="p-3">{fields(block)}</div>
            </section>
          </Fragment>
        );
      })}

      <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Add a block
        </p>
        <BlockTypeButtons onPick={(type) => insertAt(blocks.length, type)} />
      </div>

      <p className="mt-2 text-right text-xs text-muted-foreground">
        {words.toLocaleString()} words · {readingMinutes(blocks)} min read
      </p>
    </div>
  );
}

function HeaderButton({
  title,
  onClick,
  disabled,
  danger,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground disabled:opacity-30 ${
        danger ? "hover:bg-destructive/10 hover:text-destructive" : "hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function BlockTypeButtons({ onPick }: { onPick: (type: BlockType) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {BLOCK_TYPES.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <button
            key={t.type}
            type="button"
            title={t.hint}
            onClick={() => onPick(t.type)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium hover:border-[var(--brand)]/40 hover:text-[var(--brand)]"
          >
            <Icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/** Thin "+" divider between blocks that opens the block picker in place. */
function InsertPoint({ onPick }: { onPick: (type: BlockType) => void }) {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <div className="my-2 rounded-lg border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-2.5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">
            Insert block here
          </p>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setOpen(false)}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <BlockTypeButtons
          onPick={(type) => {
            setOpen(false);
            onPick(type);
          }}
        />
      </div>
    );
  }

  return (
    <div className="group relative flex h-5 items-center justify-center">
      <span className="absolute inset-x-6 top-1/2 h-px bg-transparent transition group-hover:bg-[var(--brand)]/30" />
      <button
        type="button"
        title="Insert block here"
        aria-label="Insert block here"
        onClick={() => setOpen(true)}
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground opacity-60 transition hover:border-[var(--brand)] hover:text-[var(--brand)] focus-visible:opacity-100 group-hover:opacity-100 sm:opacity-0"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
