'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Target, Lightbulb, MapPin } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
  { icon: Briefcase, label: 'Experience', value: '5+ years building products & systems' },
  { icon: Target, label: 'Focus Areas', value: 'AI, Full-Stack, Product, Architecture' },
  { icon: Lightbulb, label: 'Approach', value: 'Clarity-first, calm design, compound value' },
  { icon: MapPin, label: 'Location', value: 'Building globally, remote-first' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bio = bioRef.current;
    const cards = cardsRef.current;
    const blob1 = blob1Ref.current;
    const blob2 = blob2Ref.current;
    const blob3 = blob3Ref.current;
    if (!section || !bio || !cards || !blob1 || !blob2 || !blob3) return;

    // ── Parallax decorative blobs at different scroll speeds ──
    const parallaxCtx = gsap.context(() => {
      gsap.to(blob1, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // 0.5x speed
        },
      });

      gsap.to(blob2, {
        y: -240,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // 1.5x speed (larger displacement)
        },
      });

      gsap.to(blob3, {
        y: -160,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, section);

    // ── Bio entrance: line-by-line reveal with 3D tilt ──
    const bioLines = bio.querySelectorAll('.bio-line');
    gsap.set(bioLines, {
      opacity: 0,
      y: 30,
      rotateX: 8,
      transformOrigin: 'center bottom',
    });

    const bioTl = gsap.to(bioLines, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 80%',
        once: true,
      },
    });

    // ── Cards entrance: 3D flip-up with stagger ──
    const cardItems = cards.querySelectorAll('.info-card');
    gsap.set(cardItems, {
      opacity: 0,
      y: 40,
      rotateX: 5,
      transformOrigin: 'center bottom',
    });

    const cardsTl = gsap.to(cardItems, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      parallaxCtx.revert();
      bioTl.kill();
      cardsTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === bio ||
          st.trigger === cards ||
          st.trigger === section
        )
          st.kill();
      });
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-28 md:py-40 overflow-hidden"
    >
      {/* Parallax decorative blobs */}
      <div
        ref={blob1Ref}
        className="absolute top-20 -left-32 w-80 h-80 bg-[var(--sage)]/12 rounded-full blur-3xl pointer-events-none will-change-transform"
      />
      <div
        ref={blob2Ref}
        className="absolute bottom-20 -right-32 w-80 h-80 bg-[var(--lav)]/12 rounded-full blur-3xl pointer-events-none will-change-transform"
      />
      <div
        ref={blob3Ref}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[var(--sage)]/6 rounded-full blur-3xl pointer-events-none will-change-transform"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Label */}
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--sage)] mb-4">
          About
        </p>
        <TextReveal
          text="A little about me"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-16"
          stagger={0.06}
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Bio Text — with perspective for 3D tilt */}
          <div ref={bioRef} style={{ perspective: '800px' }}>
            <div className="space-y-6 text-[var(--muted-foreground)] leading-[1.75] text-[15px]">
              <p className="bio-line" style={{ transformStyle: 'preserve-3d' }}>
                I&apos;m Ahmed Al-Shaibani — a builder who sits at the intersection
                of product, engineering, and design. I care about systems that are
                calm, precise, and built to last.
              </p>
              <p className="bio-line" style={{ transformStyle: 'preserve-3d' }}>
                Over the past five years, I&apos;ve shipped AI platforms, payment
                infrastructure, developer tools, editorial systems, and visual data
                tools — each designed with clarity as the north star.
              </p>
              <p className="bio-line" style={{ transformStyle: 'preserve-3d' }}>
                I believe the best products are the ones that disappear into the
                background while quietly compounding value. Less noise, more signal,
                always.
              </p>
              <p className="bio-line" style={{ transformStyle: 'preserve-3d' }}>
                When I&apos;m not building, I write about product thinking, system
                design, and the craft of making things that matter.
              </p>
            </div>
          </div>

          {/* Info Cards — with perspective for 3D flip-up */}
          <div ref={cardsRef} style={{ perspective: '800px' }} className="space-y-4">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="info-card flex items-start gap-4 p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50 hover:border-[var(--sage)]/40 hover:bg-[var(--paper-2)]/80 hover:shadow-[0_8px_30px_-8px_oklch(0.62_0.14_160/15%)] transition-all duration-300 min-h-[72px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-[var(--sage)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">
                    {card.label}
                  </p>
                  <p className="text-sm text-[var(--ink)]">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
