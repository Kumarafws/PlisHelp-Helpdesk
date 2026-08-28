import React from 'react';
import { Ticket, TicketRating, UserProfile } from '@/types/helpdesk';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { ResolutionActions } from './ResolutionActions';
import { CommentSection } from './CommentSection';
import { TicketTimeline } from './TicketTimeline';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Paperclip,
  Tag,
  User,
  Shield,
  CheckCircle2,
  Building,
  Info,
  HelpCircle,
  Headphones,
  Sparkles,
} from 'lucide-react';

interface TicketDetailViewProps {
  ticket: Ticket;
  currentUser: UserProfile;
  onBack: () => void;
  onCloseTicket: (ticketId: string) => void;
  onReopenTicket: (ticketId: string, reason: string) => void;
  onSubmitRating: (ticketId: string, rating: TicketRating) => void;
  onAddComment: (ticketId: string, commentBody: string) => void;
}

export const TicketDetailView: React.FC<TicketDetailViewProps> = ({
  ticket,
  currentUser,
  onBack,
  onCloseTicket,
  onReopenTicket,
  onSubmitRating,
  onAddComment,
}) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Back navigation & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Daftar Tiket</span>
        </button>

        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Ticket Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20">
            {ticket.number}
          </span>
          <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300 border border-zinc-700">
            {ticket.type}
          </span>
          <span className="text-xs text-zinc-400">
            {ticket.category} / {ticket.subcategory}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-2">
          {ticket.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-zinc-500" />
            Diajukan oleh: <strong className="text-zinc-300">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
          </span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Dibuat pada: {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Main Stream + Sidebar Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Resolution & Rating Actions Banner (when status is RESOLVED or CLOSED) */}
          <ResolutionActions
            ticket={ticket}
            onCloseTicket={() => onCloseTicket(ticket.id)}
            onReopenTicket={(reason) => onReopenTicket(ticket.id, reason)}
            onSubmitRating={(rating) => onSubmitRating(ticket.id, rating)}
          />

          {/* Ticket Description */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span>Deskripsi Masalah / Permohonan</span>
            </h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Attachments Section */}
          {ticket.attachments.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-400" />
                  <span>Lampiran Berkas (Attachments)</span>
                </h3>
                <span className="text-xs text-zinc-400">
                  {ticket.attachments.length} berkas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-850 p-3.5 text-xs text-zinc-200 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-200 truncate">{att.fileName}</p>
                        <p className="text-[11px] text-zinc-500">{att.fileSize}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert(`Mengunduh file: ${att.fileName}`)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-750 hover:text-white transition-colors"
                      title="Unduh Berkas"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment & Discussion Chat Section */}
          <CommentSection
            comments={ticket.comments}
            currentUser={currentUser}
            onAddComment={(body) => onAddComment(ticket.id, body)}
            isTicketClosed={ticket.status === 'CLOSED'}
          />

          {/* Activity Timeline */}
          <TicketTimeline activities={ticket.activities} />
        </div>

        {/* Sidebar Info Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-3">
              Informasi Tiket (Details)
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Tipe Tiket</span>
                <span className="font-semibold text-zinc-200">{ticket.type}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Kategori</span>
                <span className="font-semibold text-zinc-200 text-right">{ticket.category}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Subkategori</span>
                <span className="font-medium text-zinc-300 text-right">{ticket.subcategory}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Departemen</span>
                <span className="font-medium text-zinc-300">{ticket.requesterDepartment}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/60">
                <span className="text-zinc-400">Petugas IT Support</span>
                <span className="font-semibold text-zinc-100">
                  {ticket.assigneeName || (
                    <span className="text-amber-400 italic">Belum Ditugaskan</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Status SLA</span>
                <span className="font-semibold text-emerald-400">
                  {ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Batas Waktu Target</span>
                <span className="text-zinc-300">{formatDate(ticket.slaDueAt)}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/60">
                <span className="text-zinc-400">Waktu Dibuat</span>
                <span className="text-zinc-300">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Terakhir Diperbarui</span>
                <span className="text-zinc-300">{formatDate(ticket.updatedAt)}</span>
              </div>

              {ticket.resolvedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400">Waktu Resolved</span>
                  <span className="text-emerald-300 font-medium">{formatDate(ticket.resolvedAt)}</span>
                </div>
              )}

              {ticket.closedAt && (
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Waktu Ditutup</span>
                  <span className="text-zinc-300 font-medium">{formatDate(ticket.closedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick IT Support & SLA Guide card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 to-blue-950/20 p-5 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Headphones className="h-4 w-4" />
              <span>Bantuan & Eskalasi IT</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Jika kendala ini bersifat mendesak atau menghentikan operasional seluruh tim, silakan hubungi tim Helpdesk di:
            </p>
            <div className="rounded-xl border border-zinc-800 bg-zinc-850/60 p-3 text-xs text-zinc-300 space-y-1">
              <div>📞 Ext Internal: <strong className="text-zinc-100">104 / 108</strong></div>
              <div>📧 Email: <strong className="text-zinc-100">helpdesk@plishelp.co.id</strong></div>
              <div>⏰ Jam Operasional: <span className="text-zinc-400">08.00 - 18.00 WIB</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
