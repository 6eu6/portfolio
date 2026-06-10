'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const bgGradientRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const info = infoRef.current;
    const form = formRef.current;
    const bgGradient = bgGradientRef.current;

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    // Subtle gradient background parallax
    if (bgGradient && section) {
      const parallaxTween = gsap.to(bgGradient, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
      tweens.push(parallaxTween);
    }

    // Info cards entrance: 3D from left rotateY(-3deg) + x(-40)
    if (info) {
      const cards = info.querySelectorAll('.contact-info-card');
      gsap.set(cards, {
        opacity: 0,
        x: -40,
        rotateY: -3,
        transformPerspective: 800,
      });
      const st = ScrollTrigger.create({
        trigger: info,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const t = gsap.to(cards, {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power3.out',
          });
          tweens.push(t);
        },
      });
      triggers.push(st);
    }

    // Form entrance: slide from right rotateY(3deg) + x(40)
    if (form) {
      gsap.set(form, {
        opacity: 0,
        x: 40,
        rotateY: 3,
        transformPerspective: 800,
      });
      const st = ScrollTrigger.create({
        trigger: form,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          const t = gsap.to(form, {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
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
      ScrollTrigger.getAll().forEach((st) => {
        if (
          (info && st.trigger === info) ||
          (form && st.trigger === form) ||
          (section && st.trigger === section) ||
          (bgGradient && st.trigger === bgGradient)
        ) {
          st.kill();
        }
      });
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      toast.success('Message sent!', {
        description: "Thanks for reaching out. I'll get back to you soon.",
      });
      setFormState({ name: '', email: '', message: '' });
    } catch {
      toast.error('Failed to send', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-28 md:py-40 overflow-hidden">
      {/* Subtle gradient background (parallax) — slightly increased opacity */}
      <div
        ref={bgGradientRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(142,181,145,0.05) 0%, rgba(180,167,210,0.06) 40%, rgba(100,149,170,0.05) 100%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <p className="text-[11px] tracking-[0.25em] font-semibold uppercase text-[var(--sage)] mb-4">
          Contact
        </p>
        <TextReveal
          text="Let's talk"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-10 sm:mb-16 max-w-2xl text-[15px]">
          Have a project in mind, a question, or just want to connect? I&apos;d love to hear from you.
        </p>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Contact Info */}
          <div ref={infoRef} className="lg:col-span-2 space-y-4">
            <div
              className="contact-info-card flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:shadow-[0_8px_24px_-8px_oklch(0.62_0.14_160/12%)] hover:border-[var(--sage)]/40 hover:bg-[var(--paper-2)]/60 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', transformPerspective: 800 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--sage)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Email</p>
                <p className="text-sm text-[var(--ink)]">Ahmed-alshaibani@outlook.com</p>
              </div>
            </div>

            <div
              className="contact-info-card flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:shadow-[0_8px_24px_-8px_oklch(0.62_0.14_160/12%)] hover:border-[var(--sage)]/40 hover:bg-[var(--paper-2)]/60 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', transformPerspective: 800 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--sage)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Location</p>
                <p className="text-sm text-[var(--ink)]">Remote — worldwide</p>
              </div>
            </div>

            <div
              className="contact-info-card flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:shadow-[0_8px_24px_-8px_oklch(0.62_0.14_160/12%)] hover:border-[var(--sage)]/40 hover:bg-[var(--paper-2)]/60 transition-all duration-300"
              style={{ transformStyle: 'preserve-3d', transformPerspective: 800 }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--sage)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Response Time</p>
                <p className="text-sm text-[var(--ink)]">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="lg:col-span-3" style={{ transformStyle: 'preserve-3d', transformPerspective: 800 }}>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-2 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="contact-input bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] h-11 sm:h-12 transition-all duration-400 focus:border-[var(--sage)]/50 focus:ring-3 focus:ring-[var(--sage)]/20 focus:shadow-[0_0_0_4px_oklch(0.62_0.14_160/10%)] focus:bg-[var(--paper-2)]/60"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-2 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    className="contact-input bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] h-11 sm:h-12 transition-all duration-400 focus:border-[var(--sage)]/50 focus:ring-3 focus:ring-[var(--sage)]/20 focus:shadow-[0_0_0_4px_oklch(0.65_0.12_230/10%)] focus:bg-[var(--paper-2)]/60"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-2 block">Message</label>
                <Textarea
                  placeholder="Tell me about your project or idea..."
                  rows={6}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  className="contact-input bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] resize-none transition-all duration-400 focus:border-[var(--sage)]/50 focus:ring-3 focus:ring-[var(--sage)]/20 focus:shadow-[0_0_0_4px_oklch(0.65_0.12_290/10%)] focus:bg-[var(--paper-2)]/60"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[var(--ink)] to-[var(--ink)]/90 text-[var(--paper)] hover:bg-[var(--ink)]/90 h-12 px-6 sm:px-8 text-sm tracking-wide transition-all duration-300 hover:shadow-[0_4px_24px_-4px_oklch(0.13_0.005_265/30%)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
