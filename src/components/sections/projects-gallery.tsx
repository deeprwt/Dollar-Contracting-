"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, MapPin, Images } from "lucide-react";
import type { Project } from "@/lib/projects";
import { ImageWatermark } from "@/components/ui/image-watermark";

type Props = {
  projects: Project[];
};

type LightboxState = {
  projectIndex: number;
  imageIndex: number;
} | null;

export function ProjectsGallery({ projects }: Props) {
  const [lightbox, setLightbox] = useState<LightboxState>(null);

  const close = useCallback(() => setLightbox(null), []);

  const next = useCallback(() => {
    setLightbox((cur) => {
      if (!cur) return cur;
      const total = projects[cur.projectIndex].images.length;
      return { ...cur, imageIndex: (cur.imageIndex + 1) % total };
    });
  }, [projects]);

  const prev = useCallback(() => {
    setLightbox((cur) => {
      if (!cur) return cur;
      const total = projects[cur.projectIndex].images.length;
      return { ...cur, imageIndex: (cur.imageIndex - 1 + total) % total };
    });
  }, [projects]);

  useEffect(() => {
    if (!lightbox) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, close, next, prev]);

  const active = lightbox ? projects[lightbox.projectIndex] : null;
  const activeImage = active ? active.images[lightbox!.imageIndex] : null;

  return (
    <>
      <div className="space-y-16">
        {projects.map((project, pIdx) => (
          <section key={project.slug} id={project.slug} className="scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                  {project.category}
                </span>
                <h2 className="heading-display mt-1 text-2xl sm:text-3xl">{project.title}</h2>
                {project.location && (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" /> {project.location}
                  </p>
                )}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Images className="h-3.5 w-3.5" /> {project.images.length} photos
              </div>
            </div>

            {project.description && (
              <p className="mt-3 max-w-3xl text-sm text-muted-foreground sm:text-base">
                {project.description}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {project.images.map((src, iIdx) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setLightbox({ projectIndex: pIdx, imageIndex: iIdx })}
                  className="group relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-muted shadow-sm transition hover:border-[var(--brand)]/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
                  aria-label={`Open ${project.title} photo ${iIdx + 1}`}
                >
                  <Image
                    src={src}
                    alt={`${project.title} — photo ${iIdx + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition group-hover:scale-[1.03]"
                  />
                  <ImageWatermark />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent px-2.5 py-2 text-[11px] font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    {project.title}
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-3 text-center text-sm font-semibold text-foreground sm:text-left">
              {project.title}
            </p>
          </section>
        ))}
      </div>

      {lightbox && active && activeImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative flex h-full w-full max-w-5xl flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[calc(100vh-12rem)] w-full">
              <Image
                src={activeImage}
                alt={`${active.title} — photo ${lightbox.imageIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="text-base font-semibold sm:text-lg">{active.title}</p>
              <p className="mt-0.5 text-xs text-white/70">
                {lightbox.imageIndex + 1} of {active.images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
