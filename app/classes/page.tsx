'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, Clock, ArrowRight } from 'lucide-react';

interface UpcomingClass {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  duration: number;
  instructor?: string;
  location?: string;
  capacity: number;
  registeredCount: number;
  price: number;
  isPaid: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pagination.page.toString(),
          limit: pagination.limit.toString(),
          upcoming: 'true',
        });

        const response = await fetch(`/api/classes?${params}`);
        const data = await response.json();
        setClasses(data.classes);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [pagination.page]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            TechGodwin
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Upcoming Classes</h1>
          <p className="text-xl text-blue-100">
            Enroll in live training sessions with industry experts
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading classes...</p>
            </div>
          ) : classes.length > 0 ? (
            <div className="space-y-6 mb-12">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <div className="md:flex h-full">
                    {/* Content */}
                    <div className="flex-1 p-8">
                      <div className="flex flex-col h-full">
                        <div className="mb-4">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {cls.category}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {cls.title}
                        </h3>

                        <p className="text-gray-600 mb-6 flex-1">
                          {cls.description}
                        </p>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(cls.startDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{cls.duration} hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>
                              {cls.registeredCount}/{cls.capacity}
                            </span>
                          </div>
                          {cls.instructor && (
                            <div className="flex items-center gap-2">
                              <span>{cls.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/classes/${cls.id}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                          >
                            {cls.isPaid ? 'Enroll Now' : 'Register Now'}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          {cls.registeredCount >= cls.capacity && (
                            <span className="text-sm text-orange-600 font-medium">
                              Class Full
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price Card */}
                    <div className="md:w-64 bg-gradient-to-br from-blue-50 to-purple-50 p-8 flex flex-col justify-center items-center text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        {cls.isPaid ? `$${cls.price}` : 'FREE'}
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        {cls.isPaid ? 'One-time payment' : 'No payment required'}
                      </p>
                      <div className="w-full h-px bg-gray-300 mb-4" />
                      <p className="text-sm text-gray-700">
                        {cls.registeredCount} registered
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No classes available right now. Check back soon!</p>
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
