'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { articles, getFeaturedArticle, type Article } from '@/data/articles';
import { ArrowRight, ArrowUpRight, Clock, BookOpen } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';
import ArticleDialog from '@/components/blog/ArticleDialog';
import type { ArticleDialogData } from '@/components/blog/ArticleDialog';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Category → accent mapping                                            */
/* ------------------------------------------------------------------ */
/* Single restrained accent (sage) across all categories — distinction
   comes from the text label, not from a rainbow of colors. */
const SAGE = 'oklch(0.62 0.14 160)';
const categoryAccent: Record<string, { color: string; colorRgb: string; bg: string }> = {
  AI:          { color: SAGE, colorRgb: '0.62 0.14 160', bg: 'oklch(0.62 0.14 160 / 6%)' },
  Product:      { color: SAGE, colorRgb: '0.62 0.14 160', bg: 'oklch(0.62 0.14 160 / 6%)' },
  Engineering:  { color: SAGE, colorRgb: '0.62 0.14 160', bg: 'oklch(0.62 0.14 160 / 6%)' },
  Design:       { color: SAGE, colorRgb: '0.62 0.14 160', bg: 'oklch(0.62 0.14 160 / 6%)' },
  Strategy:     { color: SAGE, colorRgb: '0.62 0.14 160', bg: 'oklch(0.62 0.14 160 / 6%)' },
};
const defaultAccent = { color: 'oklch(0.50 0 0)', colorRgb: '0.50 0 0', bg: 'oklch(0.50 0 0 / 5%)' };

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

  const allArticles = [...otherArticles, ...apiArticles];

  return (
    <section ref={sectionRef} id="blog" className="py-20 sm:py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        {/* ── Section Header ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 sm:mb-16">
          <div>
            <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[var(--sage)] mb-4">
              Blog
            </p>
            <TextReveal
              text="Writing & thinking"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
              stagger={0.06}
            />
            <p className="text-[var(--muted-foreground)] max-w-2xl text-[14px] sm:text-[15px]">
              Notes on product building, system design, AI engineering, and the craft of making things that last.
            </p>
          </div>
          <a
            onClick={() => document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2.5 shrink-0 text-[13px] font-semibold text-[var(--ink)] transition-all duration-300 hover:text-[var(--sage)] hover:gap-3"
          >
            <span className="relative">
              View All Articles
              <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-full bg-[var(--sage)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* ── Featured Article — Magazine Style ───────────────────── */}
        {featured && (
          <div
            ref={featuredRef}
            onClick={() => handleArticleClick(featured)}
            className="group cursor-pointer mb-10 sm:mb-14 relative"
          >
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--line)] group-hover:border-[var(--sage)]/30 transition-all duration-700"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 100%)',
                backdropFilter: 'blur(16px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
              }}
            >
              {/* Parallax gradient background */}
              <div
                ref={featuredBgRef}
                className="absolute inset-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `
                    radial-gradient(ellipse 60% 50% at 0% 15%, oklch(0.62 0.14 160 / 7%) 0%, transparent 60%)
                  `,
                }}
              />

              {/* Accent left line — single restrained sage */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--sage)]/70" />

              <div className="relative z-10 p-5 sm:p-8 md:p-10 pl-7 sm:pl-10 md:pl-14">
                {/* Top row */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-[var(--sage)]/10 text-[var(--sage)]">
                    Featured
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-full border border-[var(--line)] text-[var(--muted-foreground)]">
                    {featured.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-[var(--muted-foreground)] ml-auto">
                    <Clock className="w-3 h-3" />
                    {featured.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--ink)] mb-2 sm:mb-3 leading-tight group-hover:text-[var(--sage)] transition-colors duration-500">
                  {featured.title}
                </h3>

                {/* Subtitle */}
                <p className="text-sm sm:text-[15px] text-[var(--muted-foreground)]/80 mb-3 sm:mb-4 font-medium">
                  {featured.subtitle}
                </p>

                {/* Excerpt */}
                <p className="text-[12px] sm:text-sm text-[var(--muted-foreground)] leading-relaxed mb-5 sm:mb-6 max-w-2xl line-clamp-2 sm:line-clamp-3">
                  {featured.excerpt}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] text-[var(--muted-foreground)]">
                      {new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[var(--line)]">·</span>
                    <div className="flex gap-1.5">
                      {featured.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--paper-2)] text-[var(--muted-foreground)]/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--sage)] group-hover:gap-2.5 transition-all duration-300">
                    Read article
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Articles Grid ────────────────────────────────────────── */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {allArticles.map((article, idx) => {
            const accent = categoryAccent[article.category] || defaultAccent;
            return (
              <ArticleCard
                key={article.id}
                article={article}
                accent={accent}
                index={idx}
                onClick={() => handleArticleClick(article)}
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
/*  Article Card — Creative modern card component                       */
/* ================================================================== */

interface ArticleCardProps {
  article: Article | ApiArticle;
  accent: { color: string; colorRgb: string; bg: string };
  index: number;
  onClick: () => void;
}

function ArticleCard({ article, accent, index, onClick }: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accentBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const bar = accentBarRef.current;

    const handleEnter = () => {
      gsap.to(card, {
        y: -6,
        duration: 0.4,
        ease: 'power3.out',
      });
      if (bar) {
        gsap.to(bar, { scaleX: 1, duration: 0.5, ease: 'power3.out' });
      }
    };

    const handleLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      });
      if (bar) {
        gsap.to(bar, { scaleX: 0, duration: 0.4, ease: 'power3.in' });
      }
    };

    card.addEventListener('mouseenter', handleEnter);
    card.addEventListener('mouseleave', handleLeave);
    return () => {
      card.removeEventListener('mouseenter', handleEnter);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const title = article.title;
  const subtitle = 'subtitle' in article ? (article.subtitle || '') : '';
  const excerpt = article.excerpt;
  const category = article.category;
  const readTime = article.readTime;
  const tags = article.tags;
  const num = String(index + 2).padStart(2, '0');

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="blog-card group relative cursor-pointer"
      style={{ transformPerspective: 800 }}
    >
      {/* ── Card container with proper rounded clip ────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--line)] group-hover:border-transparent transition-all duration-500"
        style={{
          /* ── Glassmorphism background ──────────────────────────── */
          background: `linear-gradient(
            160deg,
            ${accent.color}06 0%,
            rgba(255, 255, 255, 0.5) 30%,
            rgba(255, 255, 255, 0.7) 100%
          )`,
          backdropFilter: 'blur(12px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(12px) saturate(1.2)',
          boxShadow: '0 2px 16px -4px rgba(0,0,0,0.05), inset 0 1px 0 0 rgba(255,255,255,0.4)',
        }}
      >
        {/* ── Top accent bar (animated on hover) ───────────────── */}
        <div className="absolute top-0 left-3 right-3 h-[2px] z-20">
          <div
            ref={accentBarRef}
            className="h-full rounded-full origin-left"
            style={{
              transform: 'scaleX(0)',
              background: `linear-gradient(90deg, ${accent.color}, ${accent.color}60)`,
            }}
          />
        </div>

        {/* ── Large decorative number (top-right) ──────────────── */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 pointer-events-none select-none z-0">
          <span
            className="text-[56px] sm:text-[72px] md:text-[80px] font-black leading-none tabular-nums"
            style={{
              color: accent.color,
              opacity: 0.06,
            }}
          >
            {num}
          </span>
        </div>

        {/* ── Category color dot (top-left, subtle) ──────────────── */}
        <div
          className="absolute top-4 left-4 sm:top-5 sm:left-5 w-2 h-2 rounded-full z-10 group-hover:scale-150 transition-transform duration-500"
          style={{
            backgroundColor: accent.color,
            opacity: 0.6,
            boxShadow: `0 0 8px 2px ${accent.bg}`,
          }}
        />

        {/* ── Content ───────────────────────────────────────────── */}
        <div className="relative z-10 p-5 sm:p-6">
          {/* Top row: category + time */}
          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span
              className="text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded-md"
              style={{
                color: accent.color,
                backgroundColor: accent.bg,
              }}
            >
              {category}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1 ml-auto">
              <BookOpen className="w-3 h-3" />
              {readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-[16px] sm:text-[17px] font-bold text-[var(--ink)] mb-1.5 leading-snug group-hover:text-[var(--ink)] transition-colors duration-300">
            {title}
          </h3>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-[12px] sm:text-[13px] text-[var(--muted-foreground)]/70 mb-3 leading-snug font-medium">
              {subtitle}
            </p>
          )}

          {/* Excerpt */}
          <p className="text-[11px] sm:text-[12px] text-[var(--muted-foreground)]/55 leading-relaxed line-clamp-2 mb-4 sm:mb-5">
            {excerpt}
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[var(--line)]/50">
            <div className="flex gap-1.5 overflow-hidden">
              {Array.isArray(tags) && tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-md bg-[var(--ink)]/4 text-[var(--muted-foreground)]/70"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Read indicator */}
            <span
              className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold transition-all duration-300 group-hover:gap-2"
              style={{ color: accent.color }}
            >
              Read
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
