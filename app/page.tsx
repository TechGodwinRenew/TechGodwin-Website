'use client';

import Link from 'next/link';
import { BookOpen, Zap, Users, Lightbulb, Server, Cloud, Monitor } from 'lucide-react';

const TOPICS = [
  { label: 'System Administration', slug: 'system-administration' },
  { label: 'Infrastructure', slug: 'infrastructure' },
  { label: 'Virtualization', slug: 'virtualization' },
  { label: 'Cloud', slug: 'cloud' },
  { label: 'Tips & Tricks', slug: 'tips-and-tricks' },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">TechGodwin</div>
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">Blog</Link>
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                href={`/blog?category=${topic.slug}`}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {topic.label}
              </Link>
            ))}
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            Master IT Infrastructure & Cloud Architecture
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Expert knowledge on System Administration, Infrastructure, Virtualization, Cloud, and practical Tips & Tricks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/blog"
              className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition"
            >
              Read Articles
            </Link>
            <Link
              href="/blog?category=tips-and-tricks"
              className="inline-block px-8 py-4 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Tips & Tricks
            </Link>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">Browse by Topic</h2>
          <p className="text-center text-gray-500 mb-12">Dive into the areas that matter most to your IT career</p>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Monitor, label: 'System Administration', slug: 'system-administration', color: 'bg-blue-50 text-blue-600' },
              { icon: Server, label: 'Infrastructure', slug: 'infrastructure', color: 'bg-purple-50 text-purple-600' },
              { icon: Zap, label: 'Virtualization', slug: 'virtualization', color: 'bg-green-50 text-green-600' },
              { icon: Cloud, label: 'Cloud', slug: 'cloud', color: 'bg-sky-50 text-sky-600' },
              { icon: Lightbulb, label: 'Tips & Tricks', slug: 'tips-and-tricks', color: 'bg-yellow-50 text-yellow-600' },
            ].map((topic) => (
              <Link
                key={topic.slug}
                href={`/blog?category=${topic.slug}`}
                className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition text-center border border-gray-100 hover:border-blue-200"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${topic.color}`}>
                  <topic.icon className="w-7 h-7" />
                </div>
                <span className="font-semibold text-gray-800">{topic.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Why Choose TechGodwin?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Expert Knowledge',
                description: 'In-depth articles on infrastructure, cloud, and system administration'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Connect and learn with fellow IT professionals'
              },
              {
                icon: Zap,
                title: 'Hands-On Tips',
                description: 'Practical tips and tricks for real-world scenarios'
              },
              {
                icon: Cloud,
                title: 'Cloud Focus',
                description: 'Stay current with cloud platforms and best practices'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition text-center">
                <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Stay Updated with Industry Insights</h2>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for weekly articles, tips, and upcoming class announcements.</p>
          
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">TechGodwin</h3>
              <p className="text-sm">Professional IT knowledge sharing platform.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Topics</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/blog?category=system-administration" className="hover:text-white">System Administration</Link></li>
                <li><Link href="/blog?category=infrastructure" className="hover:text-white">Infrastructure</Link></li>
                <li><Link href="/blog?category=virtualization" className="hover:text-white">Virtualization</Link></li>
                <li><Link href="/blog?category=cloud" className="hover:text-white">Cloud</Link></li>
                <li><Link href="/blog?category=tips-and-tricks" className="hover:text-white">Tips & Tricks</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 TechGodwin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
