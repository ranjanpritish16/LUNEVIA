"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";

import { Badge } from "@/components/ui/Badge";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import type { Salon, SalonService } from "@/lib/data/salons";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
] as const;

const STEP_LABELS = ["Select Service", "Choose Time", "Confirmed"] as const;

type TimeSlot = (typeof TIME_SLOTS)[number];

interface BookingFlowProps {
  salon: Salon;
}

function getTakenSlots(slug: string): TimeSlot[] {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const indexA = hash % TIME_SLOTS.length;
  const indexB = (hash + 3) % TIME_SLOTS.length;
  if (indexA === indexB) {
    return [TIME_SLOTS[indexA], TIME_SLOTS[(indexA + 1) % TIME_SLOTS.length]];
  }
  return [TIME_SLOTS[indexA], TIME_SLOTS[indexB]];
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

interface ProgressIndicatorProps {
  currentStep: number;
}

function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        {STEP_LABELS.map((label, index) => {
          const stepNumber = index + 1;
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

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

function CalendarPicker({ selectedDate, onSelect }: CalendarPickerProps) {
  const today = startOfDay(new Date());
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfWeek = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();

  const monthLabel = viewDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const canGoPrev =
    viewDate.getFullYear() > today.getFullYear() ||
    (viewDate.getFullYear() === today.getFullYear() &&
      viewDate.getMonth() > today.getMonth());

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goNext = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const dayCells: (Date | null)[] = [
    ...Array.from({ length: firstDayOfWeek }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => {
      return new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
    }),
  ];

  return (
    <div className="rounded-2xl border border-gold/20 bg-white p-5 shadow-warm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-cormorant text-xl text-primary">{monthLabel}</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gold transition-colors hover:bg-blush disabled:opacity-30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next month"
            className="flex h-8 w-8 items-center justify-center rounded-full text-gold transition-colors hover:bg-blush"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="py-1 text-center font-dm-sans text-[10px] font-medium uppercase tracking-wider text-charcoal/50"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {dayCells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const isPast = startOfDay(date) < today;
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(date)}
              className={cn(
                "flex h-9 w-full items-center justify-center rounded-full font-dm-sans text-sm transition-colors duration-[400ms]",
                isSelected && "bg-gold font-medium text-primary",
                !isSelected &&
                  !isPast &&
                  "text-charcoal hover:bg-blush hover:text-primary",
                isPast && "cursor-not-allowed text-charcoal/25"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface OrderSummaryProps {
  salon: Salon;
  service: SalonService | null;
  date: Date | null;
  time: string | null;
}

function OrderSummary({ salon, service, date, time }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-blush p-6 shadow-warm">
      <h3 className="font-cormorant text-2xl text-primary">Order Summary</h3>
      <dl className="mt-4 space-y-3 font-dm-sans text-sm">
        <div>
          <dt className="text-charcoal/60">Salon</dt>
          <dd className="font-medium text-primary">{salon.name}</dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Service</dt>
          <dd className="text-charcoal">
            {service?.name ?? "—"}
          </dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Date</dt>
          <dd className="text-charcoal">
            {date ? formatDateShort(date) : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Time</dt>
          <dd className="text-charcoal">{time ?? "—"}</dd>
        </div>
        <div className="border-t border-gold/20 pt-3">
          <dt className="text-charcoal/60">Total</dt>
          <dd className="font-cormorant text-2xl text-gold">
            {service?.price ?? "—"}
          </dd>
        </div>
      </dl>
    </div>
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
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {dots.map((dot) => (
        <motion.span
          key={dot.id}
          initial={{ opacity: 0, y: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], y: [-20, -80 - Math.random() * 40], scale: 1 }}
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

export function BookingFlow({ salon }: BookingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<SalonService | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingId] = useState(
    () => `LNV-2024-${String(Math.floor(1000 + Math.random() * 9000))}`
  );

  const [isBooking, setIsBooking] = useState(false);

  const [takenSlots, setTakenSlots] = useState<string[]>([]);

  // Load customer profile
  useEffect(() => {
    async function loadProfile() {
      const { supabase } = await import("@/lib/supabase");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", user.id)
          .single();
        if (profile) {
          if (profile.full_name) setCustomerName(profile.full_name);
          if (profile.phone_number) setCustomerPhone(profile.phone_number);
        }
      }
    }
    loadProfile();
  }, []);

  // Fetch taken slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setTakenSlots([]);
      return;
    }

    let active = true;
    async function fetchSlots() {
      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase
        .from("bookings")
        .select("time_slot")
        .eq("salon_id", salon.id)
        .eq("date", formatDateShort(selectedDate!))
        .in("status", ["pending", "confirmed"]);

      if (active && data) {
        setTakenSlots(data.map((b) => b.time_slot));
      }
    }
    fetchSlots();

    return () => {
      active = false;
    };
  }, [selectedDate, salon.id]);

  const canContinueStep1 = selectedService !== null && selectedDate !== null;
  const canConfirmStep2 = selectedTime !== null;

  async function handleConfirmBooking() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setIsBooking(true);

    const { supabase } = await import("@/lib/supabase");
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const finalName = customerName.trim() || user.email?.split("@")[0] || "Customer";
      const finalPhone = customerPhone.trim() || null;

      // 1. Save booking
      const { error } = await supabase.from("bookings").insert({
        salon_id: salon.id,
        customer_id: user.id,
        customer_name: finalName,
        customer_phone: finalPhone,
        service_id: selectedService.id,
        date: formatDateShort(selectedDate),
        time_slot: selectedTime,
        total_amount: parseInt(String(selectedService.price).replace(/\D/g, "")) || 0,
        status: "pending",
      });
      if (error) {
        console.error("Booking insert error:", error);
        alert(`Error: ${error.message}`);
        setIsBooking(false);
        return;
      }

      // 2. Auto-save profile so they don't have to enter it again
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: customerName,
        phone_number: customerPhone,
      });
    }

    setStep(3);
    setIsBooking(false);
  }

  return (
    <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-24 md:px-6 md:pt-28">
      <div className="mb-6">
        <Link
          href={`/salon/${salon.slug}`}
          className="font-dm-sans text-sm text-gold transition-colors hover:text-gold/80"
        >
          ← Back to {salon.name}
        </Link>
        <h1 className="mt-3 font-cormorant text-3xl text-primary md:text-4xl">
          Book Your Session
        </h1>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/70">
          {salon.name} · {salon.location}
        </p>
      </div>

      <ProgressIndicator currentStep={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="font-cormorant text-2xl text-primary">
                  Select a Service
                </h2>
                <ul className="mt-4 space-y-3">
                  {(salon.services || []).map((service: any) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <li key={service.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedService(service)}
                          className={cn(
                            "flex w-full items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all duration-[400ms]",
                            isSelected
                              ? "border-gold bg-gold/5 shadow-warm"
                              : "border-gold/20 bg-white hover:border-gold/40"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-dm-sans text-sm font-medium text-primary">
                              {service.name}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge variant="blush">{service.duration}</Badge>
                              <span className="font-cormorant text-lg text-gold">
                                {service.price}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-xs text-primary"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h2 className="font-cormorant text-2xl text-primary">
                  Pick a Date
                </h2>
                <div className="mt-4">
                  <CalendarPicker
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <LuneviaButton
                size="lg"
                disabled={!canContinueStep1}
                onClick={() => setStep(2)}
              >
                Continue →
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h2 className="font-cormorant text-2xl text-primary">
                  Available slots for{" "}
                  {selectedDate ? formatDate(selectedDate) : "your date"}
                </h2>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TIME_SLOTS.map((slot) => {
                    const isTaken = takenSlots.includes(slot);
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setSelectedTime(slot)}
                        className={cn(
                          "relative rounded-full border px-3 py-3 font-dm-sans text-sm transition-all duration-[400ms]",
                          isSelected &&
                            "border-gold bg-gold font-medium text-primary",
                          !isSelected &&
                            !isTaken &&
                            "border-gold/20 bg-white text-charcoal hover:border-gold/50",
                          isTaken &&
                            "cursor-not-allowed border-gold/10 bg-charcoal/5 text-charcoal/30"
                        )}
                      >
                        {slot}
                        {isTaken && (
                          <span className="mt-0.5 block text-[10px] uppercase tracking-wide">
                            Taken
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <OrderSummary
                  salon={salon}
                  service={selectedService}
                  date={selectedDate}
                  time={selectedTime}
                />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              <LuneviaButton variant="ghost" onClick={() => setStep(1)} disabled={isBooking}>
                ← Back
              </LuneviaButton>
              <LuneviaButton
                size="lg"
                disabled={!canConfirmStep2 || isBooking}
                onClick={handleConfirmBooking}
              >
                {isBooking ? "Confirming..." : "Confirm Booking →"}
              </LuneviaButton>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative text-center"
          >
            <ConfettiDots />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-primary shadow-warm"
            >
              ✓
            </motion.div>

            <h2 className="mt-6 font-cormorant text-5xl text-primary">
              You&apos;re all set!
            </h2>
            <p className="mt-2 font-dm-sans text-sm text-charcoal/70">
              Your booking has been confirmed. We&apos;ll send you a reminder
              closer to your appointment.
            </p>

            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gold/20 bg-white p-8 text-left shadow-warm">
              <h3 className="font-cormorant text-2xl text-primary">
                {salon.name}
              </h3>
              <p className="font-dm-sans text-sm text-charcoal/70">
                {salon.location}
              </p>

              <div className="mt-6 space-y-3 border-t border-gold/20 pt-6 font-dm-sans text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-charcoal/60">Service</span>
                  <span className="text-right font-medium text-primary">
                    {selectedService?.name}
                    {selectedService && (
                      <span className="ml-2 font-normal text-charcoal/60">
                        · {selectedService.duration}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-charcoal/60">Date</span>
                  <span className="font-medium text-primary">
                    {selectedDate ? formatDateShort(selectedDate) : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-charcoal/60">Time</span>
                  <span className="font-medium text-primary">
                    {selectedTime ?? "—"}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-gold/20 pt-4">
                  <span className="text-charcoal/60">Total</span>
                  <span className="font-cormorant text-3xl text-gold">
                    {selectedService?.price}
                  </span>
                </div>
                <p className="pt-2 font-dm-sans text-xs text-charcoal/50">
                  Booking ID: {bookingId}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <LuneviaButton
                variant="ghost"
                size="lg"
                onClick={() => router.push("/profile")}
              >
                View My Bookings
              </LuneviaButton>
              <LuneviaButton size="lg" onClick={() => router.push("/")}>
                Back to Home
              </LuneviaButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
