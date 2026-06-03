'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** 'word' splits by words, 'char' splits by characters */
  splitBy?: 'word' | 'char';
  /** Stagger between words/chars */
  stagger?: number;
  /** Whether to keep element visible after reveal */
  once?: boolean;
}

export default function TextReveal({
  text,
  className,
  delay = 0,
  splitBy = 'word',
  stagger = 0.06,
  once = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    const units = splitBy === 'word' ? text.split(' ') : text.split('');

    inner.innerHTML = units
      .map((unit) => {
        const display = splitBy === 'char' && unit === ' ' ? '&nbsp;' : unit;
        return `<span class="text-reveal-unit" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="text-reveal-inner" style="display:inline-block;transform:translateY(110%)">${display}</span></span>${splitBy === 'word' ? '<span style="display:inline-block;width:0.3em">&nbsp;</span>' : ''}`;
      })
      .join('');

    const innerEls = inner.querySelectorAll('.text-reveal-inner');

    const tween = gsap.to(innerEls, {
      y: '0%',
      duration: 0.7,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        once,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [text, delay, splitBy, stagger, once]);

  return (
    <div ref={containerRef} className={className}>
      <div ref={innerRef} />
    </div>
  );
}
