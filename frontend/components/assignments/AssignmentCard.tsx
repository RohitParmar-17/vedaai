'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, Eye, Trash2 } from 'lucide-react';
import { Assignment, api } from '@/lib/api';

interface Props {
  assignment: Assignment;
  onDelete: (id: string) => void;
}

export default function AssignmentCard({ assignment, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setMenuOpen(false);
    await api.deleteAssignment(assignment._id);
    onDelete(assignment._id);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  }[assignment.status];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-[#1C1917] text-sm leading-snug flex-1 pr-4">
          {assignment.title}
        </h3>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden min-w-[150px]">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    router.push(`/assignments/${assignment._id}`);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  <Eye size={14} />
                  View Assignment
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
        </span>
        <span className="text-[10px] text-gray-400">{assignment.subject} • {assignment.className}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          <span className="font-medium text-gray-500">Assigned on :</span>{' '}
          {formatDate(assignment.createdAt)}
        </span>
        {assignment.dueDate && (
          <span>
            <span className="font-medium text-gray-500">Due :</span>{' '}
            {formatDate(assignment.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}