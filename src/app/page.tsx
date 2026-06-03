'use client';

import { useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';
import type { Article } from '@/data/articles';

import { SmoothScrollProvider } from '@/components/scroll/SmoothScroll';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import ExpertiseSection from '@/components/sections/ExpertiseSection';
import { BlogSection } from '@/components/sections/BlogSection';
import SocialSection from '@/components/sections/SocialSection';
import { CTASection } from '@/components/sections/CTASection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  const handleProjectClick = useCallback((_p: Project) => {
    // Future: open project detail modal
  }, []);

  const handleArticleClick = useCallback((_a: Article) => {
    // Future: open article detail modal
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col relative bg-[var(--paper)]">
        <Header />
        <main className="flex-1 relative z-10">
          <HeroSection />
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent max-w-5xl mx-auto my-4" />
          <AboutSection />
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent max-w-5xl mx-auto my-4" />
          <ProjectsSection onProjectClick={handleProjectClick} />
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent max-w-5xl mx-auto my-4" />
          <ExpertiseSection />
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent max-w-5xl mx-auto my-4" />
          <BlogSection onArticleClick={handleArticleClick} />
          <SocialSection />
          <CTASection title="Let's design something useful, calm, and real." />
          <hr className="border-0 h-px bg-gradient-to-r from-transparent via-[var(--line)] to-transparent max-w-5xl mx-auto my-4" />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
