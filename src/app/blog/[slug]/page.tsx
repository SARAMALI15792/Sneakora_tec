import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import prisma from "@/lib/db";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true }, select: { title: true, excerpt: true } });
  if (!post) return { title: "Post Not Found — Sneakora" };
  return { title: `${post.title} — Sneakora`, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });

  if (!post) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Post not found</h1>
          <p className="text-muted-foreground mt-2">The post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="inline-flex items-center gap-1.5 mt-4 text-sm text-accent hover:underline">
            <ArrowLeft className="size-3.5" /> Back to blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-dvh px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="size-3" /> Back to blog
        </Link>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(post.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        {post.image && (
          <div className="mt-8 rounded-xl overflow-hidden">
            <Image src={post.image} alt={post.title} width={1200} height={675} sizes="(max-width: 768px) 100vw, 672px" className="w-full aspect-video object-cover" />
          </div>
        )}
        <div className="mt-8 prose prose-sm dark:prose-invert max-w-none">
          {post.content.split("\n").map((paragraph, i) => (
            paragraph.trim() ? <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p> : null
          ))}
        </div>
      </div>
    </article>
  );
}