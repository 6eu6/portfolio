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
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const statsEl = statsRef.current;
    if (!heading || !statsEl) return;

    const headingTl = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    headingTl.fromTo(
      heading,
      { y: 0, opacity: 1 },
      { y: -80, opacity: 0 }
    );

    const statsTl = gsap.timeline({
      scrollTrigger: {
        trigger: statsEl,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    statsTl.fromTo(
      statsEl,
      { y: 0, opacity: 1 },
      { y: -40, opacity: 0 }
    );

    return () => {
      headingTl.kill();
      statsTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === heading || st.trigger === statsEl) st.kill();
      });
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
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div ref={headingRef}>
          {/* Eyebrow */}
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-6">
            Builder · Founder · Developer
          </p>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight text-[var(--ink)] mb-8">
            Building products{' '}
            <span className="bg-gradient-to-r from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] bg-clip-text text-transparent">
              that feel calm
            </span>{' '}
            and work well
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10">
            I design and engineer systems, products, and experiences where clarity and craft compound over time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
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
