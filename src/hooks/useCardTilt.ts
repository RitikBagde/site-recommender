"use client";

import { useCallback, useEffect, useRef } from "react";

const MAX_TILT = 24;

function isTouchDevice() {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function useCardTilt<T extends HTMLElement>() {
  const tiltRef = useRef<T>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(() => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    tilt.classList.remove("is-hover");
    card.classList.remove("is-tilting");
    card.style.setProperty("--tilt-rx", "0deg");
    card.style.setProperty("--tilt-ry", "0deg");
  }, []);

  const track = useCallback((event: PointerEvent) => {
    const tilt = tiltRef.current;
    const card = cardRef.current;
    if (!tilt || !card) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = tilt.getBoundingClientRect();
    const px = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    const py = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));

    tilt.classList.add("is-hover");
    card.classList.add("is-tilting");
    card.style.setProperty("--tilt-ry", `${((px - 0.5) * MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty("--tilt-rx", `${((0.5 - py) * MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty("--tilt-gx", `${(px * 100).toFixed(1)}%`);
    card.style.setProperty("--tilt-gy", `${(py * 100).toFixed(1)}%`);
  }, []);

  useEffect(() => {
    if (isTouchDevice()) return; // ponytail: skip tilt on mobile to preserve scroll

    const tilt = tiltRef.current;
    if (!tilt) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        try {
          tilt.setPointerCapture(event.pointerId);
        } catch {
          // Ignore capture failures on unsupported pointers.
        }
      }
    };

    const handlePointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        reset();
      }
    };

    tilt.addEventListener("pointerdown", handlePointerDown);
    tilt.addEventListener("pointermove", track);
    tilt.addEventListener("pointerup", reset);
    tilt.addEventListener("pointercancel", reset);
    tilt.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      tilt.removeEventListener("pointerdown", handlePointerDown);
      tilt.removeEventListener("pointermove", track);
      tilt.removeEventListener("pointerup", reset);
      tilt.removeEventListener("pointercancel", reset);
      tilt.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [reset, track]);

  return { tiltRef, cardRef };
}
