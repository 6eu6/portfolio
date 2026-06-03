'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Target, Lightbulb, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const infoCards = [
  { icon: Briefcase, label: 'Experience', value: '5+ years building products & systems' },
  { icon: Target, label: 'Focus Areas', value: 'AI, Full-Stack, Product, Architecture' },
  { icon: Lightbulb, label: 'Approach', value: 'Clarity-first, calm design, compound value' },
  { icon: MapPin, label: 'Location', value: 'Building globally, remote-first' },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionLabelRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionLabel = sectionLabelRef.current;
    const bio = bioRef.current;
    const cards = cardsRef.current;
    if (!sectionLabel || !bio || !cards) return;

    // Set initial states
    gsap.set(sectionLabel, { opacity: 0, y: 30 });
    gsap.set(bio, { opacity: 0, x: -60 });
    gsap.set(cards, { opacity: 0, x: 60 });

    // Section label entrance
    const labelTl = gsap.to(sectionLabel, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionLabel,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    // Bio entrance (slide from left)
    const bioTl = gsap.to(bio, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    // Cards entrance (slide from right, staggered)
    const cardItems = cards.querySelectorAll('.info-card');
    gsap.set(cardItems, { opacity: 0, x: 40, y: 20 });

    const cardsTl = gsap.to(cardItems, {
      opacity: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards,
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
      },
    });

    return () => {
      labelTl.kill();
      bioTl.kill();
      cardsTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === sectionLabel ||
          st.trigger === bio ||
          st.trigger === cards
        ) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative blur blobs */}
      <div className="absolute top-20 -left-32 w-64 h-64 bg-[var(--sage)]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-32 w-64 h-64 bg-[var(--lav)]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label */}
        <div ref={sectionLabelRef}>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
            About
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-16">
            A little about me
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          {/* Bio Text */}
          <div ref={bioRef}>
            <div className="space-y-6 text-[var(--muted-foreground)] leading-relaxed">
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
                className="info-card flex items-start gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center">
                  <card.icon className="w-5 h-5 text-[var(--sage)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--ink)]">{card.label}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
