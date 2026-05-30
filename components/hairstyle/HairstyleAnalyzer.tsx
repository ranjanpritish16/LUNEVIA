"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import type { HairstyleApiResponse } from "@/lib/types/hairstyle";
import { analyzeFaceShape } from "@/lib/faceMesh";
import { cn } from "@/lib/utils";

function CameraIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M4 7h2l2-3h8l2 3h2a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function GoldSpinner() {
  return (
    <div
      className="h-12 w-12 animate-spin rounded-full border-[3px] border-gold/20 border-t-gold"
      aria-hidden="true"
    />
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.includes(",")
          ? result.split(",")[1]
          : result;
        resolve(base64);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function HairstyleAnalyzer() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HairstyleApiResponse | null>(null);
  const [measurements, setMeasurements] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResults(null);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Step 1: Load the image and extract facial measurements using MediaPipe
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = previewUrl;
      });

      const faceAnalysis = await analyzeFaceShape(img);

      // Store measurements for debugging
      setMeasurements(faceAnalysis.measurements);

      // Step 2: Send facial measurements to API for Gemini-based classification and recommendations
      const res = await fetch("/api/ai/hairstyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurements: faceAnalysis.measurements,
        }),
      });

      const data = (await res.json()) as HairstyleApiResponse & {
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed");
      }

      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setResults(null);
    setError(null);
    setSelectedFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-20 pt-28 md:px-6 md:pt-32">
      <div className="text-center">
        <h1 className="font-cormorant text-4xl text-primary md:text-5xl">
          Find Your Perfect Bridal Hairstyle
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-dm-sans text-charcoal">
          Upload your photo — LUNÉVIA AI analyzes your face shape and recommends
          the most flattering bridal looks
        </p>
        <p className="mt-2 font-dm-sans text-xs text-charcoal/50">
          Your photo is processed securely and never stored.
        </p>
      </div>

      <div className="mt-12">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          className="hidden"
          onChange={handleFileChange}
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isLoading}
          className={cn(
            "relative flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gold bg-white/50 px-6 py-12 transition-colors duration-[400ms] hover:bg-blush/30",
            isLoading && "pointer-events-none opacity-60"
          )}
        >
          {previewUrl ? (
            <div className="relative h-64 w-full max-w-sm overflow-hidden rounded-xl">
              <Image
                src={previewUrl}
                alt="Your uploaded photo preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <>
              <CameraIcon />
              <p className="mt-4 font-dm-sans text-lg font-medium text-primary">
                Upload your photo
              </p>
              <p className="mt-1 font-dm-sans text-sm text-charcoal/60">
                JPG or PNG · Your photo is never stored
              </p>
            </>
          )}
        </button>

        {selectedFile && !results && !isLoading && (
          <div className="mt-6 flex justify-center">
            <LuneviaButton size="lg" onClick={() => void handleAnalyze()}>
              Analyze My Face Shape →
            </LuneviaButton>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-12 flex flex-col items-center gap-4 text-center"
            >
              <GoldSpinner />
              <p className="font-dm-sans text-sm text-charcoal">
                LUNÉVIA Concierge is analyzing your features...
              </p>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center font-dm-sans text-sm text-rose"
            >
              {error}
            </motion.p>
          )}

          {results && !isLoading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="mt-12"
            >
              <div className="flex flex-col items-center text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-semibold uppercase tracking-wide text-primary">
                  {results.faceShape} Face Shape ✓
                  <span className="font-normal normal-case opacity-70">
                    · {results.confidence} confidence
                  </span>
                </span>
                <p className="mt-4 max-w-xl font-dm-sans italic text-charcoal">
                  {results.characteristics}
                </p>

                {measurements && (
                  <details className="mt-6 inline-block text-left">
                    <summary className="cursor-pointer font-dm-sans text-xs text-charcoal/60 hover:text-charcoal/80">
                      📊 Debug: Extracted Measurements
                    </summary>
                    <div className="mt-3 space-y-1 rounded-lg bg-charcoal/5 p-3 font-mono text-xs text-charcoal/70">
                      <div>Face Length: {measurements.faceLength}px</div>
                      <div>Jaw Width: {measurements.jawWidth}px</div>
                      <div>Forehead Width: {measurements.foreheadWidth}px</div>
                      <div>Cheekbone Width: {measurements.cheekboneWidth}px</div>
                      <div className="mt-2 border-t border-charcoal/10 pt-2">
                        <div>Length:Width Ratio: {measurements.lengthToWidthRatio}</div>
                        <div>Jaw:Forehead Ratio: {measurements.jawToForeheadRatio}</div>
                        <div>Cheekbone:Jaw Ratio: {measurements.cheekboneToJawRatio}</div>
                      </div>
                    </div>
                  </details>
                )}
              </div>

              <h2 className="mt-12 text-center font-cormorant text-3xl text-primary md:text-4xl">
                Your Recommended Bridal Hairstyles
              </h2>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {results.recommendations.map((rec, index) => (
                  <motion.article
                    key={`${rec.style}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex flex-col rounded-2xl border border-gold/20 bg-white p-6 shadow-warm"
                  >
                    <h3 className="font-cormorant text-2xl text-primary">
                      {rec.style}
                    </h3>
                    <div className="mt-2">
                      <Badge variant="rose">{rec.bestFor}</Badge>
                    </div>
                    <p className="mt-4 flex-1 font-dm-sans text-sm leading-relaxed text-charcoal">
                      {rec.description}
                    </p>
                    <p className="mt-3 font-dm-sans text-sm italic text-charcoal/70">
                      {rec.whyItWorks}
                    </p>
                    <Link
                      href="/explore"
                      className="mt-5 inline-flex items-center justify-center rounded-full border border-gold px-4 py-2 font-dm-sans text-xs font-medium text-gold transition-colors hover:bg-gold/10"
                    >
                      Find Artists Specializing in This →
                    </Link>
                  </motion.article>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <LuneviaButton variant="ghost" onClick={handleTryAnother}>
                  Try Another Photo
                </LuneviaButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
