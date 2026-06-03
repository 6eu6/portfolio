'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { articles, getFeaturedArticle, type Article } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function BlogSection({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.featured);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section || !grid) return;

    const sectionTl = gsap.fromTo(
      section,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    const cards = grid.querySelectorAll('.blog-card');
    const gridTl = gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      sectionTl.kill();
      gridTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === grid) st.kill();
      });
    };
  }, []);

  return (
    <section id="blog" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6" ref={sectionRef}>
        {/* Section Label */}
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
          Blog
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4">
          Writing & thinking
        </h2>
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl">
          Notes on product building, system design, AI engineering, and the craft of making things that last.
        </p>

        {/* Featured Article */}
        {featured && (
          <div
            onClick={() => onArticleClick(featured)}
            className="group cursor-pointer mb-12 p-8 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50 hover:border-[var(--sage)]/30 hover:shadow-lg transition-all"
          >
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <Badge variant="secondary" className="text-xs">
                Featured
              </Badge>
              <Badge variant="outline" className="text-xs">
                {featured.category}
              </Badge>
              <span className="text-xs text-[var(--muted-foreground)]">
                {new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors">
              {featured.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-1">{featured.subtitle}</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-4 max-w-2xl">
              {featured.excerpt}
            </p>
            <div className="flex items-center gap-2 text-sm text-[var(--sage)] font-medium">
              Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="blog-card group cursor-pointer p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50 hover:border-[var(--sage)]/30 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="text-xs">
                  {article.category}
                </Badge>
                <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-1 group-hover:text-[var(--sage)] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-3">{article.subtitle}</p>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
