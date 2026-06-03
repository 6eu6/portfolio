'use client';

import { useRef } from 'react';
import { navigation, socialPlatforms } from '@/data/social';
import {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowUp,
} from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
};

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const footerVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    rotateX: 12,
    transformPerspective: 1200,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.25 + i * 0.12,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const socialIconVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 0.5 + i * 0.07,
      duration: 0.45,
      ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
    },
  }),
};

const bottomBarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.85, duration: 0.6 },
  },
};

/* ------------------------------------------------------------------ */
/*  Back-to-top floating button                                        */
/* ------------------------------------------------------------------ */

function BackToTopButton() {
  const controls = useAnimation();

  const handleClick = () => {
    // Use Lenis smooth scroll via anchor interception
    const lenis = (window as unknown as { __lenis?: { scrollTo: (el: HTMLElement | string, opts?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { offset: 0 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    controls.start({
      scale: [1, 1.3, 1],
      transition: { duration: 0.3 },
    });
  };

  return (
    <motion.button
      onClick={handleClick}
      animate={controls}
      whileHover={{ scale: 1.1, boxShadow: '0 0 24px rgba(143,183,166,0.35)' }}
      whileTap={{ scale: 0.95 }}
      className="group relative w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:border-[var(--sage)]/40 hover:bg-[var(--sage)]/10 transition-colors duration-300"
      aria-label="Back to top"
    >
      {/* Animated arrow */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
      >
        <ArrowUp className="w-4 h-4 text-white/50 group-hover:text-[var(--sage)] transition-colors duration-300" />
      </motion.div>

      {/* Glow ring on hover */}
      <span className="absolute inset-0 rounded-full border border-[var(--sage)]/0 group-hover:border-[var(--sage)]/20 transition-colors duration-300 pointer-events-none" />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer component                                                   */
/* ------------------------------------------------------------------ */

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <footer ref={ref} className="bg-[var(--ink)] text-white mt-auto relative">
      {/* ── Gradient decoration at the top ── */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--sage)]/30 to-transparent" />
      <div className="absolute inset-x-0 -top-px h-24 bg-gradient-to-b from-[var(--sage)]/[0.03] to-transparent pointer-events-none" />

      <motion.div
        className="max-w-6xl mx-auto px-6 py-16"
        variants={footerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* Brand */}
          <motion.div
            className="md:col-span-2"
            custom={0}
            variants={columnVariants}
          >
            <a
              href="#home"
              className="text-xl font-semibold tracking-tight text-white"
            >
              Ahmed<span className="text-[var(--sage)]">.</span>
            </a>
            <p className="text-sm text-white/40 mt-3 max-w-sm leading-relaxed">
              Building products, systems, and digital experiences with clarity
              and craft. Less noise, more signal.
            </p>

            {/* Social icons — inline on mobile, below brand on desktop */}
            <div className="flex flex-wrap gap-3 mt-6">
              {socialPlatforms.map((platform, i) => {
                const IconComponent = iconMap[platform.icon];
                return (
                  <motion.a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    custom={i}
                    variants={socialIconVariants}
                    whileHover={{
                      scale: 1.15,
                      borderColor: 'rgba(143,183,166,0.35)',
                      backgroundColor: 'rgba(143,183,166,0.1)',
                    }}
                    whileTap={{ scale: 0.92 }}
                    className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center transition-colors duration-300"
                    title={platform.name}
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4 text-white/40" />
                    )}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div custom={1} variants={columnVariants}>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white/30 mb-4">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2.5">
              {navigation.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ x: 4 }}
                  className="text-sm text-white/50 hover:text-[var(--sage)] transition-colors duration-200"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Connect label (desktop only — mobile shows icons under brand) */}
          <motion.div custom={2} variants={columnVariants} className="hidden md:block">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white/30 mb-4">
              Connect
            </h4>
            <p className="text-sm text-white/40 leading-relaxed">
              Find me across the web. I share code on GitHub, thoughts on X,
              and longer-form content on YouTube and my newsletter.
            </p>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          variants={bottomBarVariants}
          className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4"
        >
          <p className="text-xs text-white/30 text-center sm:text-left">
            © {new Date().getFullYear()} Ahmed Al-Shibani. Built with care.
          </p>

          <BackToTopButton />
        </motion.div>
      </motion.div>
    </footer>
  );
}
