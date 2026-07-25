'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Users, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface UpcomingClass {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: number;
  instructor?: string;
  location?: string;
  capacity: number;
  registeredCount: number;
  price: number;
  isPaid: boolean;
}

export default function ClassDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [classData, setClassData] = useState<UpcomingClass | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const response = await fetch(`/api/classes?upcoming=true`);
        const data = await response.json();
        const found = data.classes.find((c: UpcomingClass) => c.id === id);
        if (found) {
          setClassData(found);
        } else {
          setError('Class not found');
        }
      } catch (err) {
        setError('Failed to load class');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClass();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/classes/${id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-gray-600">Loading class details...</p>
      </main>
    );
  }

  if (error || !classData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <nav className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
          <Link href="/classes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </Link>
        </nav>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-600 text-lg">{error || 'Class not found'}</p>
        </div>
      </main>
    );
  }

  const isFull = classData.registeredCount >= classData.capacity;
  const startDate = new Date(classData.startDate);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/classes" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Classes
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <div className="mb-6">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {classData.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {classData.title}
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {classData.description}
              </p>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="flex gap-4">
                  <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-bold text-gray-900">
                      {startDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' at '}
                      {startDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-bold text-gray-900">{classData.duration} hours</p>
                  </div>
                </div>

                {classData.instructor && (
                  <div className="flex gap-4">
                    <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Instructor</p>
                      <p className="font-bold text-gray-900">{classData.instructor}</p>
                    </div>
                  </div>
                )}

                {classData.location && (
                  <div className="flex gap-4">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-bold text-gray-900">{classData.location}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Enrollment</p>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all"
                      style={{
                        width: `${(classData.registeredCount / classData.capacity) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="font-bold text-gray-900">
                    {classData.registeredCount}/{classData.capacity}
                  </p>
                </div>
                {isFull && (
                  <p className="text-sm text-orange-600 font-medium">
                    This class is full
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 sticky top-24">
              <div className="text-center mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {classData.isPaid ? `$${classData.price}` : 'FREE'}
                </div>
                <p className="text-sm text-gray-600">
                  {classData.isPaid ? 'One-time payment' : 'No payment required'}
                </p>
              </div>

              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-green-900">Registration Successful!</p>
                      <p className="text-sm text-green-800">
                        Check your email for confirmation details.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {isFull && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-orange-800">
                        This class is currently full. You can still join the waitlist.
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || isFull}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Registering...' : isFull ? 'Join Waitlist' : 'Register Now'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    A confirmation email will be sent to you
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 sm:px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>&copy; 2024 TechGodwin. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
