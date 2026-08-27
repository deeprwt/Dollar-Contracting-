"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { services } from "@/lib/services";
import { ImageWatermark } from "@/components/ui/image-watermark";

const AUTOPLAY_MS = 3500;
const TRANSITION_MS = 700;

function usePerView() {
  const [perView, setPerView] = useState(4);
  useEffect(() => {
    const set = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 4 : w >= 768 ? 3 : w >= 560 ? 2 : 1);
    };
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);
  return perView;
}

export function ServicesSlider() {
  const slides = services;
  const perView = usePerView();

  const extended = useMemo(() => {
    return [...slides, ...slides.slice(0, perView)];
  }, [slides, perView]);

  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [hovering, setHovering] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const dragDelta = useRef(0);

  useEffect(() => {
    if (index >= slides.length + perView) return;
    if (hovering) return;
    const t = setInterval(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [hovering, slides.length, index, perView]);

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

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % (slides.length + perView));
  }, [slides.length, perView]);

  const prev = useCallback(() => {
    setAnimate(true);
    setIndex((i) => (i <= 0 ? slides.length - 1 : i - 1));
  }, [slides.length]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    dragDelta.current = 0;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    dragDelta.current = e.touches[0].clientX - touchStartX.current;
  }
  function onTouchEnd() {
    if (Math.abs(dragDelta.current) > 40) {
      if (dragDelta.current < 0) next();
      else prev();
    }
    touchStartX.current = null;
    dragDelta.current = 0;
  }

  const slideWidthPct = 100 / perView;
  const translatePct = -index * slideWidthPct;
  const activeDot = index % slides.length;

  return (
    <section className="bg-muted/40 py-16 sm:py-20">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--brand)]">
            What We Build
          </span>
          <h2 className="heading-display mt-2 text-3xl sm:text-4xl lg:text-5xl">Our Services</h2>
          <p className="mt-3 text-muted-foreground">
            From foundation to finish — full-service contracting for homes and businesses across Northern Ontario.
          </p>
        </div>

        <div
          className="group relative mt-10"
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
              ref={trackRef}
              className="flex"
              style={{
                transform: `translate3d(${translatePct}%, 0, 0)`,
                transition: animate ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
              }}
            >
              {extended.map((s, i) => (
                <div
                  key={`${s.slug}-${i}`}
                  className="shrink-0 px-2"
                  style={{ width: `${slideWidthPct}%` }}
                >
                  <Link
                    href={`/services/${s.slug}`}
                    className="group/card relative block aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-md ring-1 ring-black/5 transition hover:shadow-xl"
                  >
                    <Image
                      src={s.image}
                      alt={s.shortTitle}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 560px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover/card:scale-110"
                    />
                    <ImageWatermark size="md" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <span className="inline-block rounded-full bg-[var(--brand)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                        {s.slug.includes("renovation") ? "Renovation" : s.slug.includes("work") || s.slug === "hvac" || s.slug === "plumbing" || s.slug === "flooring" || s.slug === "painting" ? "Trade" : "Build"}
                      </span>
                      <h3 className="heading-display mt-2 text-xl sm:text-2xl leading-tight">
                        {s.shortTitle}
                      </h3>
                      <p className="mt-1 line-clamp-2 max-h-0 overflow-hidden text-xs text-white/80 opacity-0 transition-all duration-500 group-hover/card:mt-2 group-hover/card:max-h-20 group-hover/card:opacity-100">
                        {s.tagline}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
                        View Service <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Previous services"
            className="absolute left-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-[var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:left-2 lg:-left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next services"
            className="absolute right-1 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-black/5 transition hover:bg-[var(--brand)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] sm:right-2 lg:-right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            {slides.map((s, i) => {
              const isActive = i === activeDot;
              return (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => {
                    setAnimate(true);
                    setIndex(i);
                  }}
                  aria-label={`Go to ${s.shortTitle}`}
                  className={`h-1.5 rounded-full transition-all ${
                    isActive ? "w-8 bg-[var(--brand)]" : "w-2.5 bg-foreground/20 hover:bg-foreground/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--brand)]/90 hover:shadow-lg"
          >
            Explore All Services <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
