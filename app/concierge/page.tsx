"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/components/ai/ConciergeWidget";

interface SalonRec {
  salonId: string;
  salonName: string;
  slug: string;
  matchScore: number;
  reasoning: string;
  specialNote: string;
}

type FullMessage = ChatMessage & { recommendations?: SalonRec[] };

const PROMPT_CARDS = [
  { icon: "💄", label: "Find a Makeup Artist", sub: "By budget, style or location", prompt: "I'm looking for a bridal makeup artist in Delhi. Can you help me find the right one?" },
  { icon: "💇", label: "Hairstyle Advice", sub: "For my face shape and outfit", prompt: "I need hairstyle advice for my wedding. Can you recommend artists known for great bridal hair?" },
  { icon: "📅", label: "Build My Package", sub: "Full bridal package planner", prompt: "Help me plan a complete bridal beauty package — makeup, hair, mehendi and pre-bridal care." },
  { icon: "✍️", label: "Mehendi Recommendations", sub: "Style matching for my outfit", prompt: "I need mehendi recommendations. Can you suggest artists who do beautiful contemporary and traditional designs?" },
];

const FEATURES = [
  { icon: "✨", label: "Personalised Matching" },
  { icon: "💰", label: "Budget-Aware" },
  { icon: "⚡", label: "Instant Results" },
];

// ─── Floating sparkle orbs for the left panel ─────────────────────────────
function SparkleOrbs() {
  const orbs = [
    { size: 180, top: "10%", left: "60%", delay: 0, duration: 8 },
    { size: 120, top: "55%", left: "5%", delay: 2, duration: 10 },
    { size: 80, top: "75%", left: "70%", delay: 1, duration: 7 },
    { size: 60, top: "30%", left: "80%", delay: 3, duration: 9 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#C9933A]/10 blur-xl"
          style={{ width: orb.size, height: orb.size, top: orb.top, left: orb.left }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Animated gold divider ─────────────────────────────────────────────────
function GoldDivider() {
  return (
    <svg width="160" height="16" viewBox="0 0 200 16" fill="none" className="my-6" aria-hidden>
      <motion.line x1="0" y1="8" x2="70" y2="8" stroke="#C9933A" strokeWidth="1" strokeOpacity="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
      <circle cx="82" cy="8" r="3.5" fill="#C9933A" fillOpacity="0.7" />
      <circle cx="100" cy="8" r="6" fill="none" stroke="#C9933A" strokeWidth="1.5" strokeOpacity="0.9" />
      <circle cx="100" cy="8" r="2.5" fill="#C9933A" />
      <circle cx="118" cy="8" r="3.5" fill="#C9933A" fillOpacity="0.7" />
      <motion.line x1="130" y1="8" x2="200" y2="8" stroke="#C9933A" strokeWidth="1" strokeOpacity="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.5 }} />
    </svg>
  );
}

// ─── Testimonial card ──────────────────────────────────────────────────────
function TestimonialCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
      className="relative rounded-2xl border border-[#C9933A]/30 bg-[#C9933A]/10 p-5 backdrop-blur-sm shadow-[0_4px_24px_rgba(201,147,58,0.15)]"
    >
      <div className="mb-3 flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-[#C9933A] text-sm">★</span>
        ))}
      </div>
      <p className="font-cormorant text-[17px] italic leading-relaxed text-[#FAF6F0]/90">
        &ldquo;The AI matched me with the perfect artist for my South Delhi wedding — exactly within my ₹22k budget.&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#C9933A]/30 font-dm-sans text-xs font-semibold text-[#C9933A]">
          PS
        </div>
        <div>
          <p className="font-dm-sans text-xs font-medium text-[#FAF6F0]/90">Priya Sharma</p>
          <p className="font-dm-sans text-[10px] text-[#FAF6F0]/60">Married January 2026</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ──────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span key={i} className="block h-2.5 w-2.5 rounded-full bg-gold"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />
      ))}
    </div>
  );
}

