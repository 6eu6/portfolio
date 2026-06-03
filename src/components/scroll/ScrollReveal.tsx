'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  /** If true, element stays visible after revealing (default: true) */
  persist?: boolean;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  stagger = 0,
  className,
  persist = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const directionMap: Record<string, { x: number; y: number }> = {
      up: { x: 0, y: 60 },
      down: { x: 0, y: -60 },
      left: { x: 60, y: 0 },
      right: { x: -60, y: 0 },
      fade: { x: 0, y: 0 },
    };

    const { x, y } = directionMap[direction] || directionMap.up;
    const targets = stagger > 0 ? el.children : el;

    // Set initial hidden state
    gsap.set(targets, { opacity: 0, x, y });

    const tween = gsap.to(targets, {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: persist
          ? 'play none none none'
          : 'play none none reverse',
        once: persist,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [direction, delay, duration, stagger, persist]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// --- Parallax ---

interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.to(el, {
      y: () => speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// --- ScaleOnScroll ---

interface ScaleOnScrollProps {
  children: ReactNode;
  fromScale?: number;
  toScale?: number;
  className?: string;
}

export function ScaleOnScroll({
  children,
  fromScale = 0.9,
  toScale = 1,
  className,
}: ScaleOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { scale: fromScale },
      {
        scale: toScale,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [fromScale, toScale]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
