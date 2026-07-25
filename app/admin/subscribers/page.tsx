'use client';

import { useEffect, useState } from 'react';
import { Users, Mail } from 'lucide-react';

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/subscribers')
      .then((r) => r.json())
      .then((d) => { setSubscribers(d.subscribers || []); setTotal(d.total || 0); setLoading(false); });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-500 text-sm mt-1">{total} active subscribers</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : subscribers.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No subscribers yet.</td></tr>
            ) : (
              subscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {sub.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{sub.name || '—'}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
