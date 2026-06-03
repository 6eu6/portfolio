'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

const LenisContext = createContext<(() => Lenis | null) | null>(null);

export function useLenisInstance(): Lenis | null {
  const getter = useContext(LenisContext);
  return getter ? getter() : lenisInstance;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = instance;
    (window as unknown as Record<string, Lenis>).__lenis = instance;

    // Sync Lenis with GSAP ScrollTrigger
    instance.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Intercept all hash link clicks for smooth scrolling
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const id = href.slice(1);
          const el = document.getElementById(id);
          if (el) {
            instance.scrollTo(el, { offset: -80 });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={() => lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
