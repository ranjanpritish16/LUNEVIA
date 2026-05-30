"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type {
  ConciergeApiResponse,
  ConciergeRecommendation,
} from "@/lib/types/concierge";
import { cn } from "@/lib/utils";

const OPENING_MESSAGE =
  "Hello! I'm your personal LUNÉVIA Concierge. Tell me about your wedding — your complexion, style vision, budget and date — and I'll match you to the perfect Delhi artist. ✨";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: ConciergeRecommendation[];
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-gold/30 bg-cream px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-gold"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: ConciergeRecommendation;
}) {
  return (
    <div className="rounded-xl border border-gold/20 bg-white p-3 shadow-warm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-cormorant text-lg leading-tight text-primary">
          {recommendation.salonName}
        </h4>
        <span className="shrink-0 rounded-full bg-gold px-2 py-0.5 font-dm-sans text-[10px] font-semibold text-primary">
          {recommendation.matchScore}% match
        </span>
      </div>
      <p className="mt-2 font-dm-sans text-xs leading-relaxed text-charcoal">
        {recommendation.reasoning}
      </p>
      {recommendation.specialNote && (
        <p className="mt-1.5 font-dm-sans text-xs italic text-gold/90">
          {recommendation.specialNote}
        </p>
      )}
      {recommendation.slug && (
        <Link
          href={`/salon/${recommendation.slug}`}
          className="mt-2 inline-block font-dm-sans text-xs font-medium text-gold hover:text-gold/80"
        >
          View Profile →
        </Link>
      )}
    </div>
  );
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function ConciergeWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "opening", role: "assistant", content: OPENING_MESSAGE },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isLoading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: text }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = (await res.json()) as ConciergeApiResponse;

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.message,
          recommendations: data.recommendations,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content:
            "I'm so sorry — I'm having a moment. Please try again in a few seconds. ✨",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="mb-3 w-[350px] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-gold/20 bg-cream shadow-[0_8px_40px_rgba(201,147,58,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-gold/20 bg-white px-4 py-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full bg-gold"
                  aria-hidden="true"
                />
                <h2 className="font-cormorant text-xl text-primary">
                  LUNÉVIA Concierge ✨
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close concierge"
                className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-blush hover:text-primary"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-2xl p-3 font-dm-sans text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-gold text-primary"
                        : "border border-gold/30 bg-cream text-charcoal"
                    )}
                  >
                    {msg.content}
                  </div>
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <div className="w-full space-y-2">
                      {msg.recommendations.map((rec) => (
                        <RecommendationCard
                          key={rec.salonId}
                          recommendation={rec}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-gold/20 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your dream look..."
                  disabled={isLoading}
                  className="min-w-0 flex-1 rounded-full border border-gold/20 bg-cream px-4 py-2 font-dm-sans text-sm text-primary placeholder:text-charcoal/40 focus:border-gold focus:outline-none disabled:opacity-60"
                  aria-label="Message LUNÉVIA Concierge"
                />
                <button
                  type="button"
                  onClick={() => void sendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-primary transition-all hover:bg-gold/90 disabled:opacity-40"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="group relative">
        <motion.button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Close LUNÉVIA Concierge" : "Open LUNÉVIA Concierge"}
          aria-expanded={isOpen}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl text-primary shadow-[0_4px_24px_rgba(201,147,58,0.35)]"
        >
          ✨
        </motion.button>
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 font-dm-sans text-xs text-cream opacity-0 shadow-warm transition-opacity duration-[400ms] group-hover:opacity-100">
          LUNÉVIA Concierge
        </span>
      </div>
    </div>
  );
}
