"use client";

import { useCallback, useEffect, useRef } from "react";

export function useCategoryTracker<T extends HTMLElement>(activeKey: string) {
  const navRef = useRef<HTMLUListElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Map<string, T>>(new Map());

  const registerItem = useCallback((key: string, element: T | null) => {
    if (element) {
      itemRefs.current.set(key, element);
    } else {
      itemRefs.current.delete(key);
    }
  }, []);

  const movePill = useCallback(
    (animate: boolean) => {
      const nav = navRef.current;
      const pill = pillRef.current;
      const activeItem = itemRefs.current.get(activeKey);

      if (!nav || !pill || !activeItem) return;

      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const top = itemRect.top - navRect.top;

      if (!animate) {
        const previousTransition = pill.style.transition;
        pill.style.transition = "none";
        pill.style.transform = `translateY(${top}px)`;
        pill.style.height = `${itemRect.height}px`;
        void pill.offsetHeight;
        pill.style.transition = previousTransition;
        return;
      }

      pill.style.transform = `translateY(${top}px)`;
      pill.style.height = `${itemRect.height}px`;
    },
    [activeKey],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => movePill(false));
    return () => cancelAnimationFrame(frame);
  }, [activeKey, movePill]);

  useEffect(() => {
    const handleResize = () => movePill(false);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [movePill]);

  useEffect(() => {
    movePill(true);
  }, [activeKey, movePill]);

  return { navRef, pillRef, registerItem };
}
