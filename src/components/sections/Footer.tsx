'use client';

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github,
  Send,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
};

export function Footer() {
  return (
    <footer className="bg-[var(--paper-2)] border-t border-[var(--line)] mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#home" className="text-xl font-semibold tracking-tight text-[var(--ink)]">
              Ahmed<span className="text-[var(--sage)]">.</span>
            </a>
            <p className="text-sm text-[var(--muted-foreground)] mt-3 max-w-sm leading-relaxed">
              Building products, systems, and digital experiences with clarity and craft.
              Less noise, more signal.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Navigation</h4>
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--sage)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--ink)] mb-4">Connect</h4>
            <div className="flex flex-wrap gap-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = iconMap[platform.icon];
                return (
                  <a
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg border border-[var(--line)] bg-[var(--paper)] flex items-center justify-center hover:border-[var(--sage)]/30 hover:bg-[var(--sage)]/5 transition-all"
                    title={platform.name}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4 text-[var(--muted-foreground)]" />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[var(--line)] gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} Ahmed Al-Shibani. Built with care.
          </p>
          <a
            href="#home"
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--sage)] transition-colors"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
