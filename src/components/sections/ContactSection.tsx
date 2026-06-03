'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Clock, Send } from 'lucide-react';
import TextReveal from '@/components/motion/TextReveal';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const info = infoRef.current;
    const form = formRef.current;

    const tweens: gsap.core.Tween[] = [];

    // Info cards entrance (from left)
    if (info) {
      const cards = info.querySelectorAll('.contact-info-card');
      gsap.set(cards, { opacity: 0, x: -40, y: 20 });
      tweens.push(
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: info,
            start: 'top 80%',
            once: true,
          },
        })
      );
    }

    // Form entrance (from right)
    if (form) {
      gsap.set(form, { opacity: 0, x: 40 });
      tweens.push(
        gsap.to(form, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: form,
            start: 'top 80%',
            once: true,
          },
        })
      );
    }

    return () => {
      tweens.forEach((t) => t.kill());
      ScrollTrigger.getAll().forEach((st) => {
        if (
          (info && st.trigger === info) ||
          (form && st.trigger === form)
        ) {
          st.kill();
        }
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formState);
  };

  return (
    <section id="contact" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--sage)] mb-4">
          Contact
        </p>
        <TextReveal
          text="Let's talk"
          className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4"
          stagger={0.06}
        />
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl text-[15px]">
          Have a project in mind, a question, or just want to connect? I&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div ref={infoRef} className="md:col-span-2 space-y-4">
            <div className="contact-info-card flex items-start gap-4 p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--sage)]/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[var(--sage)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Email</p>
                <p className="text-sm text-[var(--ink)]">hello@ahmedshibani.com</p>
              </div>
            </div>

            <div className="contact-info-card flex items-start gap-4 p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--sky)]/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-[var(--sky)]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[var(--sky)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Location</p>
                <p className="text-sm text-[var(--ink)]">Remote — worldwide</p>
              </div>
            </div>

            <div className="contact-info-card flex items-start gap-4 p-5 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 hover:border-[var(--lav)]/30 transition-colors duration-300">
              <div className="w-10 h-10 rounded-lg bg-[var(--lav)]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[var(--lav)]" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-1">Response Time</p>
                <p className="text-sm text-[var(--ink)]">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-medium tracking-wider uppercase text-[var(--muted-foreground)] mb-2 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] h-12"
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
                    className="bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] h-12"
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
                  className="bg-[var(--paper-2)]/30 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 h-12 px-8 text-sm tracking-wide"
              >
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
