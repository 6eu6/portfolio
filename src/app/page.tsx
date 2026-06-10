'use client';

import { useCallback, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Project } from '@/data/projects';
import { projects as staticProjects } from '@/data/projects';

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
import ProjectDetailDialog from '@/components/projects/ProjectDetailDialog';

gsap.registerPlugin(ScrollTrigger);

/* API project type (tags/features/outcomes come as JSON strings) */
interface ApiProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  longDescription: string;
  tags: string;
  year: string;
  status: string;
  metric: string;
  role: string;
  team: string;
  duration: string;
  problem: string;
  solution: string;
  features: string;
  outcomes: string;
  lessons: string;
  coverImage: string;
  liveUrl: string;
  sourceUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

function normalizeProject(p: ApiProject): Project {
  const parse = (v: string): string[] => {
    try { return JSON.parse(v); } catch { return []; }
  };
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle || '',
    category: p.category,
    description: p.description || '',
    longDescription: p.longDescription || '',
    tags: parse(p.tags),
    year: p.year || '',
    status: p.status || 'In Progress',
    metric: p.metric || '',
    role: p.role || '',
    team: p.team || '',
    duration: p.duration || '',
    problem: p.problem || '',
    solution: p.solution || '',
    process: '',
    architecture: '',
    features: parse(p.features),
    outcomes: parse(p.outcomes),
    lessons: p.lessons || '',
    coverImage: p.coverImage || '',
    liveUrl: p.liveUrl || '#',
    sourceUrl: p.sourceUrl || '#',
    nextProject: '',
  };
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectOpen, setIsProjectOpen] = useState(false);

  // Fetch projects from API on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok && !cancelled) {
          const data: ApiProject[] = await res.json();
          if (data.length > 0) {
            setProjects(data.map(normalizeProject));
          }
        }
      } catch {
        // Fallback to static projects
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleProjectClick = useCallback((p: Project) => {
    setSelectedProject(p);
    setIsProjectOpen(true);
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

            {/* Marquee divider — light */}
            <div className="py-6 sm:py-8 border-y border-[var(--line)] overflow-hidden">
              <Marquee speed={40} className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ink)]/[0.10]">
                <span className="mx-6 sm:mx-8">Products</span>
                <span className="text-[var(--sage)]/30 mx-3 sm:mx-4">◆</span>
                <span className="mx-6 sm:mx-8">Systems</span>
                <span className="text-[var(--sage)]/30 mx-3 sm:mx-4">◆</span>
                <span className="mx-6 sm:mx-8">Design</span>
                <span className="text-[var(--sage)]/30 mx-3 sm:mx-4">◆</span>
                <span className="mx-6 sm:mx-8">Engineering</span>
                <span className="text-[var(--sage)]/30 mx-3 sm:mx-4">◆</span>
                <span className="mx-6 sm:mx-8">AI</span>
                <span className="text-[var(--sage)]/30 mx-3 sm:mx-4">◆</span>
              </Marquee>
            </div>

            {/* About */}
            <AboutSection />

            {/* Horizontal Scroll Projects */}
            <div id="projects-all" className="py-16 md:py-24">
              <HorizontalScroll projects={projects} onProjectClick={handleProjectClick} />
            </div>

            {/* Marquee divider — dark */}
            <div className="py-5 sm:py-6 border-y border-white/[0.08] overflow-hidden bg-[var(--ink)]">
              <Marquee speed={35} direction="right" className="text-[11px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/[0.18] font-medium">
                <span className="mx-8 sm:mx-12">Full-Stack</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
                <span className="mx-8 sm:mx-12">AI & ML</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
                <span className="mx-8 sm:mx-12">Product Design</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
                <span className="mx-8 sm:mx-12">System Architecture</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
                <span className="mx-8 sm:mx-12">Data Engineering</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
                <span className="mx-8 sm:mx-12">Developer Tools</span>
                <span className="text-white/[0.10] mx-3 sm:mx-4">◆</span>
              </Marquee>
            </div>

            {/* Expertise */}
            <ExpertiseSection />

            {/* Blog */}
            <BlogSection />

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

          {/* Project Detail Dialog */}
          <ProjectDetailDialog
            project={selectedProject}
            open={isProjectOpen}
            onClose={() => {
              setIsProjectOpen(false);
              setSelectedProject(null);
            }}
          />
        </div>
      </SmoothScrollProvider>
    </>
  );
}
