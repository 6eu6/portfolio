'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import WriteArticleDialog from '@/components/blog/WriteArticleDialog';

// ── shadcn/ui imports ───────────────────────────────────────────
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ── Lucide icons ────────────────────────────────────────────────
import {
  ArrowLeft,
  PenSquare,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ChevronUp,
  ChevronDown,
  Plus,
  Mail,
  MailOpen,
  ExternalLink,
  Edit3,
  Save,
  X,
  Lock,
  ShieldCheck,
  FileText,
  FolderOpen,
  Link2,
  MessageSquare,
  Loader2,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Dribbble,
  Figma,
  Layers,
} from 'lucide-react';

// ── Constants ───────────────────────────────────────────────────
const API_BASE = '/api';
const PORT_QUERY = 'XTransformPort=3000';
const ADMIN_PASSWORD = 'admin123';

const CATEGORIES = ['Product', 'AI', 'Engineering', 'Design', 'System Architecture'];
const PROJECT_STATUSES = ['In Progress', 'Completed', 'On Hold', 'Archived'];

// ── Types ───────────────────────────────────────────────────────
interface Article {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  readTime: string;
  tags: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Project {
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
  liveUrl: string;
  sourceUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface SocialLink {
  id: string;
  name: string;
  description: string;
  metric: string;
  metricLabel: string;
  url: string;
  icon: string;
  color: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface ProjectFormData {
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
  liveUrl: string;
  sourceUrl: string;
  sortOrder: number;
}

const emptyProjectForm: ProjectFormData = {
  title: '',
  subtitle: '',
  category: '',
  description: '',
  longDescription: '',
  tags: '[]',
  year: new Date().getFullYear().toString(),
  status: 'In Progress',
  metric: '',
  role: '',
  team: '',
  duration: '',
  problem: '',
  solution: '',
  features: '[]',
  outcomes: '[]',
  lessons: '',
  liveUrl: '#',
  sourceUrl: '#',
  sortOrder: 0,
};

// ── Helper: API fetch wrapper ──────────────────────────────────
async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API_BASE}${path}${path.includes('?') ? '&' : '?'}${PORT_QUERY}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

// ── Helper: Social icon component ───────────────────────────────
function SocialIcon({ icon, className }: { icon: string; className?: string }) {
  const props = { className };
  switch (icon.toLowerCase()) {
    case 'globe':
    case 'website':
      return <Globe {...props} />;
    case 'github':
      return <Github {...props} />;
    case 'twitter':
    case 'x':
      return <Twitter {...props} />;
    case 'linkedin':
      return <Linkedin {...props} />;
    case 'youtube':
      return <Youtube {...props} />;
    case 'dribbble':
      return <Dribbble {...props} />;
    case 'figma':
      return <Figma {...props} />;
    case 'layers':
    default:
      return <Layers {...props} />;
  }
}

// ── Helper: format date ─────────────────────────────────────────
function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function AdminPage() {
  // ── Auth state ─────────────────────────────────────────────────
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // ── Tab state ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('articles');

  // ── Articles state ────────────────────────────────────────────
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);

  // ── Projects state ────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(emptyProjectForm);
  const [projectSaving, setProjectSaving] = useState(false);

  // ── Social Links state ────────────────────────────────────────
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [socialsLoading, setSocialsLoading] = useState(false);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [socialForm, setSocialForm] = useState<Partial<SocialLink>>({});
  const [socialSaving, setSocialSaving] = useState(false);

  // ── Messages state ────────────────────────────────────────────
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [expandedMessage, setExpandedMessage] = useState<number | null>(null);

  // ── Delete confirmation dialog ──────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: 'article' | 'project' | 'social' | 'message';
    id: string | number;
    title: string;
  }>({ open: false, type: 'article', id: '', title: '' });

