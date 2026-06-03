'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialPlatforms } from '@/data/social';
import {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ExternalLink,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
};

export default function SocialSection() {
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

    // Cards entrance
    const cards = grid.querySelectorAll('.social-card');
    gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

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
    <section id="social" className="py-24 md:py-32 bg-[var(--paper-2)]/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div ref={headerRef}>
          <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
            Connect
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4">
            Find me online
          </h2>
          <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl">
            I share progress, ideas, and resources across several platforms. Pick your favorite.
          </p>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialPlatforms.map((platform) => {
            const IconComponent = iconMap[platform.icon];
            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card group p-6 rounded-xl border border-[var(--line)] bg-[var(--paper)] transition-all hover:shadow-lg hover:border-[var(--sage)]/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-6 h-6" style={{ color: platform.color }} />
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-1">{platform.name}</h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-4">{platform.description}</p>
                <div className="flex items-center gap-2 pt-4 border-t border-[var(--line)]">
                  <span className="text-2xl font-bold text-[var(--ink)]">{platform.metric}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">{platform.metricLabel}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
