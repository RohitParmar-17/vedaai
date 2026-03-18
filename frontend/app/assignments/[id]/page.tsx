'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RefreshCw, Sparkles } from 'lucide-react';
import { api, Assignment } from '@/lib/api';
import { getSocket, joinRoom } from '@/lib/socket';
import QuestionPaper from '@/components/output/QuestionPaper';
import DownloadButton from '@/components/output/DownloadButton';

export default function AssignmentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await api.getAssignment(id);
      setAssignment(data);
      return data;
    } catch {
      router.push('/assignments');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
  load().then((data) => {
    if (!data) return;
    if (data.status === 'done' || data.status === 'failed') return;

    const socket = getSocket();
    joinRoom(id);
    socket.on('status', async (payload: { status: string }) => {
      if (payload.status === 'done') {
        const updated = await api.getAssignment(id);
        setAssignment(updated);
        socket.off('status');
      } else if (payload.status === 'failed') {
        const updated = await api.getAssignment(id);
        setAssignment(updated);
        socket.off('status');
      } else {
        setAssignment((prev) => prev ? { ...prev, status: payload.status as Assignment['status'] } : prev);
      }
    });

    const poll = setInterval(async () => {
      const updated = await api.getAssignment(id);
      setAssignment(updated);
      if (updated.status === 'done' || updated.status === 'failed') {
        clearInterval(poll);
      }
    }, 3000);

    return () => {
      socket.off('status');
      clearInterval(poll);
    };
  });
}, [id, load]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await api.regenerate(id);
      setAssignment((prev) => (prev ? { ...prev, status: 'pending', result: undefined } : prev));

      const socket = getSocket();
      joinRoom(id);
      socket.on('status', async (payload: { status: string }) => {
        if (payload.status === 'done') {
          const updated = await api.getAssignment(id);
          setAssignment(updated);
          socket.off('status');
        }
      });
    } catch {}
    setRegenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!assignment) return null;

  const isProcessing = assignment.status === 'pending' || assignment.status === 'processing';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 pb-24">
      <div className="bg-[#1C1917] rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles size={14} className="text-white" />
          </div>
          <div className="flex-1">
            {isProcessing ? (
              <div>
                <p className="text-white text-sm font-medium mb-2">
                  Generating your question paper...
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-400 text-xs">
                    {assignment.status === 'processing' ? 'AI is working on it' : 'Queued for processing'}
                  </span>
                </div>
              </div>
            ) : assignment.status === 'failed' ? (
              <p className="text-red-400 text-sm">
                Generation failed: {assignment.error || 'Unknown error'}
              </p>
            ) : (
              <p className="text-white text-sm leading-relaxed">
                Certainly! Here are your customized Question Paper for{' '}
                <strong>{assignment.title}</strong> — {assignment.subject} for {assignment.className}.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {assignment.status === 'done' && (
            <DownloadButton targetId="question-paper" />
          )}
          <button
            onClick={handleRegenerate}
            disabled={isProcessing || regenerating}
            className="flex items-center gap-2 border border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm font-medium hover:border-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={regenerating ? 'animate-spin' : ''} />
            Regenerate
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-12 h-12 border-3 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            AI is crafting your question paper. This usually takes 15–30 seconds.
          </p>
        </div>
      )}

      {assignment.status === 'done' && assignment.result && (
        <QuestionPaper assignment={assignment} />
      )}

      {assignment.status === 'failed' && (
        <div className="bg-white rounded-2xl p-8 text-center border border-red-100 shadow-sm">
          <p className="text-red-500 text-sm mb-4">{assignment.error}</p>
          <button
            onClick={handleRegenerate}
            className="px-6 py-2.5 bg-brand text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}