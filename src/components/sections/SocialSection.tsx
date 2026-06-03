'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialPlatforms as staticSocialPlatforms, type SocialPlatform } from '@/data/social';
import {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ExternalLink,
} from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
};

export default function SocialSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const countersAnimated = useRef(false);
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>(staticSocialPlatforms);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/socials?XTransformPort=3000');
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
    <section id="social" className="py-28 md:py-40 bg-[var(--paper-2)]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-4">
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
            const IconComponent = iconMap[platform.icon];
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
                    y: -4,
                    boxShadow: '0 10px 20px -4px rgba(0,0,0,0.08)',
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
                    className="social-icon w-11 h-11 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-transform duration-300"
                    style={{ backgroundColor: `${platform.color}12` }}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        scale: 1.15,
                        duration: 0.6,
                        ease: 'elastic.out(1, 0.5)',
                        yoyo: true,
                        repeat: 1,
                      });
                    }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: platform.color }} />
                    )}
                  </div>
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[var(--ink)] mb-1">{platform.name}</h3>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-4">{platform.description}</p>
                <div className="flex items-center gap-2 pt-3 sm:pt-4 border-t border-[var(--line)]">
                  <span
                    className="metric-counter text-xl sm:text-2xl font-bold text-[var(--ink)]"
                    data-value={numericValue}
                    data-suffix={suffix}
                  >
                    0{suffix}
                  </span>
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
