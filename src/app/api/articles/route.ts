import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/articles — list articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const articles = await db.article.findMany({
      where: showAll ? {} : { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        category: true,
        excerpt: true,
        readTime: true,
        tags: true,
        featured: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/articles — create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { title, subtitle, content, category, excerpt, readTime, featured, published, tags } = body;

    if (!title || !subtitle || !content || !excerpt) {
      return NextResponse.json(
        { error: "Missing required fields: title, subtitle, content, excerpt" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Check for duplicate slug
    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "An article with a similar title already exists" },
        { status: 409 }
      );
    }

    const article = await db.article.create({
      data: {
        slug,
        title,
        subtitle,
        content,
        category: category ?? "Product",
        excerpt,
        readTime: readTime ?? "5 min",
        featured: featured ?? false,
        published: published ?? true,
        tags: tags ?? "[]",
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
