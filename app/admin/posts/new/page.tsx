'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['System Administration', 'Infrastructure', 'Virtualization', 'Cloud', 'Tips & Tricks'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'System Administration',
    difficulty: 'intermediate',
    author: 'TechGodwin',
    tags: '',
    thumbnail: '',
    featured: false,
    published: false,
  });

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((f) => ({ ...f, title, slug: generateSlug(title) }));
  };

  const set = (field: string, value: any) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (publish: boolean) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, published: publish }),
      });
      if (res.ok) {
        router.push('/admin/posts');
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save post');
      }
    } catch {
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/posts" className="text-gray-400 hover:text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
          <p className="text-gray-500 text-sm">Create a new blog article</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="Enter post title..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt *</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="Brief summary of the post..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                placeholder="Write your article content here (HTML supported)..."
                rows={18}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">HTML tags are supported (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;code&gt;)</p>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-5">
          {/* Publish Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                <Eye className="w-4 h-4" />
                Publish Now
              </button>
            </div>
          </div>

          {/* Category & Details */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Post Details</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => set('difficulty', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {DIFFICULTIES.map((d) => <option key={d} className="capitalize">{d}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                placeholder="linux, networking, azure"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail}
                onChange={(e) => set('thumbnail', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700">Featured post</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
