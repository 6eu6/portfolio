export interface Article {
  id: number; slug: string; title: string; subtitle: string; category: string;
  excerpt: string; date: string; readTime: string; featured: boolean; tags: string[];
}

export interface ArticleSection {
  type: "paragraph" | "heading" | "quote" | "code" | "list";
  content: string; items?: string[];
}

export const articles: Article[] = [
  { id: 0, slug: "building-ai-systems-people-trust", title: "Building AI Systems That People Trust", subtitle: "Principles for reliable AI products", category: "AI", excerpt: "Principles for reliable AI products: transparency, evaluation, guardrails, and human control.", date: "2024-11-15", readTime: "6 min", featured: false, tags: ["AI", "Trust", "Product"] },
  { id: 1, slug: "from-idea-to-mvp", title: "From Idea to MVP: A Practical Playbook", subtitle: "A field guide for validating and shipping fast", category: "Product", excerpt: "A field guide for validating ideas, prioritising scope, shipping fast, and learning without noise.", date: "2024-10-22", readTime: "10 min", featured: true, tags: ["Product", "MVP", "Strategy"] },
  { id: 2, slug: "designing-developer-experiences", title: "Designing Developer Experiences That Scale", subtitle: "How APIs, docs, and feedback loops become the product", category: "Engineering", excerpt: "How APIs, docs, examples, and feedback loops become the product for developers.", date: "2024-09-18", readTime: "8 min", featured: false, tags: ["Engineering", "DX", "API"] },
  { id: 3, slug: "rag-systems-deep-dive", title: "RAG Systems Deep Dive", subtitle: "Chunks, embeddings, retrieval quality, and practical patterns", category: "AI", excerpt: "Chunks, embeddings, retrieval quality, reranking, evals, and practical product patterns.", date: "2024-08-30", readTime: "9 min", featured: false, tags: ["AI", "RAG", "Engineering"] },
  { id: 4, slug: "writing-better-prds", title: "Writing Better PRDs", subtitle: "A template for outcome-driven product requirements", category: "Product", excerpt: "A simple template for outcome-driven product requirements and clearer execution.", date: "2024-07-14", readTime: "4 min", featured: false, tags: ["Product", "Writing", "Strategy"] },
  { id: 5, slug: "system-design-monolith-to-modular", title: "System Design: Monolith to Modular", subtitle: "How to evolve systems without killing momentum", category: "Engineering", excerpt: "How to move toward modular systems without killing momentum or creating chaos.", date: "2024-06-05", readTime: "7 min", featured: false, tags: ["Engineering", "Architecture", "Systems"] }
];

export function getFeaturedArticle() { return articles.find(a => a.featured); }