  // ═══════════════════════════════════════════════════════════════
  // DATA FETCHING
  // ═══════════════════════════════════════════════════════════════
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const data = await apiFetch('/articles?all=true');
      setArticles(data);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const data = await apiFetch('/projects');
      setProjects(data);
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchSocials = useCallback(async () => {
    setSocialsLoading(true);
    try {
      const data = await apiFetch('/socials');
      setSocials(data);
    } catch {
      toast.error('Failed to load social links');
    } finally {
      setSocialsLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const data = await apiFetch('/contacts');
      setMessages(data);
    } catch {
      toast.error('Failed to load messages');
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Fetch on auth & tab change
  useEffect(() => {
    if (!authenticated) return;
    if (activeTab === 'articles') fetchArticles();
    else if (activeTab === 'projects') fetchProjects();
    else if (activeTab === 'socials') fetchSocials();
    else if (activeTab === 'messages') fetchMessages();
  }, [authenticated, activeTab, fetchArticles, fetchProjects, fetchSocials, fetchMessages]);

  // ═══════════════════════════════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════════════════════════════
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
      toast.success('Welcome back');
    } else {
      toast.error('Incorrect password');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ARTICLES ACTIONS
  // ═══════════════════════════════════════════════════════════════
  const toggleArticlePublished = async (article: Article) => {
    try {
      await apiFetch(`/articles/${article.id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !article.published }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, published: !a.published } : a))
      );
      toast.success(article.published ? 'Article unpublished' : 'Article published');
    } catch {
      toast.error('Failed to update article');
    }
  };

  const toggleArticleFeatured = async (article: Article) => {
    try {
      await apiFetch(`/articles/${article.id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !article.featured }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, featured: !a.featured } : a))
      );
      toast.success(article.featured ? 'Unfeatured' : 'Marked as featured');
    } catch {
      toast.error('Failed to update article');
    }
  };

