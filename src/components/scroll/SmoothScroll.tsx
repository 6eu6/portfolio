'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Scroll velocity & direction globals ──────────────────────────────────────
declare global {
  interface Window {
    __scrollVelocity: number;
    __scrollDirection: number;
    __lenis?: Lenis;
  }
}

// ─── Module-level singleton ──────────────────────────────────────────────────
let lenisInstance: Lenis | null = null;

const LenisContext = createContext<(() => Lenis | null) | null>(null);

export function useLenisInstance(): Lenis | null {
  const getter = useContext(LenisContext);
  return getter ? getter() : lenisInstance;
}

// ─── Velocity tracking config ───────────────────────────────────────────────
const VELOCITY_SAMPLES = 6; // moving‑average window size

// ─── Provider ───────────────────────────────────────────────────────────────
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const instanceRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialise globals
    window.__scrollVelocity = 0;
    window.__scrollDirection = 1; // 1 = down, -1 = up

    // ── Lenis instance ────────────────────────────────────────────────────
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisInstance = instance;
    instanceRef.current = instance;
    window.__lenis = instance;

    // ── Velocity tracking state ────────────────────────────────────────────
    const velocityBuffer: number[] = [];
    let lastScrollY = instance.scroll;
    let lastTime = performance.now();
    let rafId: number | null = null;

    const trackVelocity = () => {
      const now = performance.now();
      const dt = now - lastTime;

      // Skip if the frame interval is too large (tab was inactive)
      if (dt > 0 && dt < 200) {
        const currentScrollY = instance.scroll;
        const rawVelocity = (currentScrollY - lastScrollY) / dt; // px / ms

        // Push into ring buffer
        velocityBuffer.push(rawVelocity);
        if (velocityBuffer.length > VELOCITY_SAMPLES) {
          velocityBuffer.shift();
        }

        // Smoothed velocity (simple moving average)
        const smoothed =
          velocityBuffer.reduce((sum, v) => sum + v, 0) / velocityBuffer.length;

        window.__scrollVelocity = smoothed;

        // Direction: snap to +1 / -1 based on smoothed sign, 0 when stationary
        if (Math.abs(smoothed) < 0.01) {
          // Keep the last known direction when nearly stationary
        } else {
          window.__scrollDirection = smoothed > 0 ? 1 : -1;
        }

        lastScrollY = currentScrollY;
        lastTime = now;
      } else if (dt >= 200) {
        // Reset after a long gap so we don't get a velocity spike
        lastTime = now;
        lastScrollY = instance.scroll;
        velocityBuffer.length = 0;
        window.__scrollVelocity = 0;
      }

      rafId = requestAnimationFrame(trackVelocity);
    };

    rafId = requestAnimationFrame(trackVelocity);

    // ── Sync Lenis with GSAP ScrollTrigger ────────────────────────────────
    instance.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      instance.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // ── Intercept all hash link clicks for smooth scrolling ────────────────
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

    // ── Handle initial hash navigation (after preloader delay) ───────────
    const handleInitialHash = () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        const id = hash.slice(1);
        const el = document.getElementById(id);
        if (el) {
          // Small delay to allow preloader / layout to settle
          setTimeout(() => {
            instance.scrollTo(el, { offset: -80 });
            // Clean the hash without triggering a re-render
            window.history.replaceState(null, '', ' ');
          }, 800);
        }
      }
    };

    // Run immediately but also retry once if the DOM isn't ready yet
    handleInitialHash();
    const hashRetry = setTimeout(handleInitialHash, 1200);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      gsap.ticker.remove(tickerCallback);
      clearTimeout(hashRetry);

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      instance.destroy();
      lenisInstance = null;
      instanceRef.current = null;

      window.__scrollVelocity = 0;
      window.__scrollDirection = 1;
    };
  }, []);

  return (
    <LenisContext.Provider value={() => lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}
