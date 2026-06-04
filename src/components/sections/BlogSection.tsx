'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { articles, getFeaturedArticle, type Article } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';
import ArticleDialog from '@/components/blog/ArticleDialog';
import type { ArticleDialogData } from '@/components/blog/ArticleDialog';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Category → accent color mapping                                    */
/* ------------------------------------------------------------------ */
const categoryAccent: Record<string, { color: string; bg: string; glow: string }> = {
  AI:          { color: 'var(--sage)', bg: 'oklch(0.62 0.14 160 / 6%)',  glow: 'oklch(0.62 0.14 160 / 15%)' },
  Product:      { color: 'var(--sand)', bg: 'oklch(0.70 0.09 80 / 6%)',   glow: 'oklch(0.70 0.09 80 / 15%)' },
  Engineering:  { color: 'var(--sky)',  bg: 'oklch(0.65 0.12 230 / 6%)',  glow: 'oklch(0.65 0.12 230 / 15%)' },
  Design:       { color: 'var(--lav)',  bg: 'oklch(0.65 0.12 290 / 6%)',  glow: 'oklch(0.65 0.12 290 / 15%)' },
  Strategy:     { color: 'var(--rose)', bg: 'oklch(0.62 0.16 10 / 6%)',   glow: 'oklch(0.62 0.16 10 / 15%)' },
};
const defaultAccent = { color: 'var(--muted-foreground)', bg: 'oklch(0.50 0 0 / 5%)', glow: 'oklch(0.50 0 0 / 10%)' };

/* ------------------------------------------------------------------ */
/*  API Article type                                                   */
/* ------------------------------------------------------------------ */
interface ApiArticle {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  category: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  tags: string[];
}

/* ------------------------------------------------------------------ */
/*  Blog Section                                                       */
/* ------------------------------------------------------------------ */

export default function BlogSection() {
  const featuredRef = useRef<HTMLDivElement>(null);
  const featuredBgRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const featured = getFeaturedArticle();
  const otherArticles = articles.filter((a) => !a.featured);

  const [apiArticles, setApiArticles] = useState<ApiArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleDialogData | null>(null);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/articles');
        if (res.ok && !cancelled) {
          const data: ApiArticle[] = await res.json();
          setApiArticles(data);
        }
      } catch { /* fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleArticleClick = (a: Article | ApiArticle) => {
    setSelectedArticle(a as ArticleDialogData);
    setIsReading(true);
  };

  /* ── GSAP animations ────────────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    const feat = featuredRef.current;
    const featBg = featuredBgRef.current;
    const grid = gridRef.current;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    if (featBg && feat) {
      const t = gsap.to(featBg, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: feat, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      tweens.push(t);
    }

    if (feat) {
      gsap.set(feat, { opacity: 0, y: 30 });
      const st = ScrollTrigger.create({
        trigger: feat, start: 'top 85%', once: true,
        onEnter: () => {
          const t = gsap.to(feat, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    if (grid) {
      const cards = grid.querySelectorAll('.blog-card');
      gsap.set(cards, { opacity: 0, y: 40, rotateX: 2, transformPerspective: 800 });
      const st = ScrollTrigger.create({
        trigger: grid, start: 'top 85%', once: true,
        onEnter: () => {
          const t = gsap.to(cards, { opacity: 1, y: 0, rotateX: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if ((feat && st.trigger === feat) || (grid && st.trigger === grid) || (featBg && st.trigger === featBg)) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="blog" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
          <div>
            <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[var(--sage)] mb-4">
              Blog
            </p>
            <TextReveal
              text="Writing & thinking"
              className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
              stagger={0.06}
            />
            <p className="text-[var(--muted-foreground)] max-w-2xl text-[15px]">
              Notes on product building, system design, AI engineering, and the craft of making things that last.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 shrink-0 border-[var(--line)] hover:border-[var(--sage)]/40 hover:text-[var(--sage)] transition-colors rounded-lg"
            asChild
          >
            <a href="#blog">
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Featured Article — large card with accent line */}
        {featured && (
          <div
            ref={featuredRef}
            onClick={() => handleArticleClick(featured)}
            className="group cursor-pointer mb-12 relative overflow-hidden rounded-2xl border border-[var(--line)] hover:border-[var(--sage)]/30 transition-all duration-500"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Parallax gradient */}
            <div
              ref={featuredBgRef}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, oklch(0.62 0.14 160 / 6%) 0%, oklch(0.65 0.12 290 / 4%) 50%, oklch(0.65 0.12 230 / 4%) 100%)',
              }}
            />
            {/* Accent left line */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] rounded-l-2xl" />

            <div className="relative z-10 p-6 sm:p-8 md:p-10 pl-8 sm:pl-11 md:pl-14">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-xs bg-[var(--sage)]/8 text-[var(--sage)]">
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
                Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Static articles */}
          {otherArticles.map((article, idx) => {
            const accent = categoryAccent[article.category] || defaultAccent;
            return (
              <ArticleCard
                key={article.id}
                article={article}
                accent={accent}
                index={idx}
                onClick={() => handleArticleClick(article)}
                isApi={false}
              />
            );
          })}

          {/* API articles */}
          {apiArticles.map((article, idx) => {
            const accent = categoryAccent[article.category] || defaultAccent;
            return (
              <ArticleCard
                key={`api-${article.id}`}
                article={article}
                accent={accent}
                index={idx + otherArticles.length}
                onClick={() => handleArticleClick(article)}
                isApi={true}
              />
            );
          })}
        </div>
      </div>

      {/* Article Dialog */}
      <ArticleDialog
        article={selectedArticle}
        open={isReading}
        onClose={() => { setIsReading(false); setSelectedArticle(null); }}
      />
    </section>
  );
}

