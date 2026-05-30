"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    initials: "PS",
    name: "Priya Sharma",
    meta: "South Delhi · September 2025",
    quote:
      "LUNÉVIA Concierge matched me to the perfect artist in minutes. I'd been searching for weeks before this.",
  },
  {
    initials: "AM",
    name: "Ankita Mehra",
    meta: "Gurugram · November 2025",
    quote:
      "The AI understood my aesthetic immediately. My bridal look was exactly what I had in mind but couldn't describe.",
  },
  {
    initials: "SK",
    name: "Simran Kaur",
    meta: "Delhi · January 2026",
    quote:
      "The bridal package builder saved me weeks of research and ₹15,000 by finding the right artist first time.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

function StarRating() {
  return (
    <div className="flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true">
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-cormorant text-5xl text-primary">
          What Delhi&apos;s Brides Say
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((item) => (
            <motion.article
              key={item.initials}
              variants={cardVariants}
              className="rounded-2xl border border-gold/20 bg-white p-8 shadow-warm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 font-cormorant text-xl text-gold">
                  {item.initials}
                </div>
                <div>
                  <h3 className="font-cormorant text-xl text-primary">
                    {item.name}
                  </h3>
                  <p className="font-dm-sans text-xs text-charcoal opacity-50">
                    {item.meta}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <StarRating />
              </div>
              <p className="mt-4 font-dm-sans text-sm leading-relaxed text-charcoal">
                &ldquo;{item.quote}&rdquo;
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
