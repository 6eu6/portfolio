'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { articles, getFeaturedArticle, type Article } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function BlogSection({ onArticleClick }: { onArticleClick: (a: Article) => void }) {
  const featuredRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.featured);

  useEffect(() => {
    const feat = featuredRef.current;
    const grid = gridRef.current;

    const tweens: gsap.core.Tween[] = [];

    if (feat) {
      gsap.set(feat, { opacity: 0, y: 40 });
      tweens.push(
        gsap.to(feat, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feat,
            start: 'top 85%',
            once: true,
          },
        })
      );
    }

    if (grid) {
      const cards = grid.querySelectorAll('.blog-card');
      gsap.set(cards, { opacity: 0, y: 40 });
      tweens.push(
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true,
          },
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (
          (feat && st.trigger === feat) ||
          (grid && st.trigger === grid)
        ) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section id="blog" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-4">
          Blog
        </p>
        <TextReveal
          text="Writing & thinking"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl text-[15px]">
          Notes on product building, system design, AI engineering, and the craft of making things that last.
        </p>

        {/* Featured Article */}
        {featured && (
          <div
            ref={featuredRef}
            onClick={() => onArticleClick(featured)}
            className="group cursor-pointer mb-12 p-8 md:p-10 rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--sage)]/30 hover:shadow-xl transition-all duration-500"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
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
            <h3 className="text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors duration-300">
              {featured.title}
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-1">{featured.subtitle}</p>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6 max-w-2xl">
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
              className="blog-card group cursor-pointer p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--sage)]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
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
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-1 group-hover:text-[var(--sage)] transition-colors duration-300">
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
