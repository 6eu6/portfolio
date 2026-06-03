'use client';

import { useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';
import type { Article } from '@/data/articles';
import { projects } from '@/data/projects';

import { SmoothScrollProvider } from '@/components/scroll/SmoothScroll';
import Preloader from '@/components/infrastructure/Preloader';
import CustomCursor from '@/components/infrastructure/CustomCursor';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import BlogSection from '@/components/sections/BlogSection';
import SocialSection from '@/components/sections/SocialSection';
import { CTASection } from '@/components/sections/CTASection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import Marquee from '@/components/motion/Marquee';
import HorizontalScroll from '@/components/motion/HorizontalScroll';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  const handleProjectClick = useCallback((_p: Project) => {
    // Future: open project detail modal
  }, []);

  const handleArticleClick = useCallback((_a: Article) => {
    // Future: open article detail modal
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader onComplete={() => setLoaded(true)} />
      <SmoothScrollProvider>
        <div className="noise-overlay min-h-screen flex flex-col relative bg-[var(--paper)]">
          <Header />

          <main className="flex-1 relative z-10">
            {/* Hero */}
            <HeroSection />

            {/* Marquee divider */}
            <div className="py-8 border-y border-[var(--line)] overflow-hidden">
              <Marquee speed={40} className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)]/5">
                <span className="mx-8">Products</span>
                <span className="text-[var(--sage)]/20 mx-4">◆</span>
                <span className="mx-8">Systems</span>
                <span className="text-[var(--sky)]/20 mx-4">◆</span>
                <span className="mx-8">Design</span>
                <span className="text-[var(--lav)]/20 mx-4">◆</span>
                <span className="mx-8">Engineering</span>
                <span className="text-[var(--sage)]/20 mx-4">◆</span>
                <span className="mx-8">AI</span>
                <span className="text-[var(--sky)]/20 mx-4">◆</span>
              </Marquee>
            </div>

            {/* About */}
            <AboutSection />

            {/* Horizontal Scroll Projects */}
            <div className="py-16 md:py-24">
              <HorizontalScroll projects={projects} onProjectClick={handleProjectClick} />
            </div>

            {/* Marquee divider 2 */}
            <div className="py-6 border-y border-[var(--line)] overflow-hidden bg-[var(--ink)]">
              <Marquee speed={35} direction="right" className="text-sm tracking-[0.3em] uppercase text-white/10">
                <span className="mx-12">Full-Stack</span>
                <span className="text-white/5 mx-4">◆</span>
                <span className="mx-12">AI & ML</span>
                <span className="text-white/5 mx-4">◆</span>
                <span className="mx-12">Product Design</span>
                <span className="text-white/5 mx-4">◆</span>
                <span className="mx-12">System Architecture</span>
                <span className="text-white/5 mx-4">◆</span>
                <span className="mx-12">Data Engineering</span>
                <span className="text-white/5 mx-4">◆</span>
                <span className="mx-12">Developer Tools</span>
                <span className="text-white/5 mx-4">◆</span>
              </Marquee>
            </div>

            {/* Expertise */}
            <ExpertiseSection />

            {/* Blog */}
            <BlogSection onArticleClick={handleArticleClick} />

            {/* Social */}
            <SocialSection />

            {/* CTA - Dark section */}
            <div className="bg-[var(--ink)]">
              <CTASection title="Let's design something useful, calm, and real." />
            </div>

            {/* Contact */}
            <ContactSection />
          </main>

          <Footer />
        </div>
      </SmoothScrollProvider>
    </>
  );
}
