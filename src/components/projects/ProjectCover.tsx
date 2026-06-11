'use client';

import {
  Sparkles,
  ShoppingBag,
  Workflow,
  Globe,
  SquareTerminal,
  Layers,
  Github,
  type LucideIcon,
} from 'lucide-react';
import type { Project } from '@/data/projects';

/* One consistent, self-rendered cover for every project — no external
   GitHub/screenshot images, so all cards share an identical, on-brand look. */

const categoryIcon: Record<string, LucideIcon> = {
  AI: Sparkles,
  'E-Commerce': ShoppingBag,
  Automation: Workflow,
  'Web Platform': Globe,
  'Developer Tools': SquareTerminal,
};

export default function ProjectCover({
  project,
  size = 'card',
}: {
  project: Project;
  size?: 'card' | 'hero';
}) {
  const Icon = categoryIcon[project.category] ?? Layers;

  const hasRepo = !!project.sourceUrl && project.sourceUrl !== '#';
  const hasLive = !!project.liveUrl && project.liveUrl !== '#';

  // Only show a handle when there's a real repo/live link (avoids echoing
  // the category, which already sits top-right).
  const handle = hasRepo
    ? `6eu6/${project.slug}`
    : hasLive
    ? project.liveUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
    : null;
  const HandleIcon = hasRepo ? Github : Globe;

  const tileSize = size === 'hero' ? 'w-20 h-20' : 'w-[60px] h-[60px]';
  const iconSize = size === 'hero' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[var(--paper-2)]">
      {/* Sage tint */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 28% 22%, oklch(0.62 0.14 160 / 10%) 0%, transparent 62%)',
        }}
      />
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--ink) 7%, transparent) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Centre icon tile */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`flex items-center justify-center ${tileSize} rounded-2xl bg-white/70 border border-[var(--sage)]/25 shadow-sm backdrop-blur-sm`}
        >
          <Icon className={`${iconSize} text-[var(--sage)]`} strokeWidth={1.6} />
        </div>
      </div>

      {/* Repo / live handle (top-left) */}
      {handle && (
        <div className="absolute top-3 left-3 max-w-[60%] flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)]">
          <HandleIcon className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{handle}</span>
        </div>
      )}

      {/* Category (top-right) */}
      <div className="absolute top-3 right-3 text-[10px] font-semibold tracking-wide uppercase text-[var(--sage)]">
        {project.category}
      </div>

      {/* Tech row + accent bar (bottom) */}
      <div className="absolute bottom-0 inset-x-0">
        {project.tags?.length > 0 && (
          <div className="px-3 pb-2 text-[10px] font-medium text-[var(--muted-foreground)] truncate">
            {project.tags.slice(0, 3).join('  ·  ')}
          </div>
        )}
        <div className="h-[3px] bg-gradient-to-r from-[var(--sage)] to-[var(--sage)]/20" />
      </div>
    </div>
  );
}
