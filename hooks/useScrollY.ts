"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

export function useScrollY(threshold = 50) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > threshold);
  });

  return { scrollY, scrolled };
}
