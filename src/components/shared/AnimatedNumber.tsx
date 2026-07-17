"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const [animating, setAnimating] = useState(true);
  const digits = String(value).split("");

  useEffect(() => {
    setAnimating(false);
    const frame = requestAnimationFrame(() => setAnimating(true));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span
      className={`t-digit-group ${animating ? "is-animating" : ""} ${className ?? ""}`}
    >
      {digits.map((digit, index) => (
        <span
          key={`${value}-${index}`}
          className="t-digit"
          data-stagger={index > 0 ? String(index) : undefined}
        >
          {digit}
        </span>
      ))}
    </span>
  );
}
