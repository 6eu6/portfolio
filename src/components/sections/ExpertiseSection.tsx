'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { expertiseAreas } from '@/data/content';
import { Brain, Code2, Palette, Server, Database, Wrench } from 'lucide-react';

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
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const grid = gridRef.current;
    if (!header || !grid) return;

    // Header entrance
    gsap.set(header, { opacity: 0, y: 30 });
    const headerTl = gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true,
      },
    });

    // Cards entrance with stagger
    const cards = grid.querySelectorAll('.expertise-card');
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });

    const gridTl = gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 80%',
        once: true,
      },
    });

    return () => {
      headerTl.kill();
      gridTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === header || st.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <section id="expertise" className="py-24 md:py-32 bg-[var(--paper-2)]/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef}>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
            Expertise
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4">
            What I work with
          </h2>
          <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl">
            From machine learning pipelines to polished frontends — here&apos;s where I spend my focus.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expertiseAreas.map((area) => {
            const IconComponent = iconMap[area.icon];
            return (
              <div
                key={area.title}
                className="expertise-card group p-6 rounded-xl border border-[var(--line)] bg-[var(--paper)] transition-all hover:shadow-lg hover:border-[var(--sage)]/30"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${area.color}15` }}
                >
                  {IconComponent && (
                    <IconComponent className="w-6 h-6" style={{ color: area.color }} />
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
