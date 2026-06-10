'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, Clock } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface ArticleDialogData {
  id: number | string;
  title: string;
  subtitle?: string;
  content?: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  tags?: string[];
  featured?: boolean;
}

interface ArticleDialogProps {
  article: ArticleDialogData | null;
  open: boolean;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Simple markdown → React elements                                    */
/* ------------------------------------------------------------------ */

function renderInline(text: string): React.ReactNode {
  // Split by inline code spans first to protect them
  const parts = text.split(/(`[^`]+`)/);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    // Handle bold and italic within non-code segments
    const segments = part.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);
    return segments.map((seg, j) => {
      if (seg.startsWith('**') && seg.endsWith('**')) {
        return <strong key={`${i}-${j}`}>{seg.slice(2, -2)}</strong>;
      }
      if (seg.startsWith('*') && seg.endsWith('*')) {
        return <em key={`${i}-${j}`}>{seg.slice(1, -1)}</em>;
      }
      // Handle links [text](url)
      const linkParts = seg.split(/(\[[^\]]+\]\([^)]+\))/);
      return linkParts.map((lp, k) => {
        const linkMatch = lp.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={`${i}-${j}-${k}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--sage)] underline underline-offset-4 hover:text-[var(--sage)]/80 transition-colors"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return <span key={`${i}-${j}-${k}`}>{lp}</span>;
      });
    });
  });
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let paragraphBuffer: string[] = [];
  let key = 0;

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();
      if (text) {
        elements.push(
          <p key={key++} className="text-base leading-7 text-[var(--ink)]/85 mb-5">
            {renderInline(text)}
          </p>
        );
      }
      paragraphBuffer = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks (```)
    if (line.trim().startsWith('```')) {
      flushParagraph();
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={key++}
          className="my-5 overflow-x-auto rounded-lg border border-[var(--line)] bg-muted/50 p-4 text-sm leading-6 font-mono"
        >
          {lang && (
            <span className="mb-2 block text-xs font-medium text-[var(--sage)]">{lang}</span>
          )}
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++; // skip closing ```
      continue;
    }

    // Headers
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={key++} className="text-xl font-semibold text-[var(--ink)] mt-8 mb-3">
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-[var(--ink)] mt-10 mb-4">
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-[var(--ink)] mt-10 mb-4">
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^\s*[-*]\s+/)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s+/)) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-5 ml-6 list-disc space-y-2 text-base leading-7 text-[var(--ink)]/85">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\s*\d+\.\s+/)) {
      flushParagraph();
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s+/)) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-5 ml-6 list-decimal space-y-2 text-base leading-7 text-[var(--ink)]/85">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flushParagraph();
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          className="my-5 border-l-4 border-[var(--sage)]/40 pl-5 py-2 text-base leading-7 italic text-[var(--ink)]/70"
        >
          {quoteLines.map((ql, idx) => (
            <p key={idx} className="mb-2 last:mb-0">{renderInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^\s*---+\s*$/)) {
      flushParagraph();
      elements.push(
        <hr key={key++} className="my-8 border-t border-[var(--line)]" />
      );
      i++;
      continue;
    }

    // Blank line → flush paragraph
    if (line.trim() === '') {
      flushParagraph();
      i++;
      continue;
    }

    // Normal text line → accumulate into paragraph
    paragraphBuffer.push(line.trim());
    i++;
  }

  flushParagraph();

  return <>{elements}</>;
}

/* ------------------------------------------------------------------ */
/*  Article Dialog Component                                           */
/* ------------------------------------------------------------------ */

export default function ArticleDialog({ article, open, onClose }: ArticleDialogProps) {
  if (!article) return null;

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const displayContent = article.content || article.excerpt;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="fixed top-[50%] left-[50%] z-50 flex flex-col w-[calc(100vw-2rem)] max-w-3xl h-[88vh] sm:h-[86vh] translate-x-[-50%] translate-y-[-50%] rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-0 gap-0 overflow-hidden shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-4"
        showCloseButton={false}
      >
        {/* Accessibility title */}
        <DialogTitle className="sr-only">{article.title}</DialogTitle>

        {/* Top bar */}
        <header className="flex items-center justify-between w-full px-5 sm:px-6 py-3.5 border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur-md shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:text-[var(--ink)] hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Article body — scrollable */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto w-full overscroll-contain">
          <article className="mx-auto max-w-3xl px-5 sm:px-8 md:px-10 py-8 sm:py-10">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge
                variant="secondary"
                className="text-xs font-medium bg-[var(--sage)]/10 text-[var(--sage)] hover:bg-[var(--sage)]/15"
              >
                {article.category}
              </Badge>
              <span className="text-xs text-[var(--muted-foreground)]">{formattedDate}</span>
              <span className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight text-[var(--ink)] mb-4">
              {article.title}
            </h1>

            {/* Subtitle */}
            {article.subtitle && (
              <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 leading-relaxed">
                {article.subtitle}
              </p>
            )}

            {/* Divider */}
            <div className="w-12 h-px bg-[var(--sage)]/40 mb-10" />

            {/* Content */}
            <MarkdownContent content={displayContent} />

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-[var(--line)]">
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
}
