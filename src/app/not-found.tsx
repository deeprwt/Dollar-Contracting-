import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand)]">
        404
      </p>
      <h1 className="mt-2 text-4xl font-black sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for has moved or never existed. Head back to the homepage or pick a service.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild className="bg-[var(--brand)] hover:bg-[var(--brand)]/90 text-white">
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">View Services</Link>
        </Button>
      </div>
    </section>
  );
}
