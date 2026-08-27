"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Menu, Phone, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainNav, siteConfig } from "@/lib/site-config";
import type { NavItem } from "@/lib/site-config";

function HoverNavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openNow = () => {
    cancelClose();
    setOpen(true);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div onMouseEnter={openNow} onMouseLeave={scheduleClose}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger
          className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium text-slate-700 hover:text-[var(--brand)] hover:bg-slate-50 data-[popup-open]:text-[var(--brand)]"
        >
          {item.label}
          <ChevronDown className="h-3 w-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="min-w-[280px] p-2"
          onMouseEnter={openNow}
          onMouseLeave={scheduleClose}
        >
          {item.sections!.map((section, si) => (
            <div key={si} className={si > 0 ? "mt-2 border-t pt-2" : ""}>
              {section.header && (
                <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.header}
                </p>
              )}
              {section.items.map((child) => (
                <DropdownMenuItem
                  key={child.href}
                  render={<Link href={child.href} />}
                  className="cursor-pointer rounded-md px-2 py-2 hover:bg-[var(--brand)]/5"
                  onClick={() => setOpen(false)}
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-medium text-foreground">{child.label}</span>
                      {child.description && (
                        <span className="text-xs text-muted-foreground">{child.description}</span>
                      )}
                    </span>
                    {child.tag && (
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">
                        {child.tag}
                      </span>
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  if (!item.sections) {
    return (
      <Link
        href={item.href}
        className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold hover:text-[var(--brand)]"
        onClick={onNavigate}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold hover:text-[var(--brand)]"
      >
        <span>{item.label}</span>
        <ChevronRight
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-90 text-[var(--brand)]" : ""}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-2">
            {item.sections.map((section, si) => (
              <div key={si} className={si > 0 ? "mt-1" : ""}>
                {section.header && (
                  <p className="px-6 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {section.header}
                  </p>
                )}
                {section.items.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center justify-between px-6 py-2 text-sm text-slate-600 hover:bg-[var(--brand)]/5 hover:text-[var(--brand)]"
                    onClick={onNavigate}
                  >
                    <span>{child.label}</span>
                    {child.tag && (
                      <span className="text-[10px] font-semibold uppercase text-[var(--brand)]">
                        {child.tag}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="container-page flex h-20 items-center justify-between gap-2">
        <Link href="/" className="flex items-center shrink-0" aria-label="Dollar Contracting — Home">
          <Image
            src="/logo.png"
            alt="Dollar Contracting Ltd."
            width={180}
            height={90}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden xl:flex items-center gap-0.5">
          {mainNav.map((item) =>
            item.sections ? (
              <HoverNavDropdown key={item.label} item={item} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-md px-2.5 py-2 text-[13px] font-medium text-slate-700 hover:text-[var(--brand)] hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={siteConfig.phoneHref}
            className="hidden md:inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-2 text-sm font-bold text-slate-900 hover:text-[var(--brand)]"
          >
            <Phone className="h-4 w-4 text-[var(--brand)]" />
            {siteConfig.phone}
          </a>
          <Button
            asChild
            className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white font-semibold whitespace-nowrap"
          >
            <Link href="/quote">Get A Quote</Link>
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-900 hover:bg-slate-100 xl:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-white text-slate-900 border-l border-slate-200"
            >
              <SheetHeader>
                <SheetTitle className="text-slate-900 text-lg font-bold">
                  Dollar Contracting
                </SheetTitle>
              </SheetHeader>
              <div className="mt-2 flex flex-col overflow-y-auto">
                {mainNav.map((item) => (
                  <MobileNavItem
                    key={item.label}
                    item={item}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
                <div className="mt-4 flex flex-col gap-2 px-4">
                  <a
                    href={siteConfig.phoneHref}
                    className="inline-flex items-center gap-2 text-sm font-bold"
                  >
                    <Phone className="h-4 w-4 text-[var(--brand)]" />
                    {siteConfig.phone}
                  </a>
                  <Button
                    asChild
                    className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white"
                  >
                    <Link href="/quote" onClick={() => setMobileOpen(false)}>
                      Get A Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function BackBar() {
  return (
    <div className="container-page pt-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 rounded-md bg-white/95 px-3 py-1.5 text-sm font-medium text-slate-900 shadow hover:bg-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
    </div>
  );
}
