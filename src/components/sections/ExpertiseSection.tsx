'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertiseAreas } from '@/data/content';
import { Brain, Code2, Palette, Server, Database, Wrench } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });

    const gridTl = gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      gridTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <section id="expertise" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-4">
          Expertise
        </p>
        <TextReveal
          text="What I work with"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl text-[15px]">
          From machine learning pipelines to polished frontends — here&apos;s where I spend my focus.
        </p>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {expertiseAreas.map((area) => {
            const IconComponent = iconMap[area.icon];
            return (
              <div
                key={area.title}
                className="expertise-card group p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:bg-[var(--paper)] transition-all duration-500 hover:shadow-lg hover:border-[var(--sage)]/30 hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${area.color}12` }}
                >
                  {IconComponent && (
                    <IconComponent className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" style={{ color: area.color }} />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">{area.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
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
