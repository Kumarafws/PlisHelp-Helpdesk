import React, { useState } from 'react';
import { TicketComment, UserProfile } from '@/types/helpdesk';
import { MessageSquare, Send, User, Sparkles, Shield, Clock } from 'lucide-react';

interface CommentSectionProps {
  comments: TicketComment[];
  currentUser: UserProfile;
  onAddComment: (commentBody: string) => void;
  isTicketClosed?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  currentUser,
  onAddComment,
  isTicketClosed = false,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Filter only public comments for employee view (strictly hide internal notes)
  const publicComments = comments.filter((c) => !c.isInternal);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSending) return;

    setIsSending(true);
    setTimeout(() => {
      onAddComment(commentText.trim());
      setCommentText('');
      setIsSending(false);
    }, 250);
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Diskusi & Respon Tiket (Chat / Discussion)</h3>
            <p className="text-[11px] text-zinc-400">Komunikasi langsung dengan petugas IT Support</p>
          </div>
        </div>
        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-400 border border-zinc-700">
          {publicComments.length} pesan
        </span>
      </div>

      {/* Messages Thread List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {publicComments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-850/30 p-6 text-center text-xs text-zinc-500">
            Belum ada pesan pada diskusi ini. Kirimkan pertanyaan atau informasi tambahan melalui form di bawah.
          </div>
        ) : (
          publicComments.map((com) => {
            const isMe = com.authorName === currentUser.name || com.authorRole === 'Employee';
            return (
              <div
                key={com.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${
                    isMe
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {com.authorName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>

                {/* Message Body Bubble */}
                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-zinc-200">{com.authorName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        isMe
                          ? 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                      }`}
                    >
                      {com.authorRole}
                    </span>
                    <span className="text-zinc-500 text-[10px]">• {formatDate(com.createdAt)}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed text-left ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-zinc-100 rounded-tr-none'
                        : 'bg-zinc-800/80 border border-zinc-700/60 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{com.body}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Box */}
      {!isTicketClosed ? (
        <form onSubmit={handleSend} className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="relative">
            <textarea
              rows={3}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Tulis balasan atau informasi tambahan untuk tim IT Support..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] text-zinc-500">
              Pesan balasan dapat dibaca oleh tim IT Support.
            </span>
            <button
              type="submit"
              disabled={!commentText.trim() || isSending}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
            >
              {isSending ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Kirim Balasan</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-850/40 p-3 text-center text-xs text-zinc-400">
          Tiket ini telah berstatus Ditutup (Closed). Percakapan telah diarsipkan.
        </div>
      )}
    </div>
  );
};
