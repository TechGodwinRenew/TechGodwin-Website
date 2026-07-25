'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  difficulty: string;
  author: string;
  tags: string;
  readingTime: number;
  publishedAt: string;
  thumbnail?: string;
}

export default function BlogPostPage() {
  const { slug } = useParams() as { slug: string };
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-600 text-lg">{error || 'Article not found'}</p>
          <Link href="/blog" className="inline-block mt-4 text-blue-600 hover:text-blue-700">
            Return to Blog
          </Link>
        </div>
      </main>
    );
  }

  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {post.thumbnail && (
          <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-r from-blue-400 to-purple-400">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full capitalize">
              {post.difficulty}
            </span>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-gray-600 border-t border-b border-gray-200 py-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} minute read</span>
            </div>
            <div className="text-sm">
              Published {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose text-gray-800 mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-12 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?search=${tag}`}
                  className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Don't miss new articles
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter for weekly infrastructure insights and best practices.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>&copy; 2024 TechGodwin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
