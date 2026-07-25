'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Search, Filter } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  difficulty: string;
  readingTime: number;
  publishedAt: string;
  thumbnail?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const CATEGORIES = [
  'All',
  'System Administration',
  'Infrastructure',
  'Virtualization',
  'Cloud',
  'Tips & Tricks',
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          ...(selectedCategory && { category: selectedCategory }),
        });

        const response = await fetch(`/api/blog?${params}`);
        const data = await response.json();
        setPosts(data.posts);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategory, pagination.page]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            TechGodwin
          </Link>
          <div className="hidden md:flex gap-6 items-center text-sm">
            {['System Administration', 'Infrastructure', 'Virtualization', 'Cloud', 'Tips & Tricks'].map((topic) => (
              <Link
                key={topic}
                href={`/blog?category=${topic.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Knowledge Base</h1>
          <p className="text-xl text-blue-100">
            Expert articles on System Administration, Infrastructure, Virtualization, Cloud &amp; Tips
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-8 flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat === 'All' ? null : cat)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  (cat === 'All' && !selectedCategory) || selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading articles...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer h-full flex flex-col">
                    {post.thumbnail && (
                      <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-400 overflow-hidden">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.readingTime} min read
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-blue-600 font-medium text-sm hover:text-blue-700">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No articles found. Check back soon!</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.pages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>&copy; 2024 TechGodwin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
