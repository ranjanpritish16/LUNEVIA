"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

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

interface BookingFlowProps {
  salon: Salon;
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
    <div className="rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
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
  staff?: { name: string; role: string } | null;
}

function OrderSummary({ salon, service, date, time, staff }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-blush p-6 shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
      <h3 className="font-cormorant text-2xl text-primary">Order Summary</h3>
      <dl className="mt-4 space-y-3 font-dm-sans text-sm">
        <div>
          <dt className="text-charcoal/60">Salon</dt>
          <dd className="font-medium text-primary">{salon.name}</dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Service</dt>
          <dd className="text-charcoal">{service?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Date</dt>
          <dd className="text-charcoal">{date ? formatDateShort(date) : "—"}</dd>
        </div>
        <div>
          <dt className="text-charcoal/60">Time</dt>
          <dd className="text-charcoal">{time ?? "—"}</dd>
        </div>
        {staff && (
          <div>
            <dt className="text-charcoal/60">Stylist</dt>
            <dd className="font-medium text-gold">{staff.name}</dd>
          </div>
        )}
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

  // Staff selection
  const [selectedStaff, setSelectedStaff] = useState<{ id: string; name: string; role: string; phone?: string; service_ids: string[] } | null>(null);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [pendingTimeSlot, setPendingTimeSlot] = useState<string | null>(null);
  const [dayBookings, setDayBookings] = useState<{ time_slot: string; staff_id: string | null }[]>([]);

  // Load customer profile so name/phone are pre-filled on repeat bookings
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

  // Fetch day bookings when date changes — used for smart staff availability
  useEffect(() => {
    if (!selectedDate) {
      setDayBookings([]);
      setSelectedStaff(null);
      return;
    }

    let active = true;
    async function fetchSlots() {
      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase
        .from("bookings")
        .select("time_slot, staff_id")
        .eq("salon_id", salon.id)
        .eq("date", formatDateShort(selectedDate!))
        .in("status", ["pending", "confirmed"]);

      if (active && data) {
        setDayBookings(data);
      }
    }
    fetchSlots();

    return () => { active = false; };
  }, [selectedDate, salon.id]);

  // Staff members capable of performing the selected service
  const capableStaff = useMemo(() => {
    if (!selectedService || !(salon as any).team_members?.length) return [];
    return ((salon as any).team_members as any[]).filter(
      (m: any) => Array.isArray(m.service_ids) && m.service_ids.includes(selectedService.id)
    );
  }, [selectedService, salon]);

  // A slot is "Taken" only when ALL capable staff for the selected service are booked at that time.
  // If no team is set up, fall back to the original salon-level conflict.
  const takenSlots = useMemo(() => {
    return TIME_SLOTS.filter((slot) => {
      const bookingsInSlot = dayBookings.filter((b) => b.time_slot === slot);
      if (bookingsInSlot.length === 0) return false;
      if (capableStaff.length === 0) return true; // no staff → old behaviour
      const bookedStaffIds = bookingsInSlot.map((b) => b.staff_id).filter(Boolean);
      return capableStaff.every((s: any) => bookedStaffIds.includes(s.id));
    });
  }, [dayBookings, capableStaff]);

  // When the bride clicks a time slot
  const handleTimeSlotClick = useCallback((slot: string) => {
    if (capableStaff.length === 0) {
      setSelectedTime(slot);
      setSelectedStaff(null);
      return;
    }
    const bookedStaffIds = dayBookings
      .filter((b) => b.time_slot === slot)
      .map((b) => b.staff_id);
    const available = capableStaff.filter((s: any) => !bookedStaffIds.includes(s.id));
    setPendingTimeSlot(slot);
    setShowStaffModal(true);
    // store available in local var – passed to modal via state below
    setDayBookings((prev) => prev); // trigger memo only if needed — actual list derived below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capableStaff, dayBookings]);

  const availableStaffForPendingSlot = useMemo(() => {
    if (!pendingTimeSlot || capableStaff.length === 0) return [];
    const bookedStaffIds = dayBookings
      .filter((b) => b.time_slot === pendingTimeSlot)
      .map((b) => b.staff_id);
    return capableStaff.filter((s: any) => !bookedStaffIds.includes(s.id));
  }, [pendingTimeSlot, capableStaff, dayBookings]);

  const canContinueStep1 = selectedService !== null && selectedDate !== null;
  const canConfirmStep2 = selectedTime !== null && (capableStaff.length === 0 || selectedStaff !== null);

  async function handleConfirmBooking() {
    if (!selectedService || !selectedDate || !selectedTime) return;
    setIsBooking(true);

    const { supabase } = await import("@/lib/supabase");
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const finalName = customerName.trim() || user.user_metadata?.full_name || "Customer";
      const finalPhone = customerPhone.trim() || null;

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
        staff_id: selectedStaff?.id ?? null,
        staff_name: selectedStaff?.name ?? null,
        staff_phone: selectedStaff?.phone ?? null,
      });

      if (error) {
        console.error("Booking insert error:", error);
        alert(`Error: ${error.message}`);
        setIsBooking(false);
        return;
      }

      // Auto-save profile so the bride doesn't have to re-enter details next time
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
                              ? "border-gold bg-gold/5 shadow-[0_4px_24px_rgba(201,147,58,0.08)]"
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
                        onClick={() => handleTimeSlotClick(slot)}
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
                  staff={selectedStaff}
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
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-3xl text-primary shadow-[0_4px_24px_rgba(201,147,58,0.08)]"
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

            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gold/20 bg-white p-8 text-left shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
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
                {selectedStaff && (
                  <div className="flex justify-between gap-4">
                    <span className="text-charcoal/60">Stylist</span>
                    <div className="text-right">
                      <span className="font-medium text-gold block">{selectedStaff.name}</span>
                      {selectedStaff.phone && (
                        <a href={`tel:${selectedStaff.phone}`} className="text-xs text-charcoal/50 hover:text-gold transition-colors">
                          📞 {selectedStaff.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}
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

      {/* Staff Selection Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-cormorant text-2xl text-primary">Choose Your Stylist</h3>
              <button
                onClick={() => { setShowStaffModal(false); setPendingTimeSlot(null); }}
                className="text-charcoal/40 hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <p className="font-dm-sans text-xs text-charcoal/50 mb-5">
              Available for {pendingTimeSlot}
            </p>
            <div className="space-y-3">
              {availableStaffForPendingSlot.map((staff: any) => (
                <button
                  key={staff.id}
                  onClick={() => {
                    setSelectedStaff(staff);
                    setSelectedTime(pendingTimeSlot);
                    setShowStaffModal(false);
                    setPendingTimeSlot(null);
                  }}
                  className="w-full text-left p-4 rounded-xl border border-gold/20 hover:border-gold hover:bg-gold/5 transition-all duration-300 flex items-center justify-between group"
                >
                  <div>
                    <p className="font-dm-sans font-semibold text-primary">{staff.name}</p>
                    <p className="text-xs text-gold mt-0.5">{staff.role}</p>
                    {staff.phone && (
                      <p className="text-xs text-charcoal/50 mt-0.5">📞 {staff.phone}</p>
                    )}
                  </div>
                  <span className="text-gold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
                </button>
              ))}
            </div>
            {availableStaffForPendingSlot.length === 0 && (
              <p className="text-center text-sm text-charcoal/50 py-4">No staff available at this time.</p>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}