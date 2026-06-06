"use client";

import { motion } from "framer-motion";
import type { TimelinePhase, TimelineTask } from "@/lib/types/timeline";
import { cn } from "@/lib/utils";

interface TimelineNodeProps {
  phase: TimelinePhase;
  index: number;
}

const CATEGORY_COLORS: Record<TimelineTask["category"], { bg: string; text: string; icon: string }> = {
  Skincare: { bg: "bg-blush/60", text: "text-rose", icon: "🧴" },
  Haircare: { bg: "bg-[#E6F3E6]/60", text: "text-emerald-700", icon: "💇‍♀️" },
  Makeup: { bg: "bg-[#F3E6E6]/60", text: "text-rose-700", icon: "💄" },
  Mehendi: { bg: "bg-gold/10", text: "text-gold", icon: "✍️" },
  Booking: { bg: "bg-primary/5", text: "text-primary", icon: "📅" },
};

export function TimelineNode({ phase, index }: TimelineNodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="relative flex gap-6 pb-12 last:pb-0"
    >
      {/* Vertical line & Dot */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-gold bg-cream shadow-sm">
          <span className="font-cormorant text-lg font-semibold text-primary">
            {phase.monthsOut === 0 ? "W" : phase.monthsOut}
          </span>
        </div>
        <div className="w-px flex-1 bg-gold/30 mt-3" />
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <h3 className="font-cormorant text-2xl font-semibold text-primary mb-5">
          {phase.phase}
        </h3>
        
        <div className="space-y-4">
          {phase.tasks.map((task, i) => {
            const cat = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Booking;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 + i * 0.1 }}
                className={cn(
                  "relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md",
                  task.isCritical ? "border-gold/50" : "border-gold/15"
                )}
              >
                {task.isCritical && (
                  <div className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-gold px-3 py-0.5 shadow-sm">
                    <span className="text-xs">⭐</span>
                    <span className="font-dm-sans text-[10px] font-bold uppercase tracking-wider text-cream">
                      Critical
                    </span>
                  </div>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", cat.bg, cat.text)}>
                    <span className="text-xl">{cat.icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-dm-sans text-[10px] font-bold uppercase tracking-wider", cat.text)}>
                        {task.category}
                      </span>
                    </div>
                    <h4 className="font-cormorant text-lg font-semibold text-primary mb-1">
                      {task.title}
                    </h4>
                    <p className="font-dm-sans text-sm text-charcoal/70 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
