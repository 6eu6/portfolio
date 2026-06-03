'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { stats } from '@/data/social';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const statsEl = statsRef.current;
    const content = contentRef.current;

    if (!section || !content || !eyebrow || !heading || !subtitle || !cta || !statsEl) return;

    // --- Entrance Animation (plays once on mount) ---
    // Set initial hidden states
    gsap.set([eyebrow, heading, subtitle, cta, statsEl], { opacity: 0, y: 40 });

    const entranceTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    });

    entranceTl
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.6 })
      .to(heading, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
      .to(subtitle, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to(cta, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to(statsEl, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');

    // --- Scroll-away effect (tied to scroll, fully reversible) ---
    // This fades out content as user scrolls down, and brings it back when scrolling up
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
      },
    });

    scrollTl
      .fromTo(content, { y: 0, opacity: 1 }, { y: -120, opacity: 0, ease: 'none' });

    return () => {
      entranceTl.kill();
      scrollTl.kill();
      // Kill any ScrollTriggers tied to this section
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      // Restore visibility in case of cleanup during animation
      gsap.set([eyebrow, heading, subtitle, cta, statsEl], { opacity: 1, y: 0, clearProps: 'all' });
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three.js Background */}
      <div className="absolute inset-0 z-0">
        <HeroScene />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-6"
        >
          Builder · Founder · Developer
        </p>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-[var(--ink)] mb-8"
        >
          Building products{' '}
          <span className="bg-gradient-to-r from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] bg-clip-text text-transparent">
            that feel calm
          </span>{' '}
          and work well
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10"
        >
          I design and engineer systems, products, and experiences where clarity and craft compound over time.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90"
            asChild
          >
            <a href="#projects-all">
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper-2)]"
            asChild
          >
            <a href="#blog">
              <FileText className="mr-2 h-4 w-4" />
              Read Blog
            </a>
          </Button>
        </div>

        {/* Stats Strip */}
        <div ref={statsRef} className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[var(--ink)]">{stat.value}</p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
