import React, { useState } from 'react';
import { TicketComment, UserProfile } from '@/types/helpdesk';
import { MessageSquare, Lock, Send, ShieldAlert, User, Sparkles } from 'lucide-react';

interface SupportConversationProps {
  comments: TicketComment[];
  currentUser: UserProfile;
  onAddComment: (commentBody: string, isInternal: boolean) => void;
  isTicketClosed?: boolean;
}

export const SupportConversation: React.FC<SupportConversationProps> = ({
  comments,
  currentUser,
  onAddComment,
  isTicketClosed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'public' | 'internal'>('public');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

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
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    setTimeout(() => {
      onAddComment(inputText.trim(), activeTab === 'internal');
      setInputText('');
      setIsSending(false);
    }, 250);
  };

  const publicCount = comments.filter((c) => !c.isInternal).length;
  const internalCount = comments.filter((c) => c.isInternal).length;

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Komunikasi & Catatan Tiket</h3>
          <p className="text-[11px] text-zinc-400">Public reply ke employee atau catatan troubleshooting internal</p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 rounded-xl bg-zinc-850 p-1 border border-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('public')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'public'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Public Comment ({publicCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('internal')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'internal'
                ? 'bg-amber-500 text-zinc-950 shadow-sm font-bold'
                : 'text-zinc-400 hover:text-amber-300'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Internal Note ({internalCount})</span>
          </button>
        </div>
      </div>

      {/* Messages Thread List */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-850/30 p-6 text-center text-xs text-zinc-500">
            Belum ada komentar atau catatan pada tiket ini.
          </div>
        ) : (
          comments.map((com) => {
            const isInternal = com.isInternal;
            const isMe = com.authorName === currentUser.name || com.authorRole === 'IT Support';

            return (
              <div
                key={com.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-sm ${
                    isInternal
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isMe
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {isInternal ? <Lock className="h-3.5 w-3.5" /> : com.authorName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-2 text-[11px] ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-zinc-200">{com.authorName}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        isInternal
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 font-bold'
                          : isMe
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}
                    >
                      {isInternal ? 'INTERNAL NOTE' : com.authorRole}
                    </span>
                    <span className="text-zinc-500 text-[10px]">• {formatDate(com.createdAt)}</span>
                  </div>

                  <div
                    className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed text-left ${
                      isInternal
                        ? 'bg-amber-950/20 border border-amber-500/30 text-amber-100 rounded-tr-none'
                        : isMe
                        ? 'bg-indigo-600/20 border border-indigo-500/30 text-zinc-100 rounded-tr-none'
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

      {/* Input Box based on active tab */}
      {!isTicketClosed ? (
        <form onSubmit={handleSend} className="space-y-3 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              {activeTab === 'internal' ? (
                <>
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-amber-400">Catatan Troubleshooting Internal (Privat)</span>
                </>
              ) : (
                <>
                  <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                  <span>Kirim Public Reply ke Requester</span>
                </>
              )}
            </label>
            {activeTab === 'internal' && (
              <span className="text-[10px] text-amber-400/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                🔒 Tersembunyi dari Employee
              </span>
            )}
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeTab === 'internal'
                  ? 'Tuliskan catatan teknis troubleshooting, dugaan penyebab bug, atau referensi log jaringan internal...'
                  : 'Tulis balasan langsung kepada requester tiket ini...'
              }
              className={`w-full rounded-xl border bg-zinc-850 p-3.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all resize-none ${
                activeTab === 'internal'
                  ? 'border-amber-500/40 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                  : 'border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              {activeTab === 'internal'
                ? 'Hanya dapat dilihat oleh tim IT Support dan Admin.'
                : 'Pesan ini akan langsung muncul di halaman tiket employee.'}
            </span>
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all shadow-md ${
                activeTab === 'internal'
                  ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20'
              }`}
            >
              {isSending ? (
                <span>Mengirim...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>{activeTab === 'internal' ? 'Simpan Catatan Internal' : 'Kirim Komentar Publik'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-850/40 p-3 text-center text-xs text-zinc-400">
          Tiket ini telah berstatus Ditutup (Closed).
        </div>
      )}
    </div>
  );
};
