'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialPlatforms as staticSocialPlatforms, type SocialPlatform } from '@/data/social';
import { ExternalLink } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/*  Real brand SVG icons — using official brand marks                 */
/* ------------------------------------------------------------------ */

function GitHubIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

function XTwitterIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedInIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function YouTubeIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TelegramIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function MailIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Icon map — maps DB icon names to real brand SVG components        */
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Github: GitHubIcon,
  Twitter: XTwitterIcon,
  Linkedin: LinkedInIcon,
  Youtube: YouTubeIcon,
  Send: TelegramIcon,
  Mail: MailIcon,
  'X': XTwitterIcon,
  'Telegram': TelegramIcon,
  'GitHub': GitHubIcon,
  'LinkedIn': LinkedInIcon,
  'YouTube': YouTubeIcon,
};

export default function SocialSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const countersAnimated = useRef(false);
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>(staticSocialPlatforms);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/socials');
        if (res.ok && !cancelled) {
          const data = await res.json();
          if (data.length > 0) {
            setSocialPlatforms(data.map((s: { name: string; description: string; metric: string; metricLabel: string; url: string; icon: string; color: string }) => ({
              name: s.name,
              description: s.description,
              metric: s.metric,
              metricLabel: s.metricLabel,
              url: s.url,
              icon: s.icon,
              color: s.color,
            })));
          }
        }
      } catch { /* fallback to static */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const parseMetric = useCallback((metric: string): number => {
    const num = parseFloat(metric.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  }, []);

  const getMetricSuffix = useCallback((metric: string): string => {
    return metric.replace(/[0-9.,]/g, '').trim();
  }, []);

  const animateCounters = useCallback(() => {
    if (countersAnimated.current) return;
    countersAnimated.current = true;

    const counters = gridRef.current?.querySelectorAll('.metric-counter');
    if (!counters) return;

    counters.forEach((counter) => {
      const el = counter as HTMLElement;
      const targetValue = parseFloat(el.dataset.value || '0');
      const suffix = el.dataset.suffix || '';
      const obj = { value: 0 };

      gsap.to(obj, {
        value: targetValue,
        duration: 1.5,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent =
            (targetValue % 1 === 0 ? Math.round(obj.value).toLocaleString() : obj.value.toFixed(1)) +
            suffix;
        },
      });
    });
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    const cards = grid.querySelectorAll('.social-card');
    // 3D entrance with rotateY(3deg)
    gsap.set(cards, {
      opacity: 0,
      y: 40,
      rotateY: 3,
      transformPerspective: 800,
    });

    const cardTrigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        const t = gsap.to(cards, {
          opacity: 1,
          y: 0,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        });
        tweens.push(t);
        // Animate counters after cards settle
        gsap.delayedCall(0.4, animateCounters);
      },
    });
    triggers.push(cardTrigger);

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === grid) st.kill();
      });
    };
  }, [animateCounters]);

  return (
    <section id="social" className="py-28 md:py-40 bg-gradient-to-b from-[var(--paper)] via-[var(--paper-2)]/20 to-[var(--paper)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[var(--sage)] mb-4">
          Connect
        </p>
        <TextReveal
          text="Find me online"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-12 sm:mb-16 max-w-2xl text-[15px]">
          I share progress, ideas, and resources across several platforms. Pick your favorite.
        </p>

        {/* Grid: 1 col → 2 col → 3 col */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {socialPlatforms.map((platform) => {
            const IconComponent = iconMap[platform.icon] || iconMap['Mail'];
            const numericValue = parseMetric(platform.metric);
            const suffix = getMetricSuffix(platform.metric);

            return (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-card group p-5 sm:p-6 rounded-xl border border-[var(--line)] bg-[var(--paper)] hover:border-[var(--sage)]/30 transition-all duration-500"
                style={{
                  transformStyle: 'preserve-3d',
                  transformPerspective: 800,
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    y: -6,
                    boxShadow: '0 16px 40px -8px rgba(0,0,0,0.10)',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    y: 0,
                    boxShadow: '0 0px 0px 0px rgba(0,0,0,0)',
                    duration: 0.3,
                    ease: 'power2.out',
                  });
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="social-icon w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{ backgroundColor: `${platform.color}12` }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        y: -2,
                        boxShadow: `0 4px 16px -2px ${platform.color}40`,
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
                    <IconComponent className="w-5 h-5 sm:w-[22px] sm:h-[22px]" style={{ color: platform.color }} />
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--ink)] mb-1">{platform.name}</h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-4">{platform.description}</p>
                <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-[var(--line)]">
                  {/\d/.test(platform.metric) ? (
                    <span
                      className="metric-counter text-xl sm:text-2xl font-bold text-[var(--ink)] tabular-nums"
                      data-value={numericValue}
                      data-suffix={suffix}
                    >
                      0{suffix}
                    </span>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold text-[var(--ink)]">
                      {platform.metric}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-[var(--muted-foreground)]">{platform.metricLabel}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
