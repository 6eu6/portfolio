'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  /** Pause on hover */
  pauseOnHover?: boolean;
}

export default function Marquee({
  children,
  speed = 50,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Clone content for seamless loop
    const clone = track.innerHTML;
    track.innerHTML += clone;

    const totalWidth = track.scrollWidth / 2;
    const xPercent = direction === 'left' ? -100 : 0;
    const xTo = direction === 'left' ? 0 : -100;

    gsap.set(track, { xPercent });

    const tween = gsap.to(track, {
      xPercent: xTo,
      duration: speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        xPercent: gsap.utils.unitize((x: number) => {
          // Wrap around for seamless loop
          return parseFloat(String(x)) % (totalWidth > 0 ? 100 : 100);
        }),
      },
    });

    // Pause on hover
    if (pauseOnHover && track.parentElement) {
      const parent = track.parentElement;
      const onMouseEnter = () => tween.pause();
      const onMouseLeave = () => tween.resume();
      parent.addEventListener('mouseenter', onMouseEnter);
      parent.addEventListener('mouseleave', onMouseLeave);

      return () => {
        tween.kill();
        parent.removeEventListener('mouseenter', onMouseEnter);
        parent.removeEventListener('mouseleave', onMouseLeave);
      };
    }

    return () => {
      tween.kill();
    };
  }, [direction, speed, pauseOnHover]);

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={trackRef} className="inline-flex items-center gap-8">
        {children}
      </div>
    </div>
  );
}
