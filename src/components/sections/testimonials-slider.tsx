"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight, Star } from "lucide-react";
import { testimonials } from "@/lib/testimonials";
import { TestimonialCard } from "@/components/sections/testimonial-card";

const AUTOPLAY_MS = 5500;
const TRANSITION_MS = 700;

function usePerView() {
  const [perView, setPerView] = useState(3);
  useEffect(() => {
    const set = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 700 ? 2 : 1);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return perView;
}

type Props = {
  showHeader?: boolean;
  showCta?: boolean;
  background?: "tinted" | "plain";
  className?: string;
};

export function TestimonialsSlider({
  showHeader = true,
  showCta = true,
  background = "tinted",
  className = "",
}: Props = {}) {
  const slides = testimonials;
  const perView = usePerView();

  const extended = useMemo(
    () => [...slides, ...slides.slice(0, perView)],
    [slides, perView],
  );

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [dragDelta, setDragDelta] = useState(0);

  useEffect(() => {
    if (hovering) return;
    const t = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [hovering, slides.length]);

  useEffect(() => {
    if (index < slides.length) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
    }, TRANSITION_MS);
    return () => clearTimeout(t);
  }, [index, slides.length]);

  useEffect(() => {
    if (animate) return;
    const r = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(r);
  }, [animate]);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % (slides.length + perView)),
    [slides.length, perView],
  );
  const prev = useCallback(() => {
    setAnimate(true);
    setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
    setDragDelta(0);
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStart == null) return;
    setDragDelta(e.touches[0].clientX - touchStart);
  }
  function onTouchEnd() {
    if (Math.abs(dragDelta) > 40) {
      if (dragDelta < 0) next();
      else prev();
    }
    setTouchStart(null);
    setDragDelta(0);
  }

  const slideWidthPct = 100 / perView;
  const translatePct = -index * slideWidthPct;
  const activeDot = index % slides.length;
  const averageRating = (
    slides.reduce((s, t) => s + t.rating, 0) / slides.length
  ).toFixed(1);

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 ${className}`}>
      {background === "tinted" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, oklch(0.94 0.04 27 / 0.6) 0%, transparent 65%)",
          }}
        />
      )}
      <div className="container-page relative">
        {showHeader && (
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]">
              What Clients Say
            </span>
            <h2 className="heading-display mt-2 text-3xl sm:text-4xl lg:text-5xl">
              Testimonials
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur">
              <span className="flex text-[var(--brand)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
                ))}
              </span>
              <span className="font-semibold">{averageRating}</span>
              <span className="text-muted-foreground">
                · {slides.length} reviews from across Northern Ontario
              </span>
            </div>
          </div>
        )}

        <div
          className={`group relative ${showHeader ? "mt-10" : ""}`}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex"
              style={{
                transform: `translate3d(${translatePct}%, 0, 0)`,
                transition: animate
                  ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : "none",
              }}
            >
              {extended.map((t, i) => (
                <div
                  key={`${t.id}-${i}`}
                  className="shrink-0 px-3"
                  style={{ width: `${slideWidthPct}%` }}
                >
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-[var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:left-2 lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-[var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:right-2 lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-7 flex items-center justify-center gap-1.5">
            {slides.map((s, i) => {
              const isActive = i === activeDot;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setAnimate(true);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive
                      ? "w-8 bg-[var(--brand)]"
                      : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {showCta && (
          <div className="mt-10 text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand)]/90 hover:shadow-lg"
            >
              Read All Reviews <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
