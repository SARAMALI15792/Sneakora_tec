import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, ChevronRight, FileText } from "lucide-react";
import { ShareButtons } from "@/components/blog/ShareButtons";
import prisma from "@/lib/db";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    select: { title: true, excerpt: true, image: true },
  });
  if (!post) return { title: "Post Not Found — Sneakora" };
  return {
    title: `${post.title} — Sneakora`,
    description: post.excerpt || undefined,
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/guide|how to|tips|101|choosing|breaking/i, "Guides & Tips"],
  [/trends|history|culture|season/i, "Culture & Trends"],
  [/top|best|picks|review/i, "Reviews & Picks"],
  [/care|maintenance|clean|wash|dry/i, "Care & Maintenance"],
  [/sustainable|eco|green|environment/i, "Sustainability"],
  [/style|outfit|fashion|wear/i, "Style & Fashion"],
];

function inferCategory(title: string): string {
  for (const [pattern, category] of CATEGORY_KEYWORDS) {
    if (pattern.test(title)) return category;
  }
  return "Stories";
}

function getReadingTime(content: string, excerpt: string | null): number {
  const text = content || excerpt || "";
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface TocItem {
  id: string;
  text: string;
}

function extractToc(content: string): TocItem[] {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => {
      const text = line.replace(/^#+\s*/, "");
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return { id, text };
    });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderContent(content: string): string {
  const lines = content.split("\n");
  const parts: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) { parts.push("</div>"); inList = false; }
      continue;
    }

    if (line.startsWith("## ")) {
      if (inList) { parts.push("</div>"); inList = false; }
      const text = line.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      parts.push(`<h2 id="${id}" class="text-xl font-bold mt-10 mb-4 tracking-tight">${text}</h2>`);
      continue;
    }

    if (line.startsWith("### ")) {
      if (inList) { parts.push("</div>"); inList = false; }
      const text = line.replace(/^###\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      parts.push(`<h3 id="${id}" class="text-lg font-semibold mt-8 mb-3 tracking-tight">${text}</h3>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      if (!inList) { parts.push('<div class="space-y-3 my-4">'); inList = true; }
      const num = line.match(/^\d+/)?.[0] || "";
      const item = line.replace(/^\d+\.\s+/, "");
      parts.push(
        `<div class="flex items-start gap-3"><span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent mt-0.5">${num}</span><p class="text-muted-foreground leading-relaxed">${item}</p></div>`
      );
      continue;
    }

    if (inList) { parts.push("</div>"); inList = false; }

    const withBold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    parts.push(`<p class="text-muted-foreground leading-relaxed mb-3">${withBold}</p>`);
  }

  if (inList) parts.push("</div>");
  return parts.join("\n");
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });

  if (!post) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto size-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6 ring-1 ring-border/20">
            <FileText className="size-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground mt-2">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/blog"
            className="group mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-border/30 bg-card/40 px-6 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-card/60 active:scale-[0.98]"
          >
            <ArrowLeft className="size-3" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const toc = extractToc(post.content);
  const readingTime = getReadingTime(post.content, post.excerpt);
  const category = inferCategory(post.title);

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      image: true,
      createdAt: true,
    },
  });

  const renderedContent = renderContent(post.content);

  return (
    <article className="min-h-dvh px-4 sm:px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-4xl">
        {/* ── Back Link ── */}
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-0.5" />
          Back to Blog
        </Link>

        {/* ── Header ── */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2.5 text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
              {category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {readingTime} min read
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* ── Featured Image ── */}
        {post.image && (
          <div className="relative mb-12 rounded-2xl overflow-hidden bg-muted/30">
            <div className="aspect-[2/1] sm:aspect-[2.4/1] relative">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-background/10 to-transparent" />
            </div>
          </div>
        )}

        {/* ── Content + TOC Layout ── */}
        <div className="grid gap-10 lg:grid-cols-[1fr_220px] lg:gap-12">
          {/* Main Content */}
          <div className="min-w-0">
            {/* Author Card */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/20 mb-8">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                ST
              </div>
              <div>
                <p className="text-sm font-semibold">Sneakora Team</p>
                <p className="text-xs text-muted-foreground">Staff Writer</p>
              </div>
            </div>

            {/* Rendered Content */}
            <div className="prose-custom space-y-4" dangerouslySetInnerHTML={{ __html: renderedContent }} />

            {/* Share Section */}
            <div className="mt-12 pt-6 border-t border-border/20 flex flex-wrap items-center justify-between gap-4">
              <ShareButtons title={post.title} slug={post.slug} />
              <Link
                href="/blog"
                className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3" />
                Back to all articles
              </Link>
            </div>
          </div>

          {/* ── TOC Sidebar ── */}
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <h4 className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-semibold mb-4">
                  On this page
                </h4>
                <nav className="space-y-2.5">
                  {toc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="group flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="size-3 mt-0.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      <span className="leading-relaxed">{item.text}</span>
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* ── Related Posts ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border/20">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border/20 bg-card/30 hover:bg-card/50 hover:border-accent/20 transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                    {related.image ? (
                      <Image
                        src={related.image}
                        alt={related.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="size-10 text-foreground/10" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                      {formatDate(related.createdAt)}
                    </p>
                    <h3 className="text-sm font-semibold leading-snug group-hover:text-accent transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    {related.excerpt && (
                      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 flex-1">
                        {related.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
