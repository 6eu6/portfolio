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
  const featuredBgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const featured = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.featured);

  useEffect(() => {
    const section = sectionRef.current;
    const feat = featuredRef.current;
    const featBg = featuredBgRef.current;
    const grid = gridRef.current;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Parallax gradient background on featured article
    if (featBg && feat) {
      const parallaxTween = gsap.to(featBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: feat,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      tweens.push(parallaxTween);
    }

    // Featured article entrance: scale(0.98) → scale(1)
    if (feat) {
      gsap.set(feat, { opacity: 0, scale: 0.98, y: 30 });
      const st = ScrollTrigger.create({
        trigger: feat,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const t = gsap.to(feat, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
          });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    // Blog cards: staggered 3D entrance with rotateX(3deg)
    if (grid) {
      const cards = grid.querySelectorAll('.blog-card');
      gsap.set(cards, { opacity: 0, y: 50, rotateX: 3, transformPerspective: 800 });
      const st = ScrollTrigger.create({
        trigger: grid,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const t = gsap.to(cards, {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
      // Also kill any remaining ScrollTriggers associated with our elements
      ScrollTrigger.getAll().forEach((st) => {
        if (
          (feat && st.trigger === feat) ||
          (grid && st.trigger === grid) ||
          (featBg && st.trigger === featBg)
        ) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="blog" className="py-28 md:py-40">
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
            className="group cursor-pointer mb-12 relative overflow-hidden rounded-2xl border border-[var(--line)] hover:border-[var(--sage)]/30 transition-all duration-500"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Decorative gradient background (parallax) */}
            <div
              ref={featuredBgRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(142,181,145,0.06) 0%, rgba(180,167,210,0.06) 40%, rgba(100,149,170,0.06) 100%)',
              }}
            />
            <div className="relative z-10 p-6 sm:p-8 md:p-10">
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
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--ink)] mb-2 group-hover:text-[var(--sage)] transition-colors duration-300">
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
            {/* Hover shadow overlay */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-xl" />
          </div>
        )}

        {/* Articles Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {otherArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="blog-card group cursor-pointer p-5 sm:p-6 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--sage)]/30 transition-all duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transformPerspective: 800,
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  y: -4,
                  boxShadow: '0 12px 24px -4px rgba(0,0,0,0.08), 0 4px 8px -2px rgba(0,0,0,0.04)',
                  duration: 0.35,
                  ease: 'power2.out',
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  y: 0,
                  boxShadow: '0 0px 0px 0px rgba(0,0,0,0)',
                  duration: 0.35,
                  ease: 'power2.out',
                });
              }}
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
