'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTASection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      }
    );

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--sage)]/10 via-[var(--sky)]/10 to-[var(--lav)]/10 border border-[var(--line)]">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--sage)]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--lav)]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 py-16 md:py-20 px-8 md:px-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--ink)] mb-6 max-w-3xl mx-auto leading-tight">
              {title}
            </h2>
            <p className="text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto">
              I&apos;m always open to interesting conversations, collaborations, and new projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90"
                asChild
              >
                <a href="#contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Get in Touch
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper-2)]"
                asChild
              >
                <a href="#projects-all">
                  See Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
