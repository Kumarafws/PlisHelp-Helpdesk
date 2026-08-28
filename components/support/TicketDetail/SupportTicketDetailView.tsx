import React, { useState } from 'react';
import { Ticket, UserProfile } from '@/types/helpdesk';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { TicketTimeline } from '@/components/employee/TicketDetail/TicketTimeline';
import { SLABadge } from '../SLABadge';
import { SupportActionBar } from './SupportActionBar';
import { SupportConversation } from './SupportConversation';
import { RequestInfoModal } from './Modals/RequestInfoModal';
import { ResolveTicketModal } from './Modals/ResolveTicketModal';
import { EscalateTicketModal } from './Modals/EscalateTicketModal';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Download,
  FileText,
  Paperclip,
  User,
  Building,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Headphones,
} from 'lucide-react';

interface SupportTicketDetailViewProps {
  ticket: Ticket;
  currentUser: UserProfile;
  onBack: () => void;
  onTakeTicket: (ticketId: string) => void;
  onRequestInfo: (ticketId: string, message: string) => void;
  onResolveTicket: (ticketId: string, resolutionSummary: string) => void;
  onEscalateTicket: (ticketId: string, reason: string) => void;
  onAddComment: (ticketId: string, commentBody: string, isInternal: boolean) => void;
}

export const SupportTicketDetailView: React.FC<SupportTicketDetailViewProps> = ({
  ticket,
  currentUser,
  onBack,
  onTakeTicket,
  onRequestInfo,
  onResolveTicket,
  onEscalateTicket,
  onAddComment,
}) => {
  const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);

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
      {/* Back Navigation & Status Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Antrean Tiket</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <SLABadge
            status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
            remainingTime={ticket.slaInfo?.remainingTimeFormatted || '02h 45m'}
          />
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Ticket Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
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
            Requester: <strong className="text-zinc-300">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
          </span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Dibuat: {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <SupportActionBar
        ticket={ticket}
        currentUser={currentUser}
        onTakeTicket={() => onTakeTicket(ticket.id)}
        onRequestInfoClick={() => setIsRequestInfoModalOpen(true)}
        onResolveClick={() => setIsResolveModalOpen(true)}
        onEscalateClick={() => setIsEscalateModalOpen(true)}
      />

      {/* Two Column Layout: Main Stream + Sidebar Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Resolution Card if resolved */}
          {ticket.resolutionSummary && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ringkasan Solusi (Resolution Summary)</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {ticket.resolutionSummary}
              </p>
            </div>
          )}

          {/* Escalation Card if escalated */}
          {ticket.escalationReason && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 shadow-md space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                <AlertTriangle className="h-4 w-4" />
                <span>Alasan Eskalasi (Escalation Reason)</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                {ticket.escalationReason}
              </p>
            </div>
          )}

          {/* Ticket Description */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span>Deskripsi Kendala dari Requester</span>
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
                  <Paperclip className="h-4 w-4 text-indigo-400" />
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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

          {/* Support Conversation (Public comment & Internal note tabs) */}
          <SupportConversation
            comments={ticket.comments}
            currentUser={currentUser}
            onAddComment={(body, isInternal) => onAddComment(ticket.id, body, isInternal)}
            isTicketClosed={ticket.status === 'CLOSED'}
          />

          {/* Activity Timeline */}
          <TicketTimeline activities={ticket.activities} />
        </div>

        {/* Sidebar Info Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Requester Profile Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5">
              Informasi Pemohon (Requester)
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300 font-bold text-xs border border-blue-500/30">
                {ticket.requesterName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{ticket.requesterName}</div>
                <div className="text-xs text-zinc-400 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{ticket.requesterDepartment}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-zinc-400 pt-1 flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
              <span>{ticket.requesterEmail}</span>
            </div>
          </div>

          {/* SLA Tracking Card */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
              <span>SLA Target & Tracking</span>
              <SLABadge
                status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                size="sm"
              />
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Response SLA Target:</span>
                <span className="font-semibold text-zinc-200">30 menit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Resolution SLA Target:</span>
                <span className="font-semibold text-zinc-200">4 jam</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-800/60">
                <span className="text-zinc-400">Sisa Waktu Resolusi:</span>
                <span className="font-bold text-amber-400">
                  {ticket.slaInfo?.remainingTimeFormatted || '01h 42m'}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Details Metadata */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5">
              Detail Tiket
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Kategori</span>
                <span className="font-semibold text-zinc-200 text-right">{ticket.category}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Subkategori</span>
                <span className="font-medium text-zinc-300 text-right">{ticket.subcategory}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Penanggung Jawab</span>
                <span className="font-bold text-indigo-300">
                  {ticket.assigneeName || 'Belum Ditugaskan'}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-zinc-800/60">
                <span className="text-zinc-400">Waktu Dibuat</span>
                <span className="text-zinc-300">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Terakhir Update</span>
                <span className="text-zinc-300">{formatDate(ticket.updatedAt)}</span>
              </div>

              {ticket.resolvedAt && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Waktu Resolved</span>
                  <span className="font-medium">{formatDate(ticket.resolvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <RequestInfoModal
        isOpen={isRequestInfoModalOpen}
        ticketNumber={ticket.number}
        onClose={() => setIsRequestInfoModalOpen(false)}
        onSubmit={(msg) => onRequestInfo(ticket.id, msg)}
      />

      <ResolveTicketModal
        isOpen={isResolveModalOpen}
        ticketNumber={ticket.number}
        onClose={() => setIsResolveModalOpen(false)}
        onSubmit={(summary) => onResolveTicket(ticket.id, summary)}
      />

      <EscalateTicketModal
        isOpen={isEscalateModalOpen}
        ticketNumber={ticket.number}
        onClose={() => setIsEscalateModalOpen(false)}
        onSubmit={(reason) => onEscalateTicket(ticket.id, reason)}
      />
    </div>
  );
};
