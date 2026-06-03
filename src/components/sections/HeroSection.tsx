'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';
import Counter from '@/components/motion/Counter';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const cta = ctaRef.current;
    const statsEl = statsRef.current;
    if (!section || !content || !cta || !statsEl) return;

    // CTA and stats entrance
    gsap.set([cta, statsEl], { opacity: 0, y: 30 });

    const entranceTl = gsap.timeline({ delay: 2.3 }); // Delay for preloader
    entranceTl
      .to(cta, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(statsEl, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    // Scroll-away effect (bidirectional - works both ways)
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    });

    scrollTl
      .fromTo(content, { y: 0, opacity: 1, scale: 1 }, { y: -150, opacity: 0, scale: 0.95, ease: 'none' });

    // Stats parallax (slower)
    gsap.to(statsEl, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
    });

    return () => {
      entranceTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      gsap.set([cta, statsEl], { opacity: 1, y: 0, clearProps: 'all' });
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
        <TextReveal
          text="Builder · Founder · Developer"
          className="text-sm font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-8 justify-center"
          stagger={0.08}
        />

        {/* Heading - word by word reveal */}
        <div className="mb-8">
          <TextReveal
            text="Building products"
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)] justify-center"
            stagger={0.04}
          />
          <div className="flex flex-wrap justify-center mt-2">
            <TextReveal
              text="that feel"
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)]"
              stagger={0.05}
            />
            <TextReveal
              text="calm"
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight bg-gradient-to-r from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] bg-clip-text text-transparent"
              stagger={0.06}
            />
          </div>
          <TextReveal
            text="and work well"
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)] justify-center mt-2"
            stagger={0.04}
          />
        </div>

        {/* Subtitle */}
        <TextReveal
          text="I design and engineer systems, products, and experiences where clarity and craft compound over time."
          className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12 justify-center"
          stagger={0.02}
          delay={0.3}
        />

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center">
          <Button
            size="lg"
            className="bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 h-12 px-8 text-sm tracking-wide"
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
            className="border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper-2)] h-12 px-8 text-sm tracking-wide"
            asChild
          >
            <a href="#blog">
              <FileText className="mr-2 h-4 w-4" />
              Read Blog
            </a>
          </Button>
        </div>

        {/* Stats Strip */}
        <div ref={statsRef} className="mt-20 md:mt-28 flex flex-wrap justify-center gap-10 md:gap-20">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
              <Counter end={20} suffix="+" />
            </p>
            <p className="text-xs tracking-widest uppercase text-[var(--muted-foreground)] mt-2">Projects</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
              <Counter end={5} suffix="+" />
            </p>
            <p className="text-xs tracking-widest uppercase text-[var(--muted-foreground)] mt-2">Years Building</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
              <Counter end={50} suffix="+" />
            </p>
            <p className="text-xs tracking-widest uppercase text-[var(--muted-foreground)] mt-2">Articles</p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
              <Counter end={10} suffix="K+" />
            </p>
            <p className="text-xs tracking-widest uppercase text-[var(--muted-foreground)] mt-2">Community Reach</p>
          </div>
        </div>
      </div>
    </section>
  );
}
