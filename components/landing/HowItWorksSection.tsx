"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "1",
    emoji: "✨",
    title: "Tell LUNÉVIA Concierge",
    description:
      "Describe your dream look, skin tone, budget and style. Our AI listens like a luxury consultant.",
  },
  {
    number: "2",
    emoji: "🔍",
    title: "Get Matched Instantly",
    description:
      "LUNÉVIA surfaces the top 3 verified artists in Delhi who are perfect for your vision.",
  },
  {
    number: "3",
    emoji: "📅",
    title: "Book with Confidence",
    description:
      "Secure your artist with transparent pricing, verified portfolios and real bride reviews.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } },
};

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-cream py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <h2 className="font-cormorant text-5xl text-primary">
            How LUNÉVIA Works
          </h2>
          <p className="mt-3 font-dm-sans text-charcoal opacity-60">
            From vision to booking in three steps
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-16 flex flex-col gap-12 md:flex-row md:gap-8"
        >
          <div
            className="absolute left-[16.67%] right-[16.67%] top-8 hidden h-px border-t border-dashed border-gold/40 md:block"
            aria-hidden="true"
          />

          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative flex flex-1 flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gold font-dm-sans text-lg font-semibold text-primary">
                {step.number}
              </div>
              <span className="mt-4 text-3xl" aria-hidden="true">
                {step.emoji}
              </span>
              <h3 className="mt-3 font-cormorant text-2xl text-primary">
                {step.title}
              </h3>
              <p className="mt-2 max-w-xs font-dm-sans text-sm leading-relaxed text-charcoal">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
