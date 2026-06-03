'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navigation } from '@/data/social';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!header || !progress) return;

    // Initially hidden
    gsap.set(header, { y: -100, opacity: 0 });

    // Show on scroll past 400px
    const showTween = gsap.to(header, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
      paused: true,
    });

    ScrollTrigger.create({
      start: 'top -400px',
      onUpdate: (self) => {
        if (self.direction === 1) {
          showTween.play();
        } else if (self.scroll() < 400) {
          showTween.reverse();
        }
      },
    });

    // Scroll progress bar
    const progressTween = gsap.to(progress, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });

    return () => {
      showTween.kill();
      progressTween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === document.documentElement || st.vars.start === 'top -400px') st.kill();
      });
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--paper)]/80 backdrop-blur-md border-b border-[var(--line)]"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="text-lg font-semibold tracking-tight text-[var(--ink)]">
          Ahmed<span className="text-[var(--sage)]">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[var(--paper)]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-6 mt-12">
                {navigation.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg text-[var(--ink)] hover:text-[var(--sage)] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5">
        <div
          ref={progressRef}
          className="h-full bg-[var(--sage)] origin-left scale-x-0"
        />
      </div>
    </header>
  );
}
