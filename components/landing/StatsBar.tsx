const stats = [
  { value: "2,400+", label: "Verified Artists" },
  { value: "15,000+", label: "Weddings Celebrated" },
  { value: "₹2.1Cr+", label: "Bookings Facilitated" },
];

export function StatsBar() {
  return (
    <section className="bg-primary py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-8 px-4 sm:flex-row sm:gap-0">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center">
            {index > 0 && (
              <div
                className="mx-8 hidden h-12 w-px bg-gold/30 sm:block"
                aria-hidden="true"
              />
            )}
            <div className="text-center">
              <p className="font-cormorant text-4xl text-gold">{stat.value}</p>
              <p className="mt-1 font-dm-sans text-xs uppercase tracking-widest text-cream opacity-60">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
