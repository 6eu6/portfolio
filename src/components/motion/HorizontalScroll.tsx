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
  const perspectiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const header = headerRef.current;
    const perspective = perspectiveRef.current;
    if (!section || !track || !header || !perspective) return;

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

    // Horizontal scroll tween
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

    // 3D card effects using containerAnimation
    const panels = track.querySelectorAll<HTMLDivElement>('.h-panel');

    panels.forEach((panel, i) => {
      const inner = panel.querySelector<HTMLDivElement>('.card-inner');
      if (!inner) return;

      // --- Entering from left: fade in + rotate from perspective ---
      gsap.fromTo(
        inner,
        {
          rotateY: 12,
          scale: 0.92,
          opacity: 0.4,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
        },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)',
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 85%',
            end: 'center center',
            scrub: true,
          },
        },
      );

      // --- Exiting to right: rotate back + scale down ---
      gsap.fromTo(
        inner,
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.12)',
        },
        {
          rotateY: -10,
          scale: 0.92,
          opacity: 0.4,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)',
          duration: 0.6,
          ease: 'power2.in',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'center center',
            end: 'right 15%',
            scrub: true,
          },
        },
      );

      // --- Shine effect: subtle highlight sweep as card passes through center ---
      gsap.fromTo(
        inner,
        { '--shine': 0 } as any,
        {
          '--shine': 1,
          duration: 0.5,
          ease: 'power1.inOut',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrollTween,
            start: 'left 60%',
            end: 'right 40%',
            scrub: true,
          },
        },
      );
    });

    return () => {
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (
          st.trigger === section ||
          st.trigger === header ||
          (st.trigger as HTMLElement)?.classList?.contains('h-panel')
        ) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 pb-12 md:pb-16">
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
          Featured Work
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--ink)]">
          Projects that{' '}
          <span className="text-[var(--sage)]">matter</span>
        </h2>
      </div>

      {/* Perspective wrapper — enables 3D transforms on children */}
      <div
        ref={perspectiveRef}
        className="overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* Horizontal Track */}
        <div
          ref={trackRef}
          className="flex items-start gap-6 sm:gap-8 pl-6 sm:pl-10 md:pl-[max(2.5rem,calc((100vw-72rem)/2))] pr-[10vw] sm:pr-[15vw]"
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="h-panel flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] cursor-pointer group"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={() => onProjectClick(project)}
            >
              {/* Card inner — this gets the 3D transforms */}
              <div
                className="card-inner relative h-[50vh] sm:h-[55vh] md:h-[60vh] rounded-2xl overflow-hidden transition-[border-color] duration-500 border border-[var(--line)] bg-[var(--paper-2)]/50 group-hover:border-[var(--sage)]/50"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity, box-shadow',
                }}
              >
                {/* Depth shadow layer — adds thickness illusion */}
                <div
                  className="absolute inset-0 rounded-2xl transition-transform duration-500 group-hover:-translate-y-1"
                  style={{
                    background: 'var(--ink)',
                    opacity: 0.04,
                    transform: 'translateZ(-8px) translateY(4px)',
                  }}
                />

                {/* Gradient background based on category */}
                <div
                  className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(
                      135deg,
                      ${categoryColors[project.category] || 'var(--sage)'}40,
                      transparent 70%
                    )`,
                  }}
                />

                {/* Shine sweep overlay — driven by GSAP --shine custom prop */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)',
                    backgroundSize: '200% 100%',
                    backgroundPosition: 'calc(var(--shine, 0) * 100% + 50%) 0',
                    mixBlendMode: 'overlay',
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-6 sm:p-8 md:p-10 h-full flex flex-col justify-between">
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
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors duration-300">
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
      </div>
    </section>
  );
}
