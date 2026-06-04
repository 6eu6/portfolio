'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

/* ── Module-level guard to prevent StrictMode double-play ──── */
let _preloaderPlayed = false;

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const [visible, setVisible] = useState(() => !_preloaderPlayed);
  const onCompleteRef = useRef(onComplete);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Keep onComplete ref fresh without causing re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const letters = useMemo(() => ['A', 'h', 'm', 'e', 'd', '.'], []);

  useEffect(() => {
    // ── Guard: if already played (StrictMode remount), skip entirely ──
    if (_preloaderPlayed) {
      // visible is already false from lazy initializer, just fire onComplete
      onCompleteRef.current();
      return;
    }

    const preloader = preloaderRef.current;
    const curtain = curtainRef.current;
    const progress = progressRef.current;
    const counter = counterRef.current;
    const letterEls = lettersRef.current;
    if (!preloader || !progress || !counter || letterEls.length === 0) return;

    // Mark as played immediately so StrictMode remount can't replay
    _preloaderPlayed = true;

    // Reset letter refs
    letterEls.forEach((el) => {
      if (el) {
        gsap.set(el, { clearProps: 'all' });
      }
    });

    const tl = gsap.timeline({
      onComplete: () => {
        if (curtain) {
          gsap.set(curtain, {
            clipPath: 'inset(0% 0% 0% 0%)',
            display: 'block',
          });
          gsap.to(curtain, {
            clipPath: 'inset(50% 0% 50% 0%)',
            duration: 0.85,
            ease: 'power4.inOut',
            onComplete: () => {
              setVisible(false);
              onCompleteRef.current();
            },
          });
        } else {
          setVisible(false);
          onCompleteRef.current();
        }
      },
    });

    tlRef.current = tl;

    // ── 1. Letters entrance ──────────────────────────────────────
    tl.fromTo(
      letterEls,
      { y: 60, opacity: 0, rotateX: -90 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
      }
    );

    // ── 2. Progress bar ───────────────────────────────────────────
    const progressObj = { val: 0 };
    tl.to(progressObj, {
      val: 100,
      duration: 1.4,
      ease: 'power1.inOut',
      onUpdate: () => {
        const v = Math.round(progressObj.val);
        if (counter) counter.textContent = String(v);
        if (progress) {
          progress.style.transform = `scaleX(${v / 100})`;
        }
      },
    }, '-=0.2');

    // ── 3. Letters exit ────────────────────────────────────────────
    tl.to(letterEls, {
      y: -25,
      opacity: 0,
      rotateX: 35,
      duration: 0.25,
      stagger: 0.025,
      ease: 'power2.in',
    }, '+=0.1');

    return () => {
      tl.kill();
      tlRef.current = null;
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-[var(--ink)] flex items-center justify-center overflow-hidden"
    >
      {/* ── Subtle grid background ─────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Ambient gradient orb ──────────────────────────────── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'radial-gradient(circle, oklch(0.62 0.14 160 / 8%) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="relative flex flex-col items-center gap-8 sm:gap-10">
        {/* Name letters */}
        <div className="text-white" style={{ perspective: '600px' }}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            {letters.map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                ref={(el) => {
                  if (el) lettersRef.current[i] = el;
                }}
                className={`${letter === '.' ? 'text-[var(--sage)]' : ''} inline-block [transform-style:preserve-3d]`}
                style={{ willChange: 'transform, opacity' }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-40 sm:w-48 md:w-64 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-white/15 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full rounded-full origin-left"
              style={{
                background: 'linear-gradient(90deg, oklch(0.62 0.14 160), oklch(0.65 0.12 230), oklch(0.65 0.12 290))',
                transform: 'scaleX(0)',
                willChange: 'transform',
                transformOrigin: 'left center',
              }}
            />
          </div>
          <span
            ref={counterRef}
            className="text-white/50 text-sm font-mono tabular-nums min-w-[2ch] text-right"
          >
            0
          </span>
        </div>
      </div>

      {/* ── Curtain overlay ──────────────────────────────────── */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[var(--ink)] pointer-events-none"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
