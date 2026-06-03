'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Clock, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    if (!section || !form) return;

    const sectionTl = gsap.fromTo(
      section,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    const formTl = gsap.fromTo(
      form,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );

    return () => {
      sectionTl.kill();
      formTl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === section || st.trigger === form) st.kill();
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form submitted:', formState);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-sm font-medium tracking-widest uppercase text-[var(--sage)] mb-4">
          Contact
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--ink)] mb-4">
          Let&apos;s talk
        </h2>
        <p className="text-[var(--muted-foreground)] mb-16 max-w-2xl">
          Have a project in mind, a question, or just want to connect? I&apos;d love to hear from you.
        </p>

        <div className="grid md:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--sage)]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[var(--sage)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Email</p>
                <p className="text-sm text-[var(--muted-foreground)]">hello@ahmedshibani.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--sky)]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[var(--sky)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Location</p>
                <p className="text-sm text-[var(--muted-foreground)]">Remote — worldwide</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/50">
              <div className="w-10 h-10 rounded-lg bg-[var(--lav)]/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[var(--lav)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ink)]">Response Time</p>
                <p className="text-sm text-[var(--muted-foreground)]">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-[var(--ink)] mb-1.5 block">Name</label>
                  <Input
                    placeholder="Your name"
                    value={formState.name}
                    onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                    className="bg-[var(--paper-2)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)]"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--ink)] mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                    className="bg-[var(--paper-2)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--ink)] mb-1.5 block">Message</label>
                <Textarea
                  placeholder="Tell me about your project or idea..."
                  rows={6}
                  value={formState.message}
                  onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  className="bg-[var(--paper-2)]/50 border-[var(--line)] text-[var(--ink)] placeholder:text-[var(--muted-foreground)] resize-none"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-[var(--ink)] text-[var(--paper)] hover:bg-[var(--ink)]/90 w-full sm:w-auto"
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
