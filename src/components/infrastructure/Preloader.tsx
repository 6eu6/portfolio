'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const progress = progressRef.current;
    const counter = counterRef.current;
    const name = nameRef.current;
    if (!preloader || !progress || !counter || !name) return;

    // Master timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => {
            setVisible(false);
            onComplete();
          },
        });
      },
    });

    // Name entrance
    tl.fromTo(
      name,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
    );

    // Progress bar + counter animation
    const progressObj = { val: 0 };
    tl.to(progressObj, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(progressObj.val);
        if (counter) counter.textContent = String(v);
        if (progress) {
          progress.style.transform = `scaleX(${v / 100})`;
        }
      },
    }, '-=0.2');

    // Slight pause then name exit
    tl.to(name, {
      y: -20,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    }, '+=0.1');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-[var(--ink)] flex items-center justify-center"
      style={{ willChange: 'transform' }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Name */}
        <div ref={nameRef} className="text-white">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Ahmed<span className="text-[var(--sage)]">.</span>
          </h1>
        </div>

        {/* Progress */}
        <div className="w-48 md:w-64 flex items-center gap-3">
          <div className="flex-1 h-[2px] bg-white/20 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-white rounded-full origin-left"
              style={{ transform: 'scaleX(0)' }}
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
    </div>
  );
}
