"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

import { Badge } from "@/components/ui/Badge";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import { cn } from "@/lib/utils";
import { AuthGuard } from "@/components/auth/AuthGuard";
import type {
  Aesthetic,
  BudgetRange,
  PackageBuilderAnswers,
  PackageApiResponse,
  Service,
  SkinTone,
} from "@/lib/types/packageBuilder";

const STEP_LABELS = [
  "Wedding Date",
  "Budget",
  "Services",
  "Aesthetic",
  "Skin & Notes",
] as const;

type Step = 1 | 2 | 3 | 4 | 5 | 6; // 6 is results

interface ProgressIndicatorProps {
  currentStep: Step;
}

function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = (index + 1) as Step;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;

          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors duration-[400ms]",
                      currentStep > index ? "bg-gold" : "bg-gold/20"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-dm-sans text-xs font-semibold transition-colors duration-[400ms]",
                    isCompleted && "border-gold bg-gold text-primary",
                    isActive && "border-gold bg-gold text-primary",
                    !isCompleted &&
                      !isActive &&
                      "border-gold/30 bg-transparent text-charcoal/40"
                  )}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                {index < STEP_LABELS.length - 1 && (
                  <div
                    className={cn(
                      "h-px flex-1 transition-colors duration-[400ms]",
                      currentStep > stepNumber ? "bg-gold" : "bg-gold/20"
                    )}
                  />
                )}
              </div>
              <span
                className={cn(
                  "mt-2 hidden text-center font-dm-sans text-[10px] uppercase tracking-wider sm:block",
                  isActive || isCompleted ? "text-gold" : "text-charcoal/40"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BudgetCardProps {
  range: BudgetRange;
  label: string;
  includes: string;
  selected: boolean;
  onClick: () => void;
}

function BudgetCard({
  range,
  label,
  includes,
  selected,
  onClick,
}: BudgetCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-6 text-left transition-all duration-[400ms]",
        selected
          ? "border-gold bg-gold/10 shadow-warm"
          : "border-gold/20 bg-white hover:border-gold/40"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-cormorant text-xl font-medium text-primary">
            {label}
          </p>
          <p className="mt-3 font-dm-sans text-sm text-charcoal/70">{includes}</p>
        </div>
        {selected && (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs text-primary"
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </div>
    </button>
  );
}

interface ServicePillProps {
  service: Service;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function ServicePill({ service, label, selected, onClick }: ServicePillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 font-dm-sans text-sm font-medium transition-all duration-[400ms]",
        selected
          ? "border-gold bg-gold text-primary"
          : "border-gold/20 bg-white text-charcoal hover:border-gold/40"
      )}
    >
      {label}
    </button>
  );
}

interface AestheticCardProps {
  aesthetic: Aesthetic;
  emoji: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function AestheticCard({
  aesthetic,
  emoji,
  label,
  selected,
  onClick,
}: AestheticCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-6 text-center transition-all duration-[400ms]",
        selected
          ? "border-gold bg-gold/10 shadow-warm"
          : "border-gold/20 bg-white hover:border-gold/40"
      )}
    >
      <div className="mb-4 text-4xl">{emoji}</div>
      <p className="font-cormorant text-lg font-medium text-primary">{label}</p>
      {selected && (
        <span className="mt-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs text-primary">
          ✓
        </span>
      )}
    </button>
  );
}

interface SkinToneSwatchProps {
  tone: SkinTone;
  hex: string;
  selected: boolean;
  onClick: () => void;
}

function SkinToneSwatch({
  tone,
  hex,
  selected,
  onClick,
}: SkinToneSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-12 w-12 rounded-full border-2 transition-all duration-[400ms]",
        selected ? "border-gold shadow-warm" : "border-transparent hover:border-gold/30"
      )}
      style={{ backgroundColor: hex }}
      title={tone}
      aria-label={tone}
    />
  );
}

