'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertiseAreas } from '@/data/content';
import { Brain, Code2, Palette, Server, Database, Wrench } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Brain,
  Code2,
  Palette,
  Server,
  Database,
  Wrench,
};

export default function ExpertiseSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.expertise-card');
    const icons = grid.querySelectorAll('.expertise-icon');

    // ── Calculate diagonal stagger order ──
    // Map cards into a virtual grid (mobile:1col, tablet:2col, desktop:3col)
    // and sort by diagonal distance for stagger order
    const viewWidth = window.innerWidth;
    let cols: number;
    if (viewWidth >= 1024) cols = 3;
    else if (viewWidth >= 768) cols = 2;
    else cols = 1;

    const totalCards = cards.length;
    const diagonalOrder: number[] = [];
    for (let row = 0; row < Math.ceil(totalCards / cols); row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;
        if (idx < totalCards) diagonalOrder.push(idx);
      }
    }
    // Sort by diagonal distance (row + col)
    const gridMeta = diagonalOrder.map((idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      return { idx, diagonal: row + col, row, col };
    });
    gridMeta.sort((a, b) => a.diagonal - b.diagonal || a.col - b.col);
    const sortedIndices = gridMeta.map((m) => m.idx);

    // ── Set initial states ──
    gsap.set(cards, {
      opacity: 0,
      y: 50,
      rotateY: -5,
      transformOrigin: 'left center',
    });
    gsap.set(icons, { scale: 0, opacity: 0 });

    // ── Create timeline for card entrance ──
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        once: true,
      },
    });

    // Stagger cards in diagonal order
    const sortedCards = sortedIndices.map((i) => cards[i]);
    tl.to(sortedCards, {
      opacity: 1,
      y: 0,
      rotateY: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });

    // Icons spring in after cards appear (slight delay then spring)
    const sortedIcons = sortedIndices.map((i) => icons[i]);
    tl.to(
      sortedIcons,
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(2.5)', // spring overshoot
      },
      '-=0.3', // overlap with tail of card animation
    );

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <section id="expertise" className="relative py-28 md:py-40 overflow-hidden">
      {/* Gradient orb behind grid */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--lav)]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-[var(--sage)]/6 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--sage)] mb-4">
          Expertise
        </p>
        <TextReveal
          text="What I work with"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl text-[15px]">
          From machine learning pipelines to polished frontends — here&apos;s where
          I spend my focus.
        </p>

        {/* Grid with perspective for 3D effects */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          style={{ perspective: '1000px' }}
        >
          {expertiseAreas.map((area) => {
            const IconComponent = iconMap[area.icon];
            return (
              <div
                key={area.title}
                className="expertise-card group relative p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 transition-all duration-500 will-change-transform"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateZ(20px) translateY(-6px)';
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--sage) 40%, transparent)';
                  e.currentTarget.style.boxShadow = '0 20px 50px -12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateZ(0) translateY(0)';
                  e.currentTarget.style.borderColor = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div
                  className="expertise-icon w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm border border-white/10"
                  style={{ backgroundColor: `${area.color}18` }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: area.color, opacity: 0.9 }}
                    />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">
                  {area.title}
                </h3>
                <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed">
                  {area.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
