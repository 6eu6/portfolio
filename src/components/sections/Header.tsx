'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const isVisible = useRef(false);
  const showTlRef = useRef<gsap.core.Timeline | null>(null);
  const activeSectionRef = useRef<string>('');
  const ctaRef = useRef<HTMLButtonElement>(null);
  const ctaOffset = useRef({ x: 0, y: 0 });
  const ctaTarget = useRef({ x: 0, y: 0 });

  // Track glassmorphism state via ref to avoid re-renders
  const isScrolledRef = useRef(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Active section state — updated infrequently via rAF
  const [activeSection, setActiveSection] = useState('');

  // ─── Mobile sheet open state ────────────────────────────────────
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // ─── Staggered mobile menu animation ────────────────────────────
  useEffect(() => {
    if (!mobileOpen || !mobileNavRef.current) return;

    const items = mobileNavRef.current.querySelectorAll('.mobile-nav-item');
    gsap.set(items, { opacity: 0, x: 24, filter: 'blur(6px)' });
    gsap.to(items, {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      duration: 0.45,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 0.15,
    });
  }, [mobileOpen]);

  // ─── Core scroll logic: show/hide, glassmorphism, progress bar, active section ──────
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
      duration: 0.6,
      ease: 'power3.out',
    });
    showTlRef.current = showTl;

    // ─── Active section tracking via IntersectionObserver ──────────
    const sectionElements = navigation
      .map((item) => document.getElementById(item.sectionId))
      .filter(Boolean) as HTMLElement[];

    let rafId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            // Use rAF to batch state updates and avoid mid-frame re-renders
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
              if (activeSectionRef.current !== id) {
                activeSectionRef.current = id;
                setActiveSection(id);
              }
            });
          }
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    // ─── ScrollTrigger for show/hide, glass, progress ─────────────
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const scrollPos = self.scroll();
        const tl = showTlRef.current;

        // Show/hide header at 100px threshold
        if (scrollPos > 100 && !isVisible.current) {
          isVisible.current = true;
          tl?.play();
        } else if (scrollPos <= 100 && isVisible.current) {
          isVisible.current = false;
          tl?.reverse();
        }

        // Glassmorphism toggle
        const scrolled = scrollPos > 100;
        if (scrolled !== isScrolledRef.current) {
          isScrolledRef.current = scrolled;
          setIsScrolled(scrolled);
        }

        // Progress bar
        gsap.set(progress, { scaleX: self.progress });
      },
    });

    return () => {
      cancelAnimationFrame(rafId);
      showTl.kill();
      showTlRef.current = null;
      scrollTriggerInstance.kill();
      observer.disconnect();
    };
  }, []);

  // ─── Magnetic CTA button ────────────────────────────────────────
  const handleCtaMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const btn = ctaRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const maxDist = 18;

      const dx = Math.max(-maxDist, Math.min(maxDist, (e.clientX - centerX) * 0.3));
      const dy = Math.max(-maxDist, Math.min(maxDist, (e.clientY - centerY) * 0.3));

      ctaTarget.current = { x: dx, y: dy };
    },
    []
  );

  const handleCtaMouseLeave = useCallback(() => {
    ctaTarget.current = { x: 0, y: 0 };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.ticker.add(() => {
        if (!ctaRef.current) return;
        ctaOffset.current.x += (ctaTarget.current.x - ctaOffset.current.x) * 0.15;
        ctaOffset.current.y += (ctaTarget.current.y - ctaOffset.current.y) * 0.15;
        gsap.set(ctaRef.current, {
          x: ctaOffset.current.x,
          y: ctaOffset.current.y,
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // ─── Active link checker ───────────────────────────────────────
  const isActive = (sectionId: string) => activeSection === sectionId;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-2xl border-b border-[var(--line)]/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="text-lg font-semibold tracking-tight text-[var(--ink)] hover:text-[var(--sage)] transition-colors duration-200 select-none"
        >
          Ahmed<span className="text-[var(--sage)]">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navigation.map((item) => {
            const active = isActive(item.sectionId);
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative text-sm transition-colors duration-200 py-1 ${
                  active
                    ? 'text-[var(--sage)] font-medium'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--ink)]'
                }`}
              >
                {item.label}
                {/* Underline indicator */}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[2px] bg-[var(--sage)] rounded-full transition-all duration-300 ${
                    active ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                />
              </a>
            );
          })}

          {/* Magnetic CTA */}
          <button
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            className="ml-2 relative px-5 py-2 text-sm font-medium rounded-full bg-[var(--ink)] text-[var(--paper)] overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-[0.97]"
          >
            Let&apos;s Talk
          </button>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-[var(--ink)] hover:bg-[var(--ink)]/5 rounded-lg"
              >
                <Menu className="h-5 w-5" strokeWidth={1.8} />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-72 bg-[var(--paper)] border-[var(--line)]/40 p-0 flex flex-col [&>[data-slot=sheet-close]]:hidden"
            >
              {/* Close button */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-[var(--line)]/30">
                <SheetTitle className="text-sm font-medium text-[var(--muted-foreground)]">
                  Menu
                </SheetTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="h-9 w-9 rounded-full hover:bg-[var(--ink)]/5 text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
                >
                  <X className="h-5 w-5" strokeWidth={1.8} />
                </Button>
              </div>

              {/* Mobile nav items */}
              <nav
                ref={mobileNavRef}
                className="flex flex-col flex-1 px-2 pt-4"
              >
                {navigation.map((item) => {
                  const active = isActive(item.sectionId);
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`mobile-nav-item flex items-center h-14 px-4 rounded-xl text-[15px] transition-all duration-200 ${
                        active
                          ? 'text-[var(--sage)] font-medium bg-[var(--sage)]/8'
                          : 'text-[var(--ink)]/80 hover:text-[var(--ink)] hover:bg-[var(--ink)]/[0.04]'
                      }`}
                    >
                      {/* Active indicator dot */}
                      <span
                        className={`mr-3 h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                          active
                            ? 'bg-[var(--sage)] scale-100'
                            : 'bg-transparent scale-0'
                        }`}
                      />
                      {item.label}
                      {/* Active chevron */}
                      {active && (
                        <svg
                          className="ml-auto h-4 w-4 text-[var(--sage)]/50"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      )}
                    </a>
                  );
                })}

                {/* Mobile CTA */}
                <div className="mobile-nav-item mt-4 px-4">
                  <a
                    href="#contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center h-12 rounded-xl text-sm font-medium bg-[var(--ink)] text-[var(--paper)] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  >
                    Let&apos;s Talk
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scroll progress bar */}
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