  const deleteArticle = async (id: number) => {
    try {
      await apiFetch(`/articles/${id}`, { method: 'DELETE' });
      setArticles((prev) => prev.filter((a) => a.id !== id));
      toast.success('Article deleted');
    } catch {
      toast.error('Failed to delete article');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // PROJECTS ACTIONS
  // ═══════════════════════════════════════════════════════════════
  const openProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        subtitle: project.subtitle,
        category: project.category,
        description: project.description,
        longDescription: project.longDescription,
        tags: project.tags,
        year: project.year,
        status: project.status,
        metric: project.metric,
        role: project.role,
        team: project.team,
        duration: project.duration,
        problem: project.problem,
        solution: project.solution,
        features: project.features,
        outcomes: project.outcomes,
        lessons: project.lessons,
        liveUrl: project.liveUrl,
        sourceUrl: project.sourceUrl,
        sortOrder: project.sortOrder,
      });
    } else {
      setEditingProject(null);
      setProjectForm({ ...emptyProjectForm });
    }
    setProjectDialogOpen(true);
  };

  const saveProject = async () => {
    if (!projectForm.title || !projectForm.category || !projectForm.description) {
      toast.error('Title, category, and description are required');
      return;
    }
    setProjectSaving(true);
    try {
      if (editingProject) {
        await apiFetch(`/projects/${editingProject.id}`, {
          method: 'PUT',
          body: JSON.stringify(projectForm),
        });
        toast.success('Project updated');
      } else {
        await apiFetch('/projects', {
          method: 'POST',
          body: JSON.stringify(projectForm),
        });
        toast.success('Project created');
      }
      setProjectDialogOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setProjectSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await apiFetch(`/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  const moveProject = async (project: Project, direction: 'up' | 'down') => {
    const sorted = [...projects].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((p) => p.id === project.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    try {
      await apiFetch(`/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ sortOrder: other.sortOrder }),
      });
      await apiFetch(`/projects/${other.id}`, {
        method: 'PUT',
        body: JSON.stringify({ sortOrder: project.sortOrder }),
      });
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === project.id) return { ...p, sortOrder: other.sortOrder };
          if (p.id === other.id) return { ...p, sortOrder: project.sortOrder };
          return p;
        })
      );
      toast.success('Order updated');
    } catch {
      toast.error('Failed to reorder');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL LINKS ACTIONS
  // ═══════════════════════════════════════════════════════════════
  const startEditSocial = (social: SocialLink) => {
    setEditingSocialId(social.id);
    setSocialForm({ ...social });
  };

  const cancelEditSocial = () => {
    setEditingSocialId(null);
    setSocialForm({});
  };

  const saveSocial = async (id: string) => {
    setSocialSaving(true);
    try {
      await apiFetch(`/socials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(socialForm),
      });
      setSocials((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...socialForm } as SocialLink : s))
      );
      setEditingSocialId(null);
      setSocialForm({});
      toast.success('Social link updated');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setSocialSaving(false);
    }
  };

  const deleteSocial = async (id: string) => {
    try {
      await apiFetch(`/socials/${id}`, { method: 'DELETE' });
      setSocials((prev) => prev.filter((s) => s.id !== id));
      toast.success('Social link deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // MESSAGES ACTIONS
  // ═══════════════════════════════════════════════════════════════
  const toggleMessageRead = async (msg: ContactMessage) => {
    try {
      await apiFetch(`/contacts/${msg.id}`, { method: 'PUT' });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m))
      );
    } catch {
      toast.error('Failed to update message');
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // DELETE CONFIRM HANDLER
  // ═══════════════════════════════════════════════════════════════
  const handleConfirmDelete = () => {
    const { type, id } = deleteConfirm;
    if (type === 'article') deleteArticle(id as number);
    else if (type === 'project') deleteProject(id as string);
    else if (type === 'social') deleteSocial(id as string);
    else if (type === 'message') deleteMessage(id as number);
    setDeleteConfirm({ ...deleteConfirm, open: false });
  };

  // ═══════════════════════════════════════════════════════════════
  // PASSWORD GATE
  // ═══════════════════════════════════════════════════════════════
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="w-full max-w-sm mx-auto p-6">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-[var(--ink)] flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-xl font-semibold text-[var(--ink)]">Admin Panel</h1>
              <p className="text-sm text-[var(--muted-foreground)]">Enter password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-xs font-medium tracking-[0.1em] uppercase text-[var(--muted-foreground)]">
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="h-11 border-[var(--line)]"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white font-medium">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </form>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--ink)] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-semibold text-[var(--ink)]">Admin</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to site</span>
          </Link>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-[var(--paper-2)] border border-[var(--line)]">
            <TabsTrigger value="articles" className="gap-1.5 data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-1.5 data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
              <FolderOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="socials" className="gap-1.5 data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
              <Link2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Social Links</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5 data-[state=active]:bg-[var(--ink)] data-[state=active]:text-white">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Messages</span>
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="ml-1 w-2 h-2 rounded-full bg-[var(--rose)]" />
              )}
            </TabsTrigger>
          </TabsList>

          {/* ═══════════════════════════════════════════════════ */}
          {/* ARTICLES TAB                                      */}
          {/* ═══════════════════════════════════════════════════ */}
          <TabsContent value="articles">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--ink)]">Articles</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{articles.length} total</p>
              </div>
              <Button
                onClick={() => setWriteDialogOpen(true)}
                className="gap-2 bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white"
                size="sm"
              >
                <PenSquare className="w-4 h-4" />
                Write Article
              </Button>
            </div>

            {articlesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg bg-[var(--paper-2)]" />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-lg">
                <FileText className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No articles yet. Write your first one!</p>
              </div>
            ) : (
              <div className="border border-[var(--line)] rounded-lg overflow-hidden">
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[var(--line)] bg-[var(--paper-2)]">
                        <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Title</th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Category</th>
                        <th className="text-center px-4 py-3 font-medium text-[var(--muted-foreground)]">Status</th>
                        <th className="text-center px-4 py-3 font-medium text-[var(--muted-foreground)]">Featured</th>
                        <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)]">Date</th>
                        <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article) => (
                        <tr key={article.id} className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--paper-2)]/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-medium text-[var(--ink)]">{article.title}</div>
                            {article.subtitle && (
                              <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{article.subtitle}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="secondary" className="text-xs">{article.category || '—'}</Badge>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleArticlePublished(article)}
                              className="inline-flex items-center gap-1.5"
                              title={article.published ? 'Unpublish' : 'Publish'}
                            >
                              <Switch checked={article.published} onCheckedChange={() => toggleArticlePublished(article)} />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleArticleFeatured(article)}
                              className="p-1 rounded hover:bg-[var(--paper-2)] transition-colors"
                              title={article.featured ? 'Unfeature' : 'Feature'}
                            >
                              {article.featured ? (
                                <Star className="w-4 h-4 text-[var(--sand)] fill-[var(--sand)]" />
                              ) : (
                                <StarOff className="w-4 h-4 text-[var(--muted-foreground)]" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-[var(--muted-foreground)] text-xs">
                            {formatDate(article.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[var(--muted-foreground)] hover:text-[var(--rose)] h-8 w-8 p-0"
                              onClick={() =>
                                setDeleteConfirm({
                                  open: true,
                                  type: 'article',
                                  id: article.id,
                                  title: article.title,
                                })
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-[var(--line)]">
                  {articles.map((article) => (
                    <div key={article.id} className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-[var(--ink)]">{article.title}</div>
                          <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{formatDate(article.createdAt)}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleArticleFeatured(article)}
                            className="p-1.5 rounded hover:bg-[var(--paper-2)] transition-colors"
                          >
                            {article.featured ? (
                              <Star className="w-4 h-4 text-[var(--sand)] fill-[var(--sand)]" />
                            ) : (
                              <StarOff className="w-4 h-4 text-[var(--muted-foreground)]" />
                            )}
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[var(--muted-foreground)] hover:text-[var(--rose)] h-8 w-8 p-0"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'article',
                                id: article.id,
                                title: article.title,
                              })
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{article.category || '—'}</Badge>
                        <div className="flex items-center gap-1.5 ml-auto">
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                          <Switch
                            checked={article.published}
                            onCheckedChange={() => toggleArticlePublished(article)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════ */}
          {/* PROJECTS TAB                                      */}
          {/* ═══════════════════════════════════════════════════ */}
          <TabsContent value="projects">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--ink)]">Projects</h2>
                <p className="text-sm text-[var(--muted-foreground)]">{projects.length} total</p>
              </div>
              <Button
                onClick={() => openProjectDialog()}
                className="gap-2 bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </Button>
            </div>

            {projectsLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 w-full rounded-lg bg-[var(--paper-2)]" />
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-lg">
                <FolderOpen className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No projects yet. Add your first one!</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((project, idx) => (
                    <div
                      key={project.id}
                      className="border border-[var(--line)] rounded-lg p-4 bg-[var(--paper)] hover:bg-[var(--paper-2)]/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <h3 className="font-medium text-[var(--ink)] truncate">{project.title}</h3>
                          {project.subtitle && (
                            <p className="text-xs text-[var(--muted-foreground)] truncate">{project.subtitle}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs shrink-0">
                          {project.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="outline" className="text-xs">{project.category}</Badge>
                        {project.metric && (
                          <span className="text-xs text-[var(--muted-foreground)]">{project.metric}</span>
                        )}
                        <span className="text-xs text-[var(--muted-foreground)]">{project.year}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                            disabled={idx === 0}
                            onClick={() => moveProject(project, 'up')}
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                            disabled={idx === projects.length - 1}
                            onClick={() => moveProject(project, 'down')}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                            onClick={() => openProjectDialog(project)}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-[var(--muted-foreground)] hover:text-[var(--rose)]"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'project',
                                id: project.id,
                                title: project.title,
                              })
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════ */}
          {/* SOCIAL LINKS TAB                                   */}
          {/* ═══════════════════════════════════════════════════ */}
          <TabsContent value="socials">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Social Links</h2>
              <p className="text-sm text-[var(--muted-foreground)]">{socials.length} links</p>
            </div>

            {socialsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg bg-[var(--paper-2)]" />
                ))}
              </div>
            ) : socials.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-lg">
                <Link2 className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No social links yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {socials.map((social) => (
                  <div
                    key={social.id}
                    className="border border-[var(--line)] rounded-lg p-4 bg-[var(--paper)] hover:bg-[var(--paper-2)]/50 transition-colors"
                  >
                    {editingSocialId === social.id ? (
                      /* ── Edit mode ──────────────────────── */
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">Name</Label>
                            <Input
                              value={socialForm.name || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, name: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">Icon</Label>
                            <Input
                              value={socialForm.icon || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">URL</Label>
                            <Input
                              value={socialForm.url || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">Metric</Label>
                            <Input
                              value={socialForm.metric || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, metric: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">Metric Label</Label>
                            <Input
                              value={socialForm.metricLabel || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, metricLabel: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-[var(--muted-foreground)]">Color</Label>
                            <Input
                              value={socialForm.color || ''}
                              onChange={(e) => setSocialForm({ ...socialForm, color: e.target.value })}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-[var(--muted-foreground)]">Description</Label>
                          <Input
                            value={socialForm.description || ''}
                            onChange={(e) => setSocialForm({ ...socialForm, description: e.target.value })}
                            className="h-9 text-sm"
                          />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={cancelEditSocial} className="h-8">
                            <X className="w-3.5 h-3.5 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => saveSocial(social.id)}
                            disabled={socialSaving}
                            className="h-8 bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white"
                          >
                            {socialSaving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Save className="w-3.5 h-3.5 mr-1" />
                            )}
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* ── View mode ───────────────────────── */
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: social.color + '18', color: social.color }}
                        >
                          <SocialIcon icon={social.icon} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--ink)]">{social.name}</span>
                            {social.metric && (
                              <Badge variant="secondary" className="text-xs">
                                {social.metric} {social.metricLabel}
                              </Badge>
                            )}
                          </div>
                          {social.description && (
                            <p className="text-xs text-[var(--muted-foreground)] truncate">{social.description}</p>
                          )}
                          <p className="text-xs text-[var(--sky)] truncate mt-0.5">{social.url}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-[var(--paper-2)] text-[var(--muted-foreground)] hover:text-[var(--ink)] transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                            onClick={() => startEditSocial(social)}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[var(--muted-foreground)] hover:text-[var(--rose)]"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: 'social',
                                id: social.id,
                                title: social.name,
                              })
                            }
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* ═══════════════════════════════════════════════════ */}
          {/* MESSAGES TAB                                      */}
          {/* ═══════════════════════════════════════════════════ */}
          <TabsContent value="messages">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[var(--ink)]">Messages</h2>
              <p className="text-sm text-[var(--muted-foreground)]">
                {messages.length} total · {messages.filter((m) => !m.read).length} unread
              </p>
            </div>

            {messagesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg bg-[var(--paper-2)]" />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-lg">
                <MessageSquare className="w-10 h-10 text-[var(--muted-foreground)] mx-auto mb-3" />
                <p className="text-sm text-[var(--muted-foreground)]">No messages yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`border border-[var(--line)] rounded-lg transition-colors ${
                      msg.read ? 'bg-[var(--paper)]' : 'bg-[var(--paper-2)]/60 border-[var(--sage)]/30'
                    }`}
                  >
                    <div
                      className="flex items-start gap-3 p-4 cursor-pointer"
                      onClick={() => {
                        if (expandedMessage === msg.id) {
                          setExpandedMessage(null);
                        } else {
                          setExpandedMessage(msg.id);
                          if (!msg.read) toggleMessageRead(msg);
                        }
                      }}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-[var(--paper-2)]">
                        {msg.read ? (
                          <MailOpen className="w-4 h-4 text-[var(--muted-foreground)]" />
                        ) : (
                          <Mail className="w-4 h-4 text-[var(--sage)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`font-medium text-sm ${msg.read ? 'text-[var(--ink)]' : 'text-[var(--ink)]'}`}>
                              {msg.name}
                            </span>
                            <span className="text-xs text-[var(--muted-foreground)] truncate">{msg.email}</span>
                            {!msg.read && (
                              <Badge className="text-[10px] px-1.5 py-0 bg-[var(--sage)] text-white hover:bg-[var(--sage)]">
                                New
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)] shrink-0">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm ${msg.read ? 'text-[var(--muted-foreground)]' : 'text-[var(--ink)]/80'}`}>
                          {expandedMessage === msg.id
                            ? msg.message
                            : msg.message.length > 120
                              ? msg.message.slice(0, 120) + '...'
                              : msg.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-1 px-4 pb-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[var(--muted-foreground)] hover:text-[var(--ink)]"
                        onClick={() => toggleMessageRead(msg)}
                      >
                        {msg.read ? (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            Mark unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="w-3 h-3 mr-1" />
                            Mark read
                          </>
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-[var(--muted-foreground)] hover:text-[var(--rose)]"
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: 'message',
                            id: msg.id,
                            title: `Message from ${msg.name}`,
                          })
                        }
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          WRITE ARTICLE DIALOG
          ═══════════════════════════════════════════════════════════ */}
      <WriteArticleDialog
        open={writeDialogOpen}
        onClose={() => setWriteDialogOpen(false)}
        onPublished={fetchArticles}
      />

      {/* ═══════════════════════════════════════════════════════════
          PROJECT DIALOG
          ═══════════════════════════════════════════════════════════ */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--paper)] border-[var(--line)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--ink)]">
              {editingProject ? 'Edit Project' : 'New Project'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Title *</Label>
                <Input
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Subtitle</Label>
                <Input
                  value={projectForm.subtitle}
                  onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Category *</Label>
                <Select
                  value={projectForm.category}
                  onValueChange={(v) => setProjectForm({ ...projectForm, category: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Status</Label>
                <Select
                  value={projectForm.status}
                  onValueChange={(v) => setProjectForm({ ...projectForm, status: v })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Year</Label>
                <Input
                  value={projectForm.year}
                  onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Description *</Label>
              <Textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            {/* Long Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Long Description</Label>
              <Textarea
                value={projectForm.longDescription}
                onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
                className="min-h-[120px]"
              />
            </div>

            <Separator className="bg-[var(--line)]" />

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Metric</Label>
                <Input
                  value={projectForm.metric}
                  onChange={(e) => setProjectForm({ ...projectForm, metric: e.target.value })}
                  className="h-9"
                  placeholder="e.g. 10K users"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Role</Label>
                <Input
                  value={projectForm.role}
                  onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Team</Label>
                <Input
                  value={projectForm.team}
                  onChange={(e) => setProjectForm({ ...projectForm, team: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Duration</Label>
                <Input
                  value={projectForm.duration}
                  onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                  className="h-9"
                  placeholder="e.g. 3 months"
                />
              </div>
            </div>

            {/* Problem / Solution */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Problem</Label>
              <Textarea
                value={projectForm.problem}
                onChange={(e) => setProjectForm({ ...projectForm, problem: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Solution</Label>
              <Textarea
                value={projectForm.solution}
                onChange={(e) => setProjectForm({ ...projectForm, solution: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            {/* Tags / Features / Outcomes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Tags (JSON)</Label>
                <Input
                  value={projectForm.tags}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="h-9 font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Features (JSON)</Label>
                <Input
                  value={projectForm.features}
                  onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                  className="h-9 font-mono text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Outcomes (JSON)</Label>
                <Input
                  value={projectForm.outcomes}
                  onChange={(e) => setProjectForm({ ...projectForm, outcomes: e.target.value })}
                  className="h-9 font-mono text-xs"
                />
              </div>
            </div>

            {/* Lessons */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Lessons Learned</Label>
              <Textarea
                value={projectForm.lessons}
                onChange={(e) => setProjectForm({ ...projectForm, lessons: e.target.value })}
                className="min-h-[80px]"
              />
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Live URL</Label>
                <Input
                  value={projectForm.liveUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--muted-foreground)]">Source URL</Label>
                <Input
                  value={projectForm.sourceUrl}
                  onChange={(e) => setProjectForm({ ...projectForm, sourceUrl: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-[var(--muted-foreground)]">Sort Order</Label>
              <Input
                type="number"
                value={projectForm.sortOrder}
                onChange={(e) => setProjectForm({ ...projectForm, sortOrder: parseInt(e.target.value) || 0 })}
                className="h-9 w-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setProjectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveProject}
              disabled={projectSaving || !projectForm.title || !projectForm.category || !projectForm.description}
              className="bg-[var(--ink)] hover:bg-[var(--ink)]/90 text-white"
            >
              {projectSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════
          DELETE CONFIRM DIALOG
          ═══════════════════════════════════════════════════════════ */}
      <Dialog open={deleteConfirm.open} onOpenChange={(v) => setDeleteConfirm({ ...deleteConfirm, open: v })}>
        <DialogContent className="max-w-sm bg-[var(--paper)] border-[var(--line)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--ink)]">Delete {deleteConfirm.title}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[var(--muted-foreground)]">
            This action cannot be undone. The item will be permanently removed.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm({ ...deleteConfirm, open: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
