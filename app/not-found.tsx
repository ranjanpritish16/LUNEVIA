import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center bg-cream px-4 pt-24 text-center">
      <p className="font-cormorant text-8xl text-gold/30">404</p>
      <h1 className="mt-4 font-cormorant text-4xl text-primary">
        Page not found
      </h1>
      <p className="mt-3 max-w-md font-dm-sans text-sm text-charcoal/70">
        This page doesn&apos;t exist — but your perfect bridal look still does.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/explore"
          className="rounded-full border border-gold bg-gold px-6 py-2.5 font-dm-sans text-sm font-medium text-primary transition-colors hover:bg-gold/90"
        >
          Browse Salons
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gold px-6 py-2.5 font-dm-sans text-sm font-medium text-gold transition-colors hover:bg-gold/10"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