// ─── Salon recommendation card ─────────────────────────────────────────────
function SalonCard({ rec }: { rec: SalonRec }) {
  return (
    <Link href={`/salon/${rec.slug}`}
      className="group block rounded-2xl border border-[#C9933A]/30 bg-[#F5E8DC]/60 p-4 transition-all hover:border-[#C9933A] hover:shadow-[0_4px_20px_rgba(201,147,58,0.15)]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="font-cormorant text-xl font-semibold text-primary">{rec.salonName}</span>
        <span className="shrink-0 rounded-full bg-[#C9933A]/15 px-2.5 py-1 font-dm-sans text-xs font-semibold text-gold">{rec.matchScore}% match</span>
      </div>
      <p className="font-dm-sans text-sm leading-relaxed text-[#2E1F1F]/70">{rec.reasoning}</p>
      {rec.specialNote && (
        <p className="mt-2 border-l-2 border-[#C9933A]/40 pl-3 font-dm-sans text-xs italic text-[#2E1F1F]/50">💡 {rec.specialNote}</p>
      )}
      <span className="mt-3 inline-flex items-center gap-1 font-dm-sans text-sm font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">View Profile →</span>
    </Link>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: FullMessage }) {
  const isUser = msg.role === "user";
  const time = msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-gold px-5 py-3 font-dm-sans text-sm text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)]">
          {msg.content}
        </div>
        <span className="pr-1 font-dm-sans text-[11px] text-[#2E1F1F]/40">{time}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="space-y-3">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-[#C9933A]/15 bg-white px-5 py-3 font-dm-sans text-sm leading-relaxed text-charcoal shadow-sm">
            {msg.content}
          </div>
          {msg.type === "recommendations" && msg.recommendations && (
            <div className="space-y-3">
              {msg.recommendations.map((rec) => <SalonCard key={rec.salonId} rec={rec} />)}
            </div>
          )}
        </div>
        <span className="mt-1 pl-1 font-dm-sans text-[11px] text-[#2E1F1F]/40">{time}</span>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ConciergePage() {
  const [messages, setMessages] = useState<FullMessage[]>([{
    id: "init", role: "assistant",
    content: "Namaste! 🌸 I'm your LUNÉVIA Concierge. Tell me about your wedding — your date, budget, style, location, and I'll find the perfect bridal artist for you.",
    type: "text", timestamp: new Date(),
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptCardsSent, setPromptCardsSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    setPromptCardsSent(true);
    setInput("");

    const userMsg: FullMessage = { id: Date.now().toString(), role: "user", content: trimmed, type: "text", timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].filter((m) => m.id !== "init").map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/concierge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const data = await res.json();
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(), role: "assistant",
        content: data.message ?? "I'm here to help!", type: data.type ?? "text",
        recommendations: data.recommendations, timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm having a little trouble right now. Please try again in a moment. 🌸", type: "text", timestamp: new Date() }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row">

      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL — Dark luxury hero
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative hidden overflow-hidden md:flex md:w-[40%] md:flex-col md:justify-between md:px-10 md:py-10 lg:px-14 lg:py-14"
        style={{ background: "linear-gradient(160deg, #1A0A00 0%, #2C1200 50%, #1A0A00 100%)" }}
      >
        {/* Background elements */}
        <SparkleOrbs />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
        />

        {/* TOP CONTENT */}
        <div className="relative z-10">
          <Link href="/"
            className="mb-10 inline-flex items-center gap-2 font-dm-sans text-sm font-medium text-[#FAF6F0]/60 transition-all hover:text-gold group"
          >
            <motion.span whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </motion.span>
            Back to LUNÉVIA
          </Link>

          {/* Logo badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9933A]/40 bg-[#C9933A]/10 px-4 py-1.5 shadow-[0_0_15px_rgba(201,147,58,0.15)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            <span className="font-dm-sans text-xs font-semibold uppercase tracking-[0.15em] text-[#C9933A]">
              AI-Powered Concierge
            </span>
          </motion.div>

          <GoldDivider />

          {/* Hero title */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <h1 className="font-cormorant text-5xl font-semibold leading-[1.08] text-cream lg:text-6xl">
              Meet Your
              <br />
              <span className="relative">
                <span className="relative z-10 text-gold">AI Bridal</span>
              </span>
              <br />
              Consultant
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="mt-5 max-w-xs font-dm-sans text-sm leading-relaxed text-[#FAF6F0]/90"
          >
            Describe your vision. Get matched to Delhi&apos;s finest bridal artists — personalised to your budget, complexion, and style.
          </motion.p>

          {/* Feature pills */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {FEATURES.map((f, i) => (
              <motion.span key={f.label}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#C9933A]/40 bg-[#C9933A]/20 px-3.5 py-1.5 font-dm-sans text-xs font-medium text-[#FAF6F0]/90 hover:bg-[#C9933A]/30 hover:border-[#C9933A]/60 transition-all cursor-default"
              >
                <span className="text-sm">{f.icon}</span>
                {f.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Testimonial */}
          <div className="mt-8">
            <TestimonialCard />
          </div>
        </div>

        {/* BOTTOM STATS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 grid grid-cols-3 gap-4 border-t border-[#C9933A]/30 pt-7"
        >
          {[
            { value: "200+", label: "Verified Artists" },
            { value: "4.9★", label: "Avg. Rating" },
            { value: "1000+", label: "Happy Brides" },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <p className="font-cormorant text-2xl font-semibold text-gold">{stat.value}</p>
              <p className="mt-0.5 font-dm-sans text-xs text-[#FAF6F0]/70">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT PANEL — Chat interface
      ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-1 flex-col overflow-hidden bg-cream">
        {/* Chat header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-[#C9933A]/15 bg-white/70 px-5 py-3.5 backdrop-blur-sm md:px-8">
          <Link href="/" className="mr-1 text-[#2E1F1F]/40 transition-colors hover:text-gold md:hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </Link>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-[0_2px_12px_rgba(26,10,0,0.25)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2" strokeLinecap="round">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>
          <div>
            <p className="font-cormorant text-lg font-semibold leading-tight text-primary">LUNÉVIA Concierge</p>
            <p className="flex items-center gap-1.5 font-dm-sans text-xs text-[#2E1F1F]/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI Bridal Consultant · Always online
            </p>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Prompt cards */}
          <AnimatePresence>
            {!promptCardsSent && (
              <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.4 }} className="overflow-hidden px-5 pt-6 md:px-8"
              >
                <p className="mb-4 font-dm-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2E1F1F]/40">
                  What can I help you with?
                </p>
                <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                  {PROMPT_CARDS.map((card, i) => (
                    <motion.button key={card.label}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07, ease: "easeOut" }}
                      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(201,147,58,0.15)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(card.prompt)}
                      className="group rounded-2xl border border-[#C9933A]/20 bg-white p-4 text-left shadow-sm transition-all hover:border-[#C9933A]/50 hover:bg-[#F5E8DC]/30"
                    >
                      <span className="mb-2 block text-2xl">{card.icon}</span>
                      <p className="font-cormorant text-base font-semibold leading-tight text-primary">{card.label}</p>
                      <p className="mt-1 font-dm-sans text-xs text-[#2E1F1F]/60">{card.sub}</p>
                      <span className="mt-2 inline-flex items-center gap-1 font-dm-sans text-xs font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
                        Ask this →
                      </span>
                    </motion.button>
                  ))}
                </div>
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#C9933A]/20" />
                  <span className="font-dm-sans text-[11px] uppercase tracking-widest text-[#2E1F1F]/30">or type your own</span>
                  <div className="h-px flex-1 bg-[#C9933A]/20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="space-y-5 px-5 py-4 md:px-8">
            {messages.map((msg) => (
              <motion.div key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <MessageBubble msg={msg} />
              </motion.div>
            ))}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9933A" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-[#C9933A]/15 bg-white shadow-sm">
                  <TypingIndicator />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-[#C9933A]/15 bg-white/90 px-5 py-4 backdrop-blur-md md:px-8">
          <div className={cn(
            "flex items-center gap-3 rounded-2xl border px-5 py-3 transition-all duration-200",
            input ? "border-gold bg-white shadow-[0_0_0_3px_rgba(201,147,58,0.1)]" : "border-[#C9933A]/25 bg-[#F5E8DC]/40 hover:border-[#C9933A]/40"
          )}>
            <input ref={inputRef} type="text" value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Tell me about your dream wedding look..."
              className="flex-1 bg-transparent font-dm-sans text-sm text-primary placeholder-[#2E1F1F]/40 focus:outline-none disabled:opacity-50"
            />
            <motion.button
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-cream shadow-[0_3px_10px_rgba(201,147,58,0.45)] transition-opacity disabled:opacity-35"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
          <p className="mt-2 text-center font-dm-sans text-[11px] text-[#2E1F1F]/40">
            LUNÉVIA Concierge is AI-powered · Always verify details directly with the artist
          </p>
        </div>
      </div>
    </div>
  );
}
