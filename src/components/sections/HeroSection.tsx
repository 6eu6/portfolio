'use client';

import { useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

/* ------------------------------------------------------------------ */
/*  Helper: build TextReveal-style DOM & return the animatable spans  */
/* ------------------------------------------------------------------ */
function buildRevealUnits(container: HTMLElement, text: string, stagger: number = 0.06) {
  container.innerHTML = text
    .split(' ')
    .map(
      (word) =>
        `<span class="text-reveal-unit" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="text-reveal-inner" style="display:inline-block;transform:translateY(110%)">${word}</span></span><span style="display:inline-block;width:0.3em">&nbsp;</span>`,
    )
    .join('');

  const inners = container.querySelectorAll('.text-reveal-inner');
  return inners;
}

/* ------------------------------------------------------------------ */
/*  Static strings so we don't re-create on every render               */
/* ------------------------------------------------------------------ */
const EYEBROW = 'Builder · Founder · Developer';
const HEADING_LINE_1 = 'Building products';
const HEADING_LINE_2A = 'that feel';
const HEADING_LINE_2B = 'calm';
const HEADING_LINE_3 = 'and work well';
const SUBTITLE =
  'I design and engineer systems, products, and experiences where clarity and craft compound over time.';

const STATS: { end: number; suffix: string; label: string }[] = [
  { end: 20, suffix: '+', label: 'Projects' },
  { end: 5, suffix: '+', label: 'Years Building' },
  { end: 50, suffix: '+', label: 'Articles' },
  { end: 10, suffix: 'K+', label: 'Community Reach' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* Refs for every animated element group */
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2aRef = useRef<HTMLDivElement>(null);
  const heading2bRef = useRef<HTMLDivElement>(null);
  const heading3Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  /* Counter value refs so the GSAP onUpdate can write to the DOM */
  const counterEls = useRef<(HTMLSpanElement | null)[]>([]);

  const setCounterRef = useCallback(
    (index: number) => (el: HTMLSpanElement | null) => {
      counterEls.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const eyebrow = eyebrowRef.current;
    const h1 = heading1Ref.current;
    const h2a = heading2aRef.current;
    const h2b = heading2bRef.current;
    const h3 = heading3Ref.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const stats = statsRef.current;

    if (!section || !content || !eyebrow || !h1 || !h2a || !h2b || !h3 || !subtitle || !cta || !stats) return;

    /* ---------- Build reveal units ---------- */
    const eyebrowInners = buildRevealUnits(eyebrow, EYEBROW, 0.08);
    const h1Inners = buildRevealUnits(h1, HEADING_LINE_1, 0.04);
    const h2aInners = buildRevealUnits(h2a, HEADING_LINE_2A, 0.05);
    const h2bInners = buildRevealUnits(h2b, HEADING_LINE_2B, 0.06);
    const h3Inners = buildRevealUnits(h3, HEADING_LINE_3, 0.04);
    const subInners = buildRevealUnits(subtitle, SUBTITLE, 0.02);

    /* ---------- Set initial states ---------- */
    gsap.set(eyebrow, { opacity: 0, y: 20 });
    gsap.set([cta, stats], { opacity: 0, y: 30 });

    /* Counter initial text */
    counterEls.current.forEach((el) => {
      if (el) el.textContent = '0';
    });

    /* ================================================================ */
    /*  ENTRANCE TIMELINE (time-based, fires after preloader ~2.3 s)    */
    /* ================================================================ */
    const entranceTl = gsap.timeline({ delay: 2.3 });

    /* 0.00s — Eyebrow fades up + words reveal simultaneously */
    entranceTl.to(eyebrow, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0);
    entranceTl.to(eyebrowInners, { y: '0%', duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0);

    /* 0.15s — Heading line 1 */
    entranceTl.to(h1Inners, { y: '0%', duration: 0.7, stagger: 0.04, ease: 'power3.out' }, 0.15);

    /* +0.05s gap — Heading line 2a */
    entranceTl.to(h2aInners, { y: '0%', duration: 0.7, stagger: 0.05, ease: 'power3.out' }, 0.35);

    /* +0.05s gap — Heading line 2b ("calm") */
    entranceTl.to(h2bInners, { y: '0%', duration: 0.7, stagger: 0.06, ease: 'power3.out' }, 0.45);

    /* +0.05s gap — Heading line 3 */
    entranceTl.to(h3Inners, { y: '0%', duration: 0.7, stagger: 0.04, ease: 'power3.out' }, 0.55);

    /* 0.70s — Subtitle */
    entranceTl.to(subInners, { y: '0%', duration: 0.7, stagger: 0.02, ease: 'power3.out' }, 0.7);

    /* 0.90s — CTA buttons */
    entranceTl.to(cta, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.9);

    /* 1.10s — Stats strip + counter animations */
    entranceTl.to(stats, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.1);

    STATS.forEach((stat, i) => {
      const el = counterEls.current[i];
      if (!el) return;
      const obj = { val: 0 };
      entranceTl.to(
        obj,
        {
          val: stat.end,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${stat.suffix}`;
          },
        },
        1.2,
      );
    });

    /* ================================================================ */
    /*  SCROLL-AWAY EFFECT (scrub-based, bidirectional)                  */
    /* ================================================================ */
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.8,
      },
    });

    scrollTl.fromTo(
      content,
      { y: 0, opacity: 1, scale: 1 },
      { y: -150, opacity: 0, scale: 0.95, ease: 'none' },
    );

    /* Stats parallax at a different speed */
    gsap.to(stats, {
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '60% top',
        scrub: 1,
      },
    });

    /* ---------- Cleanup ---------- */
    return () => {
      entranceTl.kill();
      scrollTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section) st.kill();
      });
      gsap.set([eyebrow, cta, stats], { opacity: 1, y: 0, clearProps: 'all' });
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
        <div
          ref={eyebrowRef}
          className="text-sm font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-8"
        />

        {/* Heading — word-by-word reveal */}
        <div className="mb-8">
          {/* Line 1: "Building products" */}
          <div
            ref={heading1Ref}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)]"
          />

          {/* Line 2: "that feel" + "calm" */}
          <div className="flex flex-wrap justify-center mt-2">
            <div
              ref={heading2aRef}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)]"
            />
            <div
              ref={heading2bRef}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight bg-gradient-to-r from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] bg-clip-text text-transparent"
            />
          </div>

          {/* Line 3: "and work well" */}
          <div
            ref={heading3Ref}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-[var(--ink)] justify-center mt-2"
          />
        </div>

        {/* Subtitle */}
        <div
          ref={subtitleRef}
          className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-12"
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
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
                <span ref={setCounterRef(i)}>0{stat.suffix}</span>
              </p>
              <p className="text-xs tracking-widest uppercase text-[var(--muted-foreground)] mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
