'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
}

const categoryColors: Record<string, string> = {
  AI: 'var(--sage)',
  FinTech: 'var(--sky)',
  'Developer Tools': 'var(--sand)',
  'Content Systems': 'var(--lav)',
  SaaS: 'var(--rose)',
};

export default function HorizontalScroll({ projects, onProjectClick }: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const header = headerRef.current;
    if (!section || !track || !header) return;

    // Header entrance
    gsap.set(header, { opacity: 0, y: 30 });
    gsap.to(header, {
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

    // Horizontal scroll
    const panels = track.querySelectorAll('.h-panel');
    const totalScroll = track.scrollWidth - window.innerWidth;

    const scrollTween = gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Stagger cards in as they scroll
    gsap.set(panels, { opacity: 0.3, scale: 0.9 });

    panels.forEach((panel, i) => {
      gsap.to(panel, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: scrollTween,
          start: 'left 70%',
          toggleActions: 'play none none reverse',
        },
      });
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === header) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
          Featured Work
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--ink)]">
          Projects that{' '}
          <span className="text-[var(--sage)]">matter</span>
        </h2>
      </div>

      {/* Horizontal Track */}
      <div ref={trackRef} className="flex items-start gap-8 pl-6 md:pl-[calc((100vw-72rem)/2+1.5rem)] pr-[15vw]">
        {projects.map((project) => (
          <div
            key={project.id}
            className="h-panel flex-shrink-0 w-[70vw] md:w-[40vw] lg:w-[30vw] cursor-pointer group"
            onClick={() => onProjectClick(project)}
          >
            <div
              className="relative h-[50vh] md:h-[60vh] rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/50 overflow-hidden transition-all duration-500 hover:border-[var(--sage)]/40 hover:shadow-2xl"
            >
              {/* Gradient background based on category */}
              <div
                className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${categoryColors[project.category] || 'var(--sage)'}40, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-10 h-full flex flex-col justify-between">
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: `${categoryColors[project.category] || 'var(--primary)'}15`,
                        color: categoryColors[project.category] || 'var(--primary)',
                      }}
                    >
                      {project.category}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-3">{project.year}</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--sage)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>

                {/* Middle */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-4">{project.subtitle}</p>
                  <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-md">
                    {project.description}
                  </p>
                </div>

                {/* Bottom - Metric */}
                <div className="flex items-center justify-between pt-6 border-t border-[var(--line)]">
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 rounded-full bg-[var(--ink)]/5 text-[var(--muted-foreground)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-lg font-bold text-[var(--sage)]">{project.metric}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
