'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, SlidersHorizontal, FileX } from 'lucide-react';
import { api, Assignment } from '@/lib/api';
import AssignmentCard from '@/components/assignments/AssignmentCard';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const load = async () => {
    try {
      const data = await api.getAssignments();
      setAssignments(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full pt-32">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full pt-16 px-6 pb-20">
        <div className="mb-8">
          <div className="w-48 h-48 relative">
            <div className="absolute inset-0 bg-gray-200 rounded-full opacity-30" />
            <div className="absolute inset-4 bg-white rounded-2xl shadow-sm flex items-center justify-center">
              <FileX size={64} className="text-gray-300" />
            </div>
          </div>
        </div>
        <h2 className="text-xl font-bold text-[#1C1917] mb-2">No assignments yet</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
          Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
        <Link href="/assignments/create">
          <button className="flex items-center gap-2 bg-[#1C1917] text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-[#2d2926] transition-colors">
            <Plus size={16} />
            Create Your First Assignment
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 md:pb-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <div>
          <h1 className="text-base font-bold text-[#1C1917]">Assignments</h1>
          <p className="text-xs text-gray-400">Manage and create assignments for your classes.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={14} />
          Filter By
        </button>
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Assignment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-brand transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((a) => (
          <AssignmentCard
            key={a._id}
            assignment={a}
            onDelete={(id) => setAssignments((prev) => prev.filter((x) => x._id !== id))}
          />
        ))}
      </div>

      <div className="fixed bottom-20 md:bottom-6 right-6">
        <Link href="/assignments/create">
          <button className="flex items-center gap-2 bg-[#1C1917] text-white rounded-full px-5 py-3 text-sm font-medium shadow-lg hover:bg-[#2d2926] transition-colors">
            <Plus size={16} />
            Create Assignment
          </button>
        </Link>
      </div>
    </div>
  );
}