'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, LogOut, Home, PlusCircle, Users } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Blog Posts', icon: FileText },
  { href: '/admin/posts/new', label: 'New Post', icon: PlusCircle },
  { href: '/admin/subscribers', label: 'Subscribers', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <div className="text-xl font-bold text-white">TechGodwin</div>
          <div className="text-xs text-gray-400 mt-1">CMS Dashboard</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Home className="w-4 h-4" />
            View Site
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-900 hover:text-white transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-gray-800 rounded-lg p-3 text-xs">
            <div className="text-white font-medium">{session.user?.name}</div>
            <div className="text-gray-400">{session.user?.email}</div>
            <div className="text-blue-400 capitalize mt-1">{(session.user as any)?.role}</div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