function ConfettiDots() {
  const dots = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.4,
        size: 4 + Math.random() * 6,
        duration: 1.2 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {dots.map((dot) => (
        <motion.span
          key={dot.id}
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -80 - Math.random() * 40],
            scale: 1,
          }}
          transition={{
            duration: dot.duration,
            delay: dot.delay,
            ease: "easeOut",
          }}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${dot.x}%`,
            top: "40%",
            width: dot.size,
            height: dot.size,
          }}
        />
      ))}
    </div>
  );
}

interface ResultsPageProps {
  package: PackageApiResponse;
  onStartOver: () => void;
}

function ResultsPage({ package: pkg, onStartOver }: ResultsPageProps) {
  const router = useRouter();
  const [expandedServices, setExpandedServices] = useState<string[]>([]);

  const toggleService = (name: string) => {
    setExpandedServices((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="relative"
    >
      <ConfettiDots />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
        className="mb-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-primary shadow-warm"
        >
          ✓
        </motion.div>

        <h1 className="font-cormorant text-5xl text-gold md:text-6xl">
          {pkg.packageName}
        </h1>
        <p className="mt-3 font-dm-sans italic text-charcoal/70">
          {pkg.tagline}
        </p>

        <div className="mt-6 inline-block rounded-full border border-gold bg-gold/10 px-6 py-3 font-cormorant text-2xl font-medium text-gold">
          {pkg.totalEstimate}
        </div>
      </motion.div>

      {/* Personal Note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        className="mx-auto mb-12 max-w-2xl rounded-2xl border border-gold/20 bg-blush p-8 text-center shadow-warm"
      >
        <p className="font-dm-sans text-charcoal">{pkg.personalNote}</p>
      </motion.div>

      {/* Services Accordion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
        className="mx-auto mb-12 max-w-3xl space-y-3"
      >
        <h2 className="font-cormorant text-3xl text-primary">Services</h2>
        {pkg.services.map((service, index) => {
          const isExpanded = expandedServices.includes(service.name);
          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
              className="rounded-2xl border border-gold/20 bg-white shadow-warm transition-all duration-[400ms]"
            >
              <button
                type="button"
                onClick={() => toggleService(service.name)}
                className="flex w-full items-center justify-between gap-4 p-6 text-left hover:bg-blush/30"
              >
                <div className="flex-1">
                  <h3 className="font-dm-sans font-medium text-primary">
                    {service.name}
                  </h3>
                  <p className="mt-1 font-cormorant text-lg text-gold">
                    {service.estimatedCost}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xl text-gold transition-transform duration-[400ms]",
                    isExpanded && "rotate-180"
                  )}
                  aria-hidden="true"
                >
                  ⌄
                </span>
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="border-t border-gold/10 px-6 py-4"
                >
                  <p className="font-dm-sans text-sm text-charcoal/70">
                    {service.description}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeInOut" }}
        className="mx-auto mb-12 max-w-3xl"
      >
        <h2 className="font-cormorant text-3xl text-primary">Timeline</h2>

        <div className="relative mt-8 space-y-6 pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3.5 top-2 bottom-0 w-px bg-gradient-to-b from-gold via-gold to-gold/30"
            aria-hidden="true"
          />

          {pkg.timeline.map((item, index) => (
            <motion.div
              key={`${item.weeksBeforeWedding}-${item.task}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.65 + index * 0.05 }}
            >
              <div className="relative">
                {/* Dot */}
                <div
                  className={cn(
                    "absolute -left-6.5 top-1 h-4 w-4 rounded-full border-2 border-primary",
                    item.priority === "high" ? "bg-gold" : "bg-gold/40"
                  )}
                  aria-hidden="true"
                />

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-dm-sans font-semibold text-primary">
                      {item.weeksBeforeWedding === 1
                        ? "1 week before"
                        : `${item.weeksBeforeWedding} weeks before`}
                    </p>
                    <Badge
                      variant={
                        item.priority === "high" ? "gold" : "blush"
                      }
                    >
                      {item.priority === "high" ? "Priority" : "Standard"}
                    </Badge>
                  </div>
                  <p className="mt-1 font-dm-sans text-sm text-charcoal/70">
                    {item.task}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Artist Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeInOut" }}
        className="mx-auto mb-12 max-w-3xl rounded-2xl border border-gold bg-gold/5 p-8 shadow-warm"
      >
        <p className="font-dm-sans text-sm uppercase tracking-wider text-gold">
          Top Artist Match
        </p>
        <h3 className="mt-2 font-cormorant text-3xl text-primary">
          {pkg.topArtistMatch}
        </h3>
      </motion.div>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9, ease: "easeInOut" }}
        className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-6"
      >
        <LuneviaButton
          size="lg"
          onClick={async () => {
            const { supabase } = await import("@/lib/supabase");
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              alert("Please log in to save your package!");
              router.push("/login");
              return;
            }

            const { error } = await supabase.from("saved_packages").insert({
              customer_id: user.id,
              package_data: pkg,
            });

            if (error) {
              alert(`Error saving package: ${error.message}`);
            } else {
              alert("✓ Package saved to your profile!");
            }
          }}
        >
          Save My Package
        </LuneviaButton>
        <LuneviaButton
          variant="ghost"
          size="lg"
          onClick={() => router.push("/concierge")}
        >
          Book a Consultation →
        </LuneviaButton>
        <LuneviaButton
          variant="ghost"
          size="lg"
          onClick={onStartOver}
        >
          Create Another Package
        </LuneviaButton>
      </motion.div>
    </motion.div>
  );
}

