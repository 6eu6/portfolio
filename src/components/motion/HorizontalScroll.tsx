'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';
import { ArrowUpRight, ExternalLink, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  projects: Project[];
  onProjectClick: (p: Project) => void;
}

/* ── Category → color mapping ───────────────────────────────────── */
const categoryStyle: Record<string, { color: string; glow: string; gradient: string }> = {
  AI: {
    color: 'oklch(0.62 0.14 160)',
    glow: 'oklch(0.62 0.14 160 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.62 0.14 160 / 8%) 0%, oklch(0.62 0.14 160 / 3%) 40%, transparent 70%)',
  },
  FinTech: {
    color: 'oklch(0.65 0.12 230)',
    glow: 'oklch(0.65 0.12 230 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.65 0.12 230 / 8%) 0%, oklch(0.65 0.12 230 / 3%) 40%, transparent 70%)',
  },
  'Developer Tools': {
    color: 'oklch(0.70 0.09 80)',
    glow: 'oklch(0.70 0.09 80 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.70 0.09 80 / 8%) 0%, oklch(0.70 0.09 80 / 3%) 40%, transparent 70%)',
  },
  'Content Systems': {
    color: 'oklch(0.65 0.12 290)',
    glow: 'oklch(0.65 0.12 290 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.65 0.12 290 / 8%) 0%, oklch(0.65 0.12 290 / 3%) 40%, transparent 70%)',
  },
  SaaS: {
    color: 'oklch(0.62 0.16 10)',
    glow: 'oklch(0.62 0.16 10 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.62 0.16 10 / 8%) 0%, oklch(0.62 0.16 10 / 3%) 40%, transparent 70%)',
  },
  'E-Commerce': {
    color: 'oklch(0.62 0.16 10)',
    glow: 'oklch(0.62 0.16 10 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.62 0.16 10 / 8%) 0%, oklch(0.62 0.16 10 / 3%) 40%, transparent 70%)',
  },
  Automation: {
    color: 'oklch(0.70 0.09 80)',
    glow: 'oklch(0.70 0.09 80 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.70 0.09 80 / 8%) 0%, oklch(0.70 0.09 80 / 3%) 40%, transparent 70%)',
  },
  'Web Platform': {
    color: 'oklch(0.65 0.12 230)',
    glow: 'oklch(0.65 0.12 230 / 25%)',
    gradient: 'linear-gradient(160deg, oklch(0.65 0.12 230 / 8%) 0%, oklch(0.65 0.12 230 / 3%) 40%, transparent 70%)',
  },
};

const defaultStyle = {
  color: 'oklch(0.62 0.14 160)',
  glow: 'oklch(0.62 0.14 160 / 25%)',
  gradient: 'linear-gradient(160deg, oklch(0.62 0.14 160 / 8%) 0%, transparent 70%)',
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
        invalidateOnRefresh: true,
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
        },
        {
          rotateY: 0,
          scale: 1,
          opacity: 1,
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
        },
        {
          rotateY: -10,
          scale: 0.92,
          opacity: 0.3,
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

      // Cover image parallax — subtle horizontal drift as the card travels
      const coverImg = panel.querySelector<HTMLImageElement>('.card-cover img');
      if (coverImg) {
        gsap.fromTo(
          coverImg,
          { xPercent: -5, scale: 1.12 },
          {
            xPercent: 5,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        );
      }

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
      <div ref={headerRef} className="max-w-6xl mx-auto px-5 sm:px-6 pb-10 sm:pb-12 md:pb-16">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[var(--sage)] mb-4">
          Featured Work
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[var(--ink)]">
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
          className="flex items-start gap-4 sm:gap-6 md:gap-8 pl-5 sm:pl-6 md:pl-[max(2.5rem,calc((100vw-72rem)/2))] pr-[10vw] sm:pr-[15vw]"
        >
          {projects.map((project, i) => {
            const style = categoryStyle[project.category] || defaultStyle;
            return (
              <div
                key={project.id}
                className="h-panel flex-shrink-0 w-[88vw] sm:w-[62vw] md:w-[40vw] lg:w-[30vw] cursor-pointer group"
                style={{ transformStyle: 'preserve-3d' }}
                onClick={() => onProjectClick(project)}
              >
                {/* ── Card with proper clipping ──────────────────── */}
                <div
                  className="card-inner relative rounded-2xl overflow-hidden border border-[var(--line)] transition-all duration-500 group-hover:border-transparent"
                  style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform, opacity, box-shadow',
                    height: 'clamp(320px, 52vh, 65vh)',
                    /* ── True glassmorphism base ──────────────────── */
                    background: `
                      linear-gradient(
                        160deg,
                        ${style.color}08 0%,
                        rgba(255, 255, 255, 0.4) 30%,
                        rgba(255, 255, 255, 0.6) 100%
                      )
                    `,
                    backdropFilter: 'blur(20px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
                    boxShadow: '0 4px 24px -4px rgba(0,0,0,0.06), inset 0 1px 0 0 rgba(255,255,255,0.5)',
                  }}
                >
                  {/* ── Soft inner glow — clipped by overflow-hidden ── */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(ellipse 70% 50% at 25% 35%, ${style.color}12 0%, transparent 70%)`,
                    }}
                  />

                  {/* ── Shine sweep — clipped by parent overflow ───── */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 45%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.12) 55%, transparent 60%)',
                      backgroundSize: '200% 100%',
                      backgroundPosition: 'calc(var(--shine, 0) * 100% + 50%) 0',
                      mixBlendMode: 'overlay',
                    }}
                  />

                  {/* ── Content ─────────────────────────────────────── */}
                  <div className="relative z-10 flex flex-col justify-between h-full p-5 sm:p-6 md:p-8 lg:p-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] sm:text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: `${style.color}15`,
                            color: style.color,
                          }}
                        >
                          {project.category}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[var(--muted-foreground)] font-medium">
                          {project.year}
                        </span>
                      </div>
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border border-[var(--line)] bg-white/40 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:border-transparent"
                        style={{
                          boxShadow: '0 2px 8px -2px rgba(0,0,0,0.08)',
                        }}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] group-hover:text-[var(--ink)] transition-colors duration-300" />
                      </div>
                    </div>

                    {/* Cover image */}
                    {project.coverImage && (
                      <div className="card-cover relative mt-4 sm:mt-5 rounded-xl overflow-hidden border border-[var(--line)]/60 flex-1 min-h-[110px] bg-[var(--ink)]/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={project.coverImage}
                          alt={`${project.title} screenshot`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover object-top"
                        />
                      </div>
                    )}

                    {/* Middle — title + description */}
                    <div className="mt-auto pt-4 sm:pt-6">
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--ink)] mb-1.5 sm:mb-2 leading-tight group-hover:text-[var(--ink)] transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-3 sm:mb-4 font-medium">
                        {project.subtitle}
                      </p>
                      <p className="text-[12px] sm:text-[14px] text-[var(--muted-foreground)] leading-relaxed max-w-lg line-clamp-2 sm:line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom — tags + metric */}
                    <div className="flex items-center justify-between pt-4 sm:pt-5 mt-4 sm:mt-6 border-t border-[var(--line)]/60">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 max-w-[65%]">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-[var(--ink)]/5 text-[var(--muted-foreground)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span
                        className="text-sm sm:text-base md:text-lg font-bold tabular-nums shrink-0"
                        style={{ color: style.color }}
                      >
                        {project.metric}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
