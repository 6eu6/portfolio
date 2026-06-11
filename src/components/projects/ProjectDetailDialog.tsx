'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  X,
  ExternalLink,
  Github,
  Clock,
  Users,
  Briefcase,
  Target,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import type { Project } from '@/data/projects';
import ProjectCover from '@/components/projects/ProjectCover';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ProjectDetailDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Safely parse a field that may be a JSON string or already an array. */
function parseJSONField<T>(value: T | string | undefined, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return value ? [value as unknown as T] : fallback;
    }
  }
  return fallback;
}

/* Single sage accent for every category — restrained, intentional. */
const categoryColors: Record<string, string> = {};
const CAT_ACCENT = 'var(--sage)';

function getStatusStyle(status: string): {
  bg: string;
  color: string;
  dot: string;
} {
  const s = status.toLowerCase();
  // Running / live / healthy → green
  if (
    s.includes('live') ||
    s.includes('production') ||
    s.includes('active') ||
    s.includes('24/7') ||
    s.includes('running')
  ) {
    return {
      bg: 'rgba(34,197,94,0.10)',
      color: '#16a34a',
      dot: '#22c55e',
    };
  }
  // Work in progress → amber
  if (
    s.includes('development') ||
    s.includes('progress') ||
    s.includes('building') ||
    s.includes('beta') ||
    s.includes('prototype')
  ) {
    return {
      bg: 'rgba(245,158,11,0.10)',
      color: '#d97706',
      dot: '#f59e0b',
    };
  }
  // experiment, etc.
  return {
    bg: 'rgba(168,85,247,0.10)',
    color: '#9333ea',
    dot: '#a855f7',
  };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function DetailCard({
  icon: Icon,
  label,
  value,
  accentColor,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accentColor?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/40 p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{
            backgroundColor: `${accentColor || 'var(--sage)'}12`,
            color: accentColor || 'var(--sage)',
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-medium tracking-wide uppercase text-[var(--muted-foreground)]">
          {label}
        </span>
      </div>
      <p className="text-sm font-semibold text-[var(--ink)]">{value}</p>
    </div>
  );
}

function FeatureCard({ feature }: { feature: string; index: number }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper-2)]/30 p-4 transition-all hover:border-[var(--sage)]/30 hover:shadow-sm">
      <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full mt-0.5 bg-[var(--sage)]/12 text-[var(--sage)]">
        <CheckCircle2 className="w-3.5 h-3.5" />
      </div>
      <span className="text-sm leading-relaxed text-[var(--ink)]/85">{feature}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ProjectDetailDialog({
  project,
  open,
  onClose,
}: ProjectDetailDialogProps) {
  if (!project) return null;

  // Parse fields that may come as JSON strings from API
  const tags = parseJSONField(project.tags);
  const features = parseJSONField(project.features);
  const outcomes = parseJSONField(project.outcomes);

  const catColor = categoryColors[project.category] || CAT_ACCENT;
  const statusStyle = getStatusStyle(project.status);

  const hasLiveUrl = project.liveUrl && project.liveUrl !== '#';
  const hasSourceUrl = project.sourceUrl && project.sourceUrl !== '#';

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="fixed inset-0 z-50 flex flex-col items-center justify-start rounded-none border-0 bg-[var(--paper)] p-0 sm:max-w-none translate-x-0 translate-y-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        showCloseButton={false}
        style={{
          maxWidth: '100vw',
          maxHeight: '100vh',
          width: '100vw',
          height: '100vh',
        }}
      >
        {/* Accessibility title */}
        <DialogTitle className="sr-only">{project.title}</DialogTitle>

        {/* ---------------------------------------------------------------- */}
        {/*  Top bar                                                         */}
        {/* ---------------------------------------------------------------- */}
        <header className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-md">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          <span className="hidden sm:block text-sm font-semibold text-[var(--ink)] truncate max-w-xs">
            {project.title}
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:text-[var(--ink)] hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/*  Scrollable body                                                 */}
        {/* ---------------------------------------------------------------- */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto w-full">
          <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
            {/* ------------------------------------------------------------ */}
            {/*  1. Hero area                                                  */}
            {/* ------------------------------------------------------------ */}
            <section className="reveal-section mb-12">
              {/* Category + Year + Status */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge
                  variant="secondary"
                  className="text-xs font-medium px-3 py-1"
                  style={{
                    backgroundColor: `${catColor}14`,
                    color: catColor,
                  }}
                >
                  {project.category}
                </Badge>
                <span className="text-xs text-[var(--muted-foreground)]">{project.year}</span>
                {/* Status badge */}
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: statusStyle.dot }}
                  />
                  {project.status}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] text-[var(--ink)] mb-4">
                {project.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
                {project.subtitle}
              </p>

              {/* Quick links */}
              {(hasLiveUrl || hasSourceUrl) && (
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  {hasLiveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-5 py-2.5 text-white transition-transform hover:scale-[1.03]"
                      style={{ backgroundColor: catColor }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Live Site
                      <span className="hidden sm:inline font-normal opacity-80">
                        — {project.liveUrl.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  )}
                  {hasSourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-5 py-2.5 border border-[var(--line)] text-[var(--ink)]/80 hover:border-[var(--ink)]/30 hover:text-[var(--ink)] transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="mt-8 w-16 h-px" style={{ backgroundColor: `${catColor}40` }} />
            </section>

            {/* ------------------------------------------------------------ */}
            {/*  1b. Cover                                                     */}
            {/* ------------------------------------------------------------ */}
            <section className="reveal-section mb-12">
              <div className="relative aspect-[16/7] rounded-2xl overflow-hidden border border-[var(--line)] shadow-sm">
                <ProjectCover project={project} size="hero" />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/*  2. Problem & Solution                                         */}
            {/* ------------------------------------------------------------ */}
            <section className="reveal-section mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Problem */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/40 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--ink)]/[0.06] text-[var(--ink)]/70">
                      <Target className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--ink)]">The Problem</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--ink)]/75">
                    {project.problem}
                  </p>
                </div>

                {/* Solution */}
                <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/40 p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${catColor}12`, color: catColor }}
                    >
                      <Wrench className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-[var(--ink)]">The Solution</h2>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--ink)]/75">
                    {project.solution}
                  </p>
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/*  3. Description / Long Description                              */}
            {/* ------------------------------------------------------------ */}
            <section className="reveal-section mb-12">
              <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Overview</h2>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/30 p-6 md:p-8">
                <p className="text-sm sm:text-base leading-7 md:leading-8 text-[var(--ink)]/80">
                  {project.longDescription || project.description}
                </p>
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/*  4. Key Details Grid                                           */}
            {/* ------------------------------------------------------------ */}
            <section className="reveal-section mb-12">
              <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Key Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                <DetailCard icon={Briefcase} label="Role" value={project.role} accentColor={catColor} />
                <DetailCard icon={Users} label="Team" value={project.team} accentColor={catColor} />
                <DetailCard icon={Clock} label="Duration" value={project.duration} accentColor={catColor} />
                <DetailCard
                  icon={Target}
                  label="Status"
                  value={project.status}
                  accentColor={statusStyle.color}
                />
                <DetailCard
                  icon={CheckCircle2}
                  label="Key Metric"
                  value={project.metric}
                  accentColor={catColor}
                />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/*  5. Features List                                              */}
            {/* ------------------------------------------------------------ */}
            {features.length > 0 && (
              <section className="reveal-section mb-12">
                <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {features.map((feature, i) => (
                    <FeatureCard key={i} feature={feature} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* ------------------------------------------------------------ */}
            {/*  6. Outcomes Section                                            */}
            {/* ------------------------------------------------------------ */}
            {outcomes.length > 0 && (
              <section className="reveal-section mb-12">
                <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Outcomes</h2>
                <div className="rounded-2xl border border-[var(--line)] overflow-hidden">
                  {outcomes.map((outcome, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-4 md:p-5 ${
                        i < outcomes.length - 1 ? 'border-b border-[var(--line)]' : ''
                      }`}
                    >
                      <div
                        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mt-0.5"
                        style={{
                          backgroundColor: `${catColor}14`,
                          color: catColor,
                        }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--ink)]/85 pt-1">
                        {outcome}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ------------------------------------------------------------ */}
            {/*  7. Tech Stack                                                 */}
            {/* ------------------------------------------------------------ */}
            {tags.length > 0 && (
              <section className="reveal-section mb-12">
                <h2 className="text-xl font-bold text-[var(--ink)] mb-4">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs font-medium px-3 py-1.5 rounded-full border-[var(--line)] text-[var(--ink)]/70 hover:text-[var(--ink)] hover:border-[var(--sage)]/40 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* ------------------------------------------------------------ */}
            {/*  8. Lessons Learned                                            */}
            {/* ------------------------------------------------------------ */}
            {project.lessons && (
              <section className="reveal-section mb-12">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--sage)] mb-3">
                  Takeaway
                </p>
                <blockquote className="rounded-2xl border border-[var(--line)] bg-[var(--paper-2)]/40 p-6 md:p-8">
                  <p className="text-base sm:text-lg leading-relaxed text-[var(--ink)]/85 font-medium">
                    {project.lessons}
                  </p>
                </blockquote>
              </section>
            )}

            {/* ------------------------------------------------------------ */}
            {/*  9. Action Buttons                                             */}
            {/* ------------------------------------------------------------ */}
            {(hasLiveUrl || hasSourceUrl) && (
              <section className="reveal-section">
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[var(--line)]">
                  {hasLiveUrl && (
                    <Button
                      asChild
                      className="gap-2 rounded-full px-6"
                      style={{
                        backgroundColor: catColor,
                        color: 'white',
                      }}
                    >
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </a>
                    </Button>
                  )}
                  {hasSourceUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="gap-2 rounded-full px-6 border-[var(--line)]"
                    >
                      <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </section>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}
