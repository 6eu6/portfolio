'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, type Project } from '@/data/projects';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import TiltCard from '@/components/scroll/TiltCard';

gsap.registerPlugin(ScrollTrigger);

const categoryColors: Record<string, string> = {
  AI: 'var(--sage)',
  FinTech: 'var(--sky)',
  'Developer Tools': 'var(--sand)',
  'Content Systems': 'var(--lav)',
  SaaS: 'var(--rose)',
};

export function ProjectsSection({ onProjectClick }: { onProjectClick: (p: Project) => void }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll('.project-card');

    const tween = gsap.fromTo(
      cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <section id="projects-all" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
          Projects
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4">
          Things I&apos;ve built
        </h2>
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl">
          A selection of products, systems, and experiments — from AI platforms to developer toolkits.
        </p>

        {/* Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <TiltCard
              key={project.id}
              className="project-card cursor-pointer"
            >
              <div
                onClick={() => onProjectClick(project)}
                className="group relative p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50 h-full transition-all hover:border-[var(--sage)]/30 hover:shadow-lg"
              >
                {/* Category + Status */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: `${categoryColors[project.category] || 'var(--primary)'}15`,
                      color: categoryColors[project.category] || 'var(--primary)',
                    }}
                  >
                    {project.category}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)]">{project.year}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[var(--ink)] mb-1 group-hover:text-[var(--sage)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mb-3">{project.subtitle}</p>

                {/* Description */}
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Metric */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
                  <span className="text-sm font-medium text-[var(--sage)]">{project.metric}</span>
                  <ArrowUpRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--sage)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
