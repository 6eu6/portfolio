'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

/** Small particle rendered as a dot that drifts during loading */
function Particle({ index }: { index: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Each particle gets a slightly random path
    const randomX = (Math.random() - 0.5) * 200;
    const randomY = (Math.random() - 0.5) * 200;
    const size = 1.5 + Math.random() * 2.5;
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 0.5;

    gsap.set(el, {
      x: `${(Math.random() - 0.5) * 100}vw`,
      y: `${(Math.random() - 0.5) * 100}vh`,
      opacity: 0,
      scale: size,
    });

    gsap.to(el, {
      opacity: 0.15 + Math.random() * 0.2,
      duration: 0.8,
      delay,
      ease: 'power2.out',
    });

    gsap.to(el, {
      x: `+=${randomX}`,
      y: `+=${randomY}`,
      duration,
      delay,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <span
      ref={ref}
      className="absolute rounded-full bg-white pointer-events-none"
      style={{
        width: 3,
        height: 3,
        willChange: 'transform, opacity',
      }}
      aria-hidden="true"
    />
  );
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const [visible, setVisible] = useState(true);

  // Split "Ahmed." into individual letter spans
  const letters = useMemo(() => ['A', 'h', 'm', 'e', 'd', '.'], []);

  // Determine which letter gets the sage color (the dot)
  const getLetterClass = (letter: string, i: number) => {
    if (letter === '.') return 'text-[var(--sage)] inline-block';
    return 'inline-block';
  };

  useEffect(() => {
    const preloader = preloaderRef.current;
    const curtain = curtainRef.current;
    const progress = progressRef.current;
    const counter = counterRef.current;
    const letterEls = lettersRef.current;
    if (!preloader || !progress || !counter || letterEls.length === 0) return;

    // ── Master timeline ──────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        // Curtain exit animation – clip-path scaleY 1→0 (curtain reveal)
        if (curtain) {
          gsap.set(curtain, { clipPath: 'inset(0% 0% 0% 0%)', display: 'block' });
          gsap.to(curtain, {
            clipPath: 'inset(50% 0% 50% 0%)',
            duration: 0.9,
            ease: 'power4.inOut',
            onComplete: () => {
              setVisible(false);
              onComplete();
            },
          });
        } else {
          setVisible(false);
          onComplete();
        }
      },
    });

    // ── 1. Letters entrance – staggered one by one ──────────────────
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

    // ── 2. Subtle 3D progress bar ──────────────────────────────────
    const progressObj = { val: 0 };
    tl.to(progressObj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(progressObj.val);
        if (counter) counter.textContent = String(v);
        if (progress) {
          // scaleX for width + subtle rotateX for 3D feel
          const tilt = 2 * Math.sin((v / 100) * Math.PI); // peaks at 50%
          progress.style.transform = `scaleX(${v / 100}) rotateX(${tilt}deg)`;
        }
      },
    }, '-=0.25');

    // ── 3. Letters exit – stagger out ──────────────────────────────
    tl.to(
      letterEls,
      {
        y: -30,
        opacity: 0,
        rotateX: 40,
        duration: 0.3,
        stagger: 0.03,
        ease: 'power2.in',
      },
      '+=0.15'
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-[var(--ink)] flex items-center justify-center overflow-hidden"
      style={{ willChange: 'transform' }}
    >
      {/* ── Subtle background grid ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Floating particles ─────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center gap-10" style={{ perspective: '600px' }}>
        {/* Name – split into individual letters */}
        <div className="text-white" style={{ perspective: '600px' }}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            {letters.map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                ref={(el) => {
                  if (el) lettersRef.current[i] = el;
                }}
                className={`${getLetterClass(letter, i)} [transform-style:preserve-3d]`}
                style={{ willChange: 'transform, opacity' }}
              >
                {letter}
              </span>
            ))}
          </h1>
        </div>

        {/* Progress bar with 3D perspective */}
        <div className="w-48 md:w-64 flex items-center gap-3" style={{ perspective: '400px' }}>
          <div className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-white rounded-full origin-left"
              style={{ transform: 'scaleX(0)', willChange: 'transform', transformOrigin: 'left center' }}
            />
          </div>
          <span
            ref={counterRef}
            className="text-white/60 text-sm font-mono tabular-nums min-w-[2ch] text-right"
          >
            0
          </span>
        </div>
      </div>

      {/* ── Curtain overlay for exit animation ──────────────────── */}
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-[var(--ink)] pointer-events-none"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
