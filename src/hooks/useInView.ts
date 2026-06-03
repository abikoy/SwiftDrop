"use client";

import { useEffect, useRef, useState, RefObject } from "react";

interface UseInViewOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

export function useInView<T extends Element = Element>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, once = true, rootMargin = "0px" } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, once, rootMargin]);

  return [ref, inView];
}