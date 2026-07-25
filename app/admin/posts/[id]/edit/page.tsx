'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['System Administration', 'Infrastructure', 'Virtualization', 'Cloud', 'Tips & Tricks'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/posts/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); });
  }, [params.id]);

  const set = (field: string, value: any) => setForm((f: any) => ({ ...f, [field]: value }));

  const handleSave = async (publish?: boolean) => {
    setSaving(true);
    const body = publish !== undefined ? { ...form, published: publish } : form;
    const res = await fetch(`/api/admin/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (res.ok) router.push('/admin/posts');
    else alert('Failed to save');
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post permanently?')) return;
    await fetch(`/api/admin/posts/${params.id}`, { method: 'DELETE' });
    router.push('/admin/posts');
  };

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>;
  if (!form) return <div className="text-red-500 text-sm">Post not found.</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            <p className="text-gray-500 text-sm line-clamp-1">{form.title}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50 transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
              <textarea
                value={form.content}
                onChange={(e) => set('content', e.target.value)}
                rows={18}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <p className="text-xs text-gray-400 mt-1">HTML tags are supported</p>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Status: <span className={form.published ? 'text-green-600' : 'text-yellow-600'}>
                {form.published ? 'Published' : 'Draft'}
              </span>
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleSave()}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => handleSave(!form.published)}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                <Eye className="w-4 h-4" />
                {form.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>

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
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set('tags', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Thumbnail URL</label>
              <input
                type="text"
                value={form.thumbnail || ''}
                onChange={(e) => set('thumbnail', e.target.value)}
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
