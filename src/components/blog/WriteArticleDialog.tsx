'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Send, Sparkles, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = ['Product', 'AI', 'Engineering', 'Design', 'System Architecture'] as const;

interface WriteArticleDialogProps {
  open: boolean;
  onClose: () => void;
  onPublished: () => void;
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
}

export default function WriteArticleDialog({ open, onClose, onPublished }: WriteArticleDialogProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const readTime = estimateReadTime(content);
  const tags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
  const generatedExcerpt = excerpt || (content.trim().length > 0 ? content.trim().slice(0, 180).trim() + (content.length > 180 ? '…' : '') : '');

  const isValid = title.trim() !== '' && category !== '' && content.trim().length > 10;

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setCategory('');
    setContent('');
    setTagsInput('');
    setExcerpt('');
    setFeatured(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePublish = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content.trim(),
        category,
        excerpt: generatedExcerpt,
        readTime,
        featured,
        published: true,
        tags,
      };

      const res = await fetch('/api/articles?XTransformPort=3000', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to publish article');

      toast.success('Article published!', {
        description: `"${title.trim()}" is now live.`,
      });

      resetForm();
      onClose();
      onPublished();
    } catch {
      toast.error('Publishing failed', {
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
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
        <DialogTitle className="sr-only">Write Article</DialogTitle>

        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between w-full px-6 py-4 border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[var(--sage)]" />
            <h2 className="text-sm font-semibold text-[var(--ink)]">Write Article</h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:text-[var(--ink)] hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto w-full flex justify-center">
          <div className="w-full max-w-[700px] px-6 py-10 space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="article-title" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                Title
              </label>
              <Input
                id="article-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your article a title…"
                className="text-2xl md:text-3xl font-bold border-0 border-b rounded-none px-0 pb-2 text-[var(--ink)] placeholder:text-[var(--muted-foreground)]/40 focus-visible:ring-0 h-auto"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <label htmlFor="article-subtitle" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                Subtitle
              </label>
              <Input
                id="article-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A brief description or tagline…"
                className="text-lg border-0 border-b rounded-none px-0 pb-2 text-[var(--ink)] placeholder:text-[var(--muted-foreground)]/40 focus-visible:ring-0 h-auto"
              />
            </div>

            {/* Category + Featured row */}
            <div className="flex flex-wrap items-end gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pick a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                  Featured
                </label>
                <div className="flex items-center gap-2">
                  <Switch checked={featured} onCheckedChange={setFeatured} />
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {featured ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="article-tags" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                Tags <span className="normal-case tracking-normal">(comma-separated)</span>
              </label>
              <Input
                id="article-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. AI, Product, Engineering"
                className="border-0 border-b rounded-none px-0 pb-2 text-[var(--ink)] placeholder:text-[var(--muted-foreground)]/40 focus-visible:ring-0 h-auto"
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="article-content" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                Content <span className="normal-case tracking-normal">(supports markdown)</span>
              </label>
              <Textarea
                id="article-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article here…&#10;&#10;You can use **bold**, *italic*, `code`, and more."
                className="min-h-[320px] resize-y font-mono text-sm leading-relaxed border border-[var(--line)] rounded-lg p-4 text-[var(--ink)] placeholder:text-[var(--muted-foreground)]/40"
              />
              <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                <span>{content.trim().split(/\s+/).filter(Boolean).length} words</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTime} read
                </span>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="article-excerpt" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                Excerpt <span className="normal-case tracking-normal">(optional — auto-generated if empty)</span>
              </label>
              <Textarea
                id="article-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A short summary for the article card…"
                className="min-h-[80px] resize-y text-sm border border-[var(--line)] rounded-lg p-4 text-[var(--ink)] placeholder:text-[var(--muted-foreground)]/40"
              />
            </div>

            {/* Publish button */}
            <div className="pt-4 border-t border-[var(--line)] flex items-center justify-between">
              <div />
              <Button
                onClick={handlePublish}
                disabled={!isValid || isSubmitting}
                className="gap-2 bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