export default function PackageBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPackage, setGeneratedPackage] =
    useState<PackageApiResponse | null>(null);

  // Form state
  const [weddingDate, setWeddingDate] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<BudgetRange | null>(null);
  const [selectedServices, setSelectedServices] = useState<Set<Service>>(
    new Set()
  );
  const [aesthetic, setAesthetic] = useState<Aesthetic | null>(null);
  const [skinTone, setSkinTone] = useState<SkinTone | null>(null);
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const toggleService = (service: Service) => {
    setSelectedServices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(service)) {
        newSet.delete(service);
      } else {
        newSet.add(service);
      }
      return newSet;
    });
  };

  const handleGeneratePackage = async () => {
    if (
      !weddingDate ||
      !budgetRange ||
      selectedServices.size === 0 ||
      !aesthetic ||
      !skinTone
    ) {
      setError("Please complete all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const answers: PackageBuilderAnswers = {
        weddingDate,
        budgetRange,
        services: Array.from(selectedServices),
        aesthetic,
        skinTone,
        specialNotes: specialNotes.trim() || undefined,
      };

      const response = await fetch("/api/ai/package", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate package");
      }

      const packageData: PackageApiResponse = await response.json();
      setGeneratedPackage(packageData);
      setStep(6);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 6 && generatedPackage) {
    return (
      <AuthGuard>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
          <Link
            href="/"
            className="font-dm-sans text-sm text-gold transition-colors hover:text-gold/80"
          >
            ← Back to Home
          </Link>

          <ResultsPage
            package={generatedPackage}
            onStartOver={() => {
              setStep(1);
              setWeddingDate("");
              setBudgetRange(null);
              setSelectedServices(new Set());
              setAesthetic(null);
              setSkinTone(null);
              setSpecialNotes("");
              setGeneratedPackage(null);
              setError(null);
            }}
          />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <div className="mb-6">
        <Link
          href="/"
          className="font-dm-sans text-sm text-gold transition-colors hover:text-gold/80"
        >
          ← Back to Home
        </Link>
        <h1 className="mt-3 font-cormorant text-4xl text-primary md:text-5xl">
          Your Bridal Package
        </h1>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/70">
          Personalized beauty planning, perfectly timed
        </p>
      </div>

      <ProgressIndicator currentStep={step} />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-rose bg-rose/10 p-4 font-dm-sans text-sm text-rose"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 1: Wedding Date */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-cormorant text-4xl text-primary">
                  When is your wedding?
                </h2>
                <p className="mt-2 font-dm-sans text-charcoal/70">
                  This helps us create a timeline that works for you
                </p>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm">
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gold bg-white px-4 py-3 font-dm-sans text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>

              <p className="text-center font-dm-sans text-sm text-charcoal/60">
                <button
                  type="button"
                  className="font-medium text-gold hover:text-gold/80"
                  onClick={() => setStep(2)}
                >
                  I&apos;m just exploring →
                </button>
              </p>
            </div>

            <div className="mt-12 flex justify-end">
              <LuneviaButton
                size="lg"
                disabled={!weddingDate}
                onClick={() => setStep(2)}
              >
                Continue →
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {/* Step 2: Budget Range */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-cormorant text-4xl text-primary">
                  What&apos;s your bridal beauty budget?
                </h2>
                <p className="mt-2 font-dm-sans text-charcoal/70">
                  All ranges include luxury services and premium results
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <BudgetCard
                  range="under-15000"
                  label="Under ₹15,000"
                  includes="Bridal makeup · Pre-bridal prep"
                  selected={budgetRange === "under-15000"}
                  onClick={() => setBudgetRange("under-15000")}
                />
                <BudgetCard
                  range="15000-30000"
                  label="₹15,000–₹30,000"
                  includes="Makeup · Hair styling · Facials"
                  selected={budgetRange === "15000-30000"}
                  onClick={() => setBudgetRange("15000-30000")}
                />
                <BudgetCard
                  range="30000-60000"
                  label="₹30,000–₹60,000"
                  includes="Full bridal suite + mehendi"
                  selected={budgetRange === "30000-60000"}
                  onClick={() => setBudgetRange("30000-60000")}
                />
                <BudgetCard
                  range="60000-plus"
                  label="₹60,000+"
                  includes="Premium everything + family"
                  selected={budgetRange === "60000-plus"}
                  onClick={() => setBudgetRange("60000-plus")}
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <LuneviaButton variant="ghost" onClick={() => setStep(1)}>
                ← Back
              </LuneviaButton>
              <LuneviaButton
                size="lg"
                disabled={!budgetRange}
                onClick={() => setStep(3)}
              >
                Continue →
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {/* Step 3: Services */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-cormorant text-4xl text-primary">
                  Which services do you need?
                </h2>
                <p className="mt-2 font-dm-sans text-charcoal/70">
                  Select one or more services
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <ServicePill
                  service="bridal-makeup"
                  label="Bridal Makeup"
                  selected={selectedServices.has("bridal-makeup")}
                  onClick={() => toggleService("bridal-makeup")}
                />
                <ServicePill
                  service="pre-bridal-facials"
                  label="Pre-Bridal Facials"
                  selected={selectedServices.has("pre-bridal-facials")}
                  onClick={() => toggleService("pre-bridal-facials")}
                />
                <ServicePill
                  service="hair-styling"
                  label="Hair Styling"
                  selected={selectedServices.has("hair-styling")}
                  onClick={() => toggleService("hair-styling")}
                />
                <ServicePill
                  service="mehendi"
                  label="Mehendi"
                  selected={selectedServices.has("mehendi")}
                  onClick={() => toggleService("mehendi")}
                />
                <ServicePill
                  service="engagement-makeup"
                  label="Engagement Makeup"
                  selected={selectedServices.has("engagement-makeup")}
                  onClick={() => toggleService("engagement-makeup")}
                />
                <ServicePill
                  service="family-makeup"
                  label="Family Makeup"
                  selected={selectedServices.has("family-makeup")}
                  onClick={() => toggleService("family-makeup")}
                />
                <ServicePill
                  service="nail-art"
                  label="Nail Art"
                  selected={selectedServices.has("nail-art")}
                  onClick={() => toggleService("nail-art")}
                />
                <ServicePill
                  service="draping"
                  label="Draping"
                  selected={selectedServices.has("draping")}
                  onClick={() => toggleService("draping")}
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <LuneviaButton variant="ghost" onClick={() => setStep(2)}>
                ← Back
              </LuneviaButton>
              <LuneviaButton
                size="lg"
                disabled={selectedServices.size === 0}
                onClick={() => setStep(4)}
              >
                Continue →
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {/* Step 4: Aesthetic */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-cormorant text-4xl text-primary">
                  What&apos;s your bridal aesthetic?
                </h2>
                <p className="mt-2 font-dm-sans text-charcoal/70">
                  Choose the vibe that feels like you
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <AestheticCard
                  aesthetic="soft-dewy"
                  emoji="🌸"
                  label="Soft & Dewy"
                  selected={aesthetic === "soft-dewy"}
                  onClick={() => setAesthetic("soft-dewy")}
                />
                <AestheticCard
                  aesthetic="glamorous-bold"
                  emoji="✨"
                  label="Glamorous & Bold"
                  selected={aesthetic === "glamorous-bold"}
                  onClick={() => setAesthetic("glamorous-bold")}
                />
                <AestheticCard
                  aesthetic="natural-minimal"
                  emoji="🌿"
                  label="Natural & Minimal"
                  selected={aesthetic === "natural-minimal"}
                  onClick={() => setAesthetic("natural-minimal")}
                />
                <AestheticCard
                  aesthetic="traditional-regal"
                  emoji="👑"
                  label="Traditional & Regal"
                  selected={aesthetic === "traditional-regal"}
                  onClick={() => setAesthetic("traditional-regal")}
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <LuneviaButton variant="ghost" onClick={() => setStep(3)}>
                ← Back
              </LuneviaButton>
              <LuneviaButton
                size="lg"
                disabled={!aesthetic}
                onClick={() => setStep(5)}
              >
                Continue →
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {/* Step 5: Skin & Notes */}
        {step === 5 && (
          <motion.div
            key="step-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="font-cormorant text-4xl text-primary">
                  Tell us about your skin
                </h2>
                <p className="mt-2 font-dm-sans text-charcoal/70">
                  This helps us recommend the perfect products and techniques
                </p>
              </div>

              <div>
                <label className="block font-dm-sans text-sm font-medium text-charcoal/70">
                  Skin Tone
                </label>
                <div className="mt-4 flex gap-4">
                  <SkinToneSwatch
                    tone="fair"
                    hex="#F5D5B0"
                    selected={skinTone === "fair"}
                    onClick={() => setSkinTone("fair")}
                  />
                  <SkinToneSwatch
                    tone="light"
                    hex="#E8B59D"
                    selected={skinTone === "light"}
                    onClick={() => setSkinTone("light")}
                  />
                  <SkinToneSwatch
                    tone="medium"
                    hex="#D9A88A"
                    selected={skinTone === "medium"}
                    onClick={() => setSkinTone("medium")}
                  />
                  <SkinToneSwatch
                    tone="olive"
                    hex="#C9A86C"
                    selected={skinTone === "olive"}
                    onClick={() => setSkinTone("olive")}
                  />
                  <SkinToneSwatch
                    tone="deep"
                    hex="#876B42"
                    selected={skinTone === "deep"}
                    onClick={() => setSkinTone("deep")}
                  />
                  <SkinToneSwatch
                    tone="dark"
                    hex="#5C3D2E"
                    selected={skinTone === "dark"}
                    onClick={() => setSkinTone("dark")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="special-notes"
                  className="block font-dm-sans text-sm font-medium text-charcoal/70"
                >
                  Any skin concerns or special requests? (Optional)
                </label>
                <textarea
                  id="special-notes"
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="E.g., sensitive skin, oily T-zone, acne-prone, preference for natural products..."
                  className="mt-3 h-32 w-full rounded-2xl border border-gold/20 bg-white px-4 py-3 font-dm-sans text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>

            <div className="mt-12 flex items-center justify-between gap-4">
              <LuneviaButton variant="ghost" onClick={() => setStep(4)}>
                ← Back
              </LuneviaButton>
              <LuneviaButton
                size="lg"
                disabled={!skinTone || loading}
                onClick={handleGeneratePackage}
                className={loading ? "opacity-50" : ""}
              >
                {loading ? "Creating your package..." : "Create My Package →"}
              </LuneviaButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </AuthGuard>
  );
}
