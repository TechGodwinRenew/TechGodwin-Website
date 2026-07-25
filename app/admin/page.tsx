'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Eye, PlusCircle, Users, TrendingUp } from 'lucide-react';

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalPosts: 0, publishedPosts: 0, draftPosts: 0, subscribers: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, subsRes] = await Promise.all([
          fetch('/api/admin/posts'),
          fetch('/api/admin/subscribers'),
        ]);
        const postsData = await postsRes.json();
        const subsData = await subsRes.json();

        const posts = postsData.posts || [];
        setRecentPosts(posts.slice(0, 5));
        setStats({
          totalPosts: posts.length,
          publishedPosts: posts.filter((p: any) => p.published).length,
          draftPosts: posts.filter((p: any) => !p.published).length,
          subscribers: subsData.total || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Posts', value: stats.totalPosts, icon: FileText, color: 'bg-blue-500', href: '/admin/posts' },
    { label: 'Published', value: stats.publishedPosts, icon: Eye, color: 'bg-green-500', href: '/admin/posts?filter=published' },
    { label: 'Drafts', value: stats.draftPosts, icon: TrendingUp, color: 'bg-yellow-500', href: '/admin/posts?filter=draft' },
    { label: 'Subscribers', value: stats.subscribers, icon: Users, color: 'bg-purple-500', href: '/admin/subscribers' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{loading ? '—' : card.value}</div>
              <div className="text-sm text-gray-500 mt-1">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
          <Link href="/admin/posts" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : recentPosts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-400 text-sm">
              No posts yet.{' '}
              <Link href="/admin/posts/new" className="text-blue-600 hover:underline">Create your first post</Link>
            </div>
          ) : (
            recentPosts.map((post) => (
              <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{post.category} • {new Date(post.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-blue-600 hover:underline">Edit</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
