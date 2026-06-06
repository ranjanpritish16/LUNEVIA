"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TimelineResponse } from "@/lib/types/timeline";
import { TimelineNode } from "@/components/ui/TimelineNode";

export default function TimelinePage() {
  const [weddingDate, setWeddingDate] = useState("");
  const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateTimeline = async () => {
    if (!weddingDate) return;
    
    setIsLoading(true);
    setError("");
    setTimeline(null);

    try {
      const res = await fetch("/api/ai/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weddingDate }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate timeline");
      }

      setTimeline(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Restrict date selection to today onwards
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-cream px-6 py-12 md:px-12 md:py-20 lg:px-24">
      <div className="mx-auto max-w-3xl">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="font-dm-sans text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              AI-Powered Planner
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 font-cormorant text-5xl font-semibold text-primary md:text-6xl"
          >
            Your Bridal <span className="text-gold">Beauty</span> Timeline
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-xl font-dm-sans text-charcoal/70"
          >
            Enter your wedding date, and our AI will generate a personalized, month-by-month beauty prep schedule just for you.
          </motion.p>
        </div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-16 rounded-3xl border border-gold/20 bg-white p-6 shadow-warm md:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="weddingDate" className="mb-2 block font-dm-sans text-sm font-semibold uppercase tracking-wider text-charcoal">
                When is your big day?
              </label>
              <input
                type="date"
                id="weddingDate"
                min={today}
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full rounded-xl border border-gold/30 bg-cream/50 px-4 py-3.5 font-dm-sans text-primary outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <button
              onClick={generateTimeline}
              disabled={!weddingDate || isLoading}
              className="flex h-[52px] items-center justify-center rounded-xl bg-primary px-8 font-dm-sans font-medium text-cream transition-all hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
            >
              {isLoading ? "Generating..." : "Create My Timeline"}
            </button>
          </div>
          {error && (
            <p className="mt-4 font-dm-sans text-sm text-red-500">{error}</p>
          )}
        </motion.div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-8"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-gold/10 animate-pulse" />
                    <div className="w-px flex-1 bg-gold/10 mt-3" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="h-6 w-32 rounded bg-gold/10 animate-pulse mb-5" />
                    <div className="h-32 w-full rounded-2xl bg-white shadow-sm border border-gold/10 animate-pulse" />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Results State */}
          {!isLoading && timeline && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {timeline.phases.map((phase, index) => (
                <TimelineNode key={phase.phase} phase={phase} index={index} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
