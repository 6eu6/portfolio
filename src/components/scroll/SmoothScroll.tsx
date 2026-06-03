'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Module-level lenis instance (avoids ref-during-render issues)
let lenisInstance: Lenis | null = null;

function getLenisInstance(): Lenis | null {
  return lenisInstance;
}

const LenisContext = createContext(getLenisInstance);

export function useLenis() {
  return useContext(LenisContext)();
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = instance;

    instance.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      instance.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <LenisContext.Provider value={getLenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