/* ================================================================== */
/*  Article Card — a reusable creative card component                    */
/* ================================================================== */

interface ArticleCardProps {
  article: Article | ApiArticle;
  accent: { color: string; bg: string; glow: string };
  index: number;
  onClick: () => void;
  isApi: boolean;
}

function ArticleCard({ article, accent, index, onClick, isApi }: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const line = lineRef.current;
    const num = numberRef.current;

    const handleEnter = () => {
      // Top accent line — expands from center
      if (line) {
        gsap.to(line, {
          scaleX: 1,
          duration: 0.5,
          ease: 'power3.out',
        });
      }
      // Card lift + shadow
      gsap.to(card, {
        y: -8,
        boxShadow: `0 20px 50px -12px ${accent.glow}`,
        duration: 0.4,
        ease: 'power3.out',
      });
      // Number fades in
      if (num) {
        gsap.to(num, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    const handleLeave = () => {
      if (line) {
        gsap.to(line, {
          scaleX: 0,
          duration: 0.4,
          ease: 'power3.in',
        });
      }
      gsap.to(card, {
        y: 0,
        boxShadow: '0 0px 0px 0px rgba(0,0,0,0)',
        duration: 0.4,
        ease: 'power3.out',
      });
      if (num) {
        gsap.to(num, {
          opacity: 0,
          y: 4,
          duration: 0.25,
          ease: 'power2.in',
        });
      }
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mouseenter', handleEnter);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, [accent.glow]);

  const title = article.title;
  const subtitle = 'subtitle' in article ? article.subtitle : '';
  const excerpt = article.excerpt;
  const category = article.category;
  const readTime = article.readTime;
  const tags = article.tags;

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`blog-card group relative cursor-pointer rounded-xl border transition-all duration-300 ${
        isApi
          ? 'border-[var(--line)] bg-[var(--paper)]'
          : 'border-[var(--line)] bg-[var(--paper)]'
      }`}
      style={{
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
    >
      {/* ── Top accent line (animated) ────────────────────────────── */}
      <div className="absolute top-0 left-4 right-4 h-[2px] z-20">
        <div
          ref={lineRef}
          className="h-full rounded-full origin-left"
          style={{
            transform: 'scaleX(0)',
            background: `linear-gradient(90deg, ${accent.color}, transparent)`,
          }}
        />
      </div>

      {/* ── Subtle background glow on hover ───────────────────────── */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 0%, ${accent.bg}, transparent)`,
        }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 p-5 sm:p-6">
        {/* Top row: category + time */}
        <div className="flex items-center gap-2.5 mb-4">
          <span
            className="text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md"
            style={{
              color: accent.color,
              backgroundColor: accent.bg,
            }}
          >
            {category}
          </span>
          <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 ml-auto">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold text-[var(--ink)] mb-1.5 leading-snug group-hover:text-[var(--ink)] transition-colors duration-300">
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-[13px] text-[var(--muted-foreground)]/70 mb-3 leading-snug">
            {subtitle}
          </p>
        )}

        {/* Excerpt */}
        <p className="text-[12px] text-[var(--muted-foreground)]/60 leading-relaxed line-clamp-2 mb-4">
          {excerpt}
        </p>

        {/* Bottom row: tags + read link */}
        <div className="flex items-center justify-between pt-3.5 border-t border-[var(--line)]/60">
          <div className="flex gap-1.5 overflow-hidden">
            {Array.isArray(tags) && tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--paper-2)] text-[var(--muted-foreground)]/70"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Read indicator */}
          <span className="flex items-center gap-1.5 text-[11px] font-medium transition-all duration-300"
            style={{ color: accent.color }}
          >
            Read
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>

        {/* ── Floating article number (appears on hover) ─────────── */}
        <span
          ref={numberRef}
          className="absolute -top-2 -right-1 text-[11px] font-bold tabular-nums opacity-0"
          style={{
            transform: 'translateY(4px)',
            color: accent.color,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
