'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CTASection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const ctaBoxRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const ctaBox = ctaBoxRef.current;
    const blob1 = blob1Ref.current;
    const blob2 = blob2Ref.current;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Dramatic CTA box entrance: scale(0.9) + opacity(0) → scale(1) + opacity(1)
    if (ctaBox) {
      gsap.set(ctaBox, { opacity: 0, scale: 0.9, y: 20 });
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const t = gsap.to(ctaBox, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: 'back.out(1.4)',
          });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    // Floating blob 1 — slow continuous floating
    if (blob1) {
      const float1 = gsap.to(blob1, {
        x: 20,
        y: -15,
        scale: 1.15,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      tweens.push(float1);
    }

    // Floating blob 2 — offset timing
    if (blob2) {
      const float2 = gsap.to(blob2, {
        x: -15,
        y: 20,
        scale: 1.1,
        duration: 7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      });
      tweens.push(float2);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      triggers.forEach((st) => st.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === ctaBox) st.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={ctaBoxRef}
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm"
        >
          {/* Decorative floating blobs — increased size and opacity */}
          <div
            ref={blob1Ref}
            className="absolute top-0 right-0 w-56 sm:w-72 h-56 sm:h-72 bg-[var(--sage)]/15 rounded-full blur-3xl pointer-events-none"
          />
          <div
            ref={blob2Ref}
            className="absolute bottom-0 left-0 w-48 sm:w-56 h-48 sm:h-56 bg-[var(--sage)]/12 rounded-full blur-3xl pointer-events-none"
          />

          <div className="relative z-10 py-12 sm:py-16 md:py-20 px-6 sm:px-8 md:px-16 text-center">
            <h2 className="gradient-text text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 max-w-3xl mx-auto leading-tight">
              {title}
            </h2>
            <p className="text-white/50 mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">
              I&apos;m always open to interesting conversations, collaborations, and new projects.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[var(--ink)] hover:bg-white/90 h-12 px-6 sm:px-8 text-sm tracking-wide transition-all duration-400 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-[0.98]"
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
                className="border-white/20 text-white hover:bg-white/10 h-12 px-6 sm:px-8 text-sm tracking-wide transition-all duration-400 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:border-white/30 hover:scale-[1.03] active:scale-[0.98]"
                asChild
              >
                <a href="#projects-all">
                  See Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
