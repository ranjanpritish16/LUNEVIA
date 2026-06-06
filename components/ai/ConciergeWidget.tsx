"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "recommendations";
  recommendations?: SalonRec[];
  timestamp: Date;
}

interface SalonRec {
  salonId: string;
  salonName: string;
  slug: string;
  matchScore: number;
  reasoning: string;
  specialNote: string;
}

// ─── Quick-start suggestions ──────────────────────────────────────────────────
const SUGGESTIONS = [
  "Find me a bridal makeup artist in South Delhi under ₹20k",
  "Who does the best airbrush in Delhi?",
  "I have a dusky complexion — who specialises in that?",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-gold"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function SalonRecommendationCard({ rec }: { rec: SalonRec }) {
  return (
    <Link
      href={`/salon/${rec.slug}`}
      className="group block rounded-xl border border-gold/30 bg-cream p-3 transition-all hover:border-gold hover:shadow-[0_2px_12px_rgba(201,147,58,0.15)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <span className="font-cormorant text-base font-semibold text-primary">
          {rec.salonName}
        </span>
        <span className="rounded-full bg-gold/15 px-2 py-0.5 font-dm-sans text-xs font-semibold text-gold">
          {rec.matchScore}% match
        </span>
      </div>
      <p className="font-dm-sans text-xs leading-relaxed text-charcoal/70">
        {rec.reasoning}
      </p>
      {rec.specialNote && (
        <p className="mt-1.5 border-l-2 border-gold/40 pl-2 font-dm-sans text-xs italic text-charcoal/50">
          {rec.specialNote}
        </p>
      )}
      <span className="mt-2 inline-flex items-center gap-1 font-dm-sans text-xs font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
        View Profile →
      </span>
    </Link>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const time = msg.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-gold px-4 py-2.5 font-dm-sans text-sm text-cream">
          {msg.content}
        </div>
        <span className="pr-1 font-dm-sans text-[10px] text-charcoal/40">{time}</span>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="max-w-[90%] space-y-2">
        {/* Text message or recommendation intro */}
        <div className="rounded-2xl rounded-bl-sm border border-gold/20 bg-cream px-4 py-2.5 font-dm-sans text-sm text-charcoal">
          {msg.content}
        </div>
        {/* Salon cards if recommendations */}
        {msg.type === "recommendations" && msg.recommendations && (
          <div className="space-y-2">
            {msg.recommendations.map((rec) => (
              <SalonRecommendationCard key={rec.salonId} rec={rec} />
            ))}
          </div>
        )}
      </div>
      <span className="pl-1 font-dm-sans text-[10px] text-charcoal/40">{time}</span>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────
export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "assistant",
      content:
        "Namaste! 🌸 I'm your LUNÉVIA Concierge. Tell me about your wedding — your date, budget, style, and I'll find your perfect bridal artist.",
      type: "text",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsSent, setSuggestionsSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setSuggestionsSent(true);
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history for API (exclude init greeting from history)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "init")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message ?? "I'm here to help! Tell me more about your vision.",
        type: data.type ?? "text",
        recommendations: data.recommendations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having a little trouble right now. Please try again in a moment. 🌸",
          type: "text",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* ── FAB Button ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            aria-label="Open LUNÉVIA Concierge"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gold shadow-[0_4px_24px_rgba(201,147,58,0.55)]"
            style={{
              animation: "concierge-pulse 2.5s ease-in-out infinite",
            }}
          >
            {/* Sparkle / wand icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FAF6F0"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 4V2" />
              <path d="M15 16v-2" />
              <path d="M8 9h2" />
              <path d="M20 9h2" />
              <path d="M17.8 11.8 19 13" />
              <path d="M15 9h0" />
              <path d="M17.8 6.2 19 5" />
              <path d="m3 21 9-9" />
              <path d="M12.2 6.2 11 5" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-blush shadow-[0_16px_64px_rgba(26,10,0,0.2)]",
              // Desktop
              "bottom-6 right-6 h-[520px] w-[380px]",
              // Mobile: full-width bottom sheet
              "max-sm:bottom-0 max-sm:right-0 max-sm:h-[85vh] max-sm:w-full max-sm:rounded-b-none"
            )}
          >
            {/* ── Header ── */}
            <div className="flex shrink-0 items-center justify-between border-b border-gold/15 bg-primary px-4 py-3">
              {/* Mobile drag handle */}
              <div className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-cream/20 sm:hidden" />

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C9933A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-cormorant text-base font-semibold leading-none text-cream">
                    LUNÉVIA Concierge
                  </p>
                  <p className="font-dm-sans text-[10px] text-cream/50">
                    AI Bridal Consultant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream/60 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <MessageBubble msg={msg} />
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start"
                >
                  <div className="rounded-2xl rounded-bl-sm border border-gold/20 bg-cream">
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Suggestion Chips ── */}
            <AnimatePresence>
              {!suggestionsSent && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0 space-y-1.5 overflow-hidden border-t border-gold/10 px-3 pb-2 pt-2"
                >
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="block w-full rounded-xl border border-gold/25 bg-cream/80 px-3 py-2 text-left font-dm-sans text-xs text-charcoal/80 transition-all hover:border-gold/60 hover:bg-cream"
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input ── */}
            <div className="shrink-0 border-t border-gold/15 bg-cream/50 px-3 py-3">
              <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-cream px-4 py-2 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/20">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about your wedding..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent font-dm-sans text-sm text-primary placeholder-charcoal/40 focus:outline-none disabled:opacity-50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-cream transition-opacity disabled:opacity-40"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse animation keyframe injected globally */}
      <style jsx global>{`
        @keyframes concierge-pulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(201, 147, 58, 0.55); }
          50% { box-shadow: 0 4px 36px rgba(201, 147, 58, 0.85), 0 0 0 8px rgba(201, 147, 58, 0.12); }
        }
      `}</style>
    </>
  );
}
