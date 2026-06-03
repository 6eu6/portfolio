'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navigation } from '@/data/social';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const showTlRef = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    const progress = progressRef.current;
    if (!header || !progress) return;

    // Initially hide
    gsap.set(header, { y: -100, opacity: 0 });
    gsap.set(progress, { scaleX: 0 });

    const showTl = gsap.timeline({ paused: true });
    showTl.to(header, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power3.out',
    });
    showTlRef.current = showTl;

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const scrollPos = self.scroll();
        const tl = showTlRef.current;

        if (scrollPos > 300 && !isVisible.current) {
          isVisible.current = true;
          tl?.play();
        } else if (scrollPos <= 300 && isVisible.current) {
          isVisible.current = false;
          tl?.reverse();
        }

        gsap.set(progress, { scaleX: self.progress });
      },
    });

    return () => {
      showTl.kill();
      showTlRef.current = null;
      scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--paper)]/70 backdrop-blur-xl border-b border-[var(--line)]/50"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="text-lg font-semibold tracking-tight text-[var(--ink)] hover:text-[var(--sage)] transition-colors">
          Ahmed<span className="text-[var(--sage)]">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors duration-200"
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

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-[var(--sage)] via-[var(--sky)] to-[var(--lav)] origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </header>
  );
}
