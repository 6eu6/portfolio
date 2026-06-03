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

  useEffect(() => {
    const bio = bioRef.current;
    const cards = cardsRef.current;
    if (!bio || !cards) return;

    // Bio entrance (slide from left)
    gsap.set(bio, { opacity: 0, x: -60 });
    gsap.to(bio, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 80%',
        once: true,
      },
    });

    // Cards entrance (slide from right, staggered)
    const cardItems = cards.querySelectorAll('.info-card');
    gsap.set(cardItems, { opacity: 0, x: 40, y: 20 });

    gsap.to(cardItems, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === bio || st.trigger === cards) st.kill();
      });
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-[var(--sage)]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 bg-[var(--lav)]/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-4">
          About
        </p>
        <TextReveal
          text="A little about me"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-16"
          stagger={0.06}
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          {/* Bio Text */}
          <div ref={bioRef}>
            <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed text-[15px]">
              <p>
                I&apos;m Ahmed Al-Shibani — a builder who sits at the intersection of product, engineering, and design.
                I care about systems that are calm, precise, and built to last.
              </p>
              <p>
                Over the past five years, I&apos;ve shipped AI platforms, payment infrastructure, developer tools,
                editorial systems, and visual data tools — each designed with clarity as the north star.
              </p>
              <p>
                I believe the best products are the ones that disappear into the background while quietly
                compounding value. Less noise, more signal, always.
              </p>
              <p>
                When I&apos;m not building, I write about product thinking, system design, and the craft of
                making things that matter.
              </p>
            </div>
          </div>

          {/* Info Cards */}
          <div ref={cardsRef} className="space-y-4">
            {infoCards.map((card) => (
              <div
                key={card.label}
                className="info-card flex items-start gap-4 p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50 hover:border-[var(--sage)]/30 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-[var(--sage)]" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">{card.label}</p>
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
