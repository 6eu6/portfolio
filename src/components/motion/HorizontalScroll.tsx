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

const categoryGradients: Record<string, string> = {
  AI: 'linear-gradient(135deg, oklch(0.62 0.14 160 / 15%) 0%, oklch(0.62 0.14 160 / 5%) 50%, transparent 80%)',
  FinTech: 'linear-gradient(135deg, oklch(0.65 0.12 230 / 15%) 0%, oklch(0.65 0.12 230 / 5%) 50%, transparent 80%)',
  'Developer Tools': 'linear-gradient(135deg, oklch(0.70 0.09 80 / 15%) 0%, oklch(0.70 0.09 80 / 5%) 50%, transparent 80%)',
  'Content Systems': 'linear-gradient(135deg, oklch(0.65 0.12 290 / 15%) 0%, oklch(0.65 0.12 290 / 5%) 50%, transparent 80%)',
  SaaS: 'linear-gradient(135deg, oklch(0.62 0.16 10 / 15%) 0%, oklch(0.62 0.16 10 / 5%) 50%, transparent 80%)',
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

      // Entering from left
      gsap.fromTo(
        inner,
        {
          rotateY: 12,
          scale: 0.92,
          opacity: 0.3,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.04)',
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

      // Exiting to right
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
          opacity: 0.3,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.04)',
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

      // Shine effect
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
    <section ref={sectionRef} className="relative overflow-x-clip">
      {/* Header */}
      <div ref={headerRef} className="max-w-6xl mx-auto px-6 pb-12 md:pb-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--sage)] mb-4">
          Featured Work
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-[var(--ink)]">
          Projects that{' '}
          <span className="gradient-text">matter</span>
        </h2>
      </div>

      {/* Perspective wrapper */}
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
              {/* Card inner */}
              <div
                className="card-inner relative h-[50vh] sm:h-[55vh] md:h-[60vh] rounded-2xl overflow-hidden transition-[border-color,box-shadow] duration-500 border border-[var(--line)] bg-[var(--paper-2)]/50 group-hover:border-[var(--sage)]/40"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity, box-shadow',
                }}
              >
                {/* Category color glow — inside rounded clip, fades before edges */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse 80% 60% at 30% 40%, ${categoryColors[project.category] || 'var(--sage)'}12 0%, transparent 70%)`,
                  }}
                />

                {/* Subtle corner gradient — soft, contained within rounded clip */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-100 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${categoryColors[project.category] || 'var(--sage)'}08 0%, transparent 50%)`,
                  }}
                />

                {/* Shine sweep overlay — rounded to match card */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.10) 45%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.10) 55%, transparent 60%)',
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
                        className="text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full"
                        style={{
                          backgroundColor: `${categoryColors[project.category] || 'var(--primary)'}15`,
                          color: categoryColors[project.category] || 'var(--primary)',
                        }}
                      >
                        {project.category}
                      </span>
                      <span className="text-[11px] text-[var(--muted-foreground)] ml-3 font-medium">{project.year}</span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-[var(--muted-foreground)] group-hover:text-[var(--sage)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>

                  {/* Middle */}
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-4">{project.subtitle}</p>
                    <p className="text-[14px] text-[var(--muted-foreground)] leading-relaxed max-w-md">
                      {project.description}
                    </p>
                  </div>

                  {/* Bottom - Metric */}
                  <div className="flex items-center justify-between pt-6 border-t border-[var(--line)]">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--ink)]/5 text-[var(--muted-foreground)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-lg font-bold text-[var(--sage)] tabular-nums">{project.metric}</span>
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
