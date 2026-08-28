import React, { useState } from 'react';
import { Ticket, UserProfile, ManagedUser, TicketStatus } from '@/types/helpdesk';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { TicketTimeline } from '@/components/employee/TicketDetail/TicketTimeline';
import { SupportConversation } from '@/components/support/TicketDetail/SupportConversation';
import { SLABadge } from '@/components/support/SLABadge';
import { AssignTicketModal } from './Modals/AssignTicketModal';
import { OverrideStatusModal } from './Modals/OverrideStatusModal';
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
  ShieldCheck,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface AdminTicketDetailViewProps {
  ticket: Ticket;
  currentUser: UserProfile;
  activeSupportUsers: ManagedUser[];
  onBack: () => void;
  onAssignTicket: (ticketId: string, assignee: ManagedUser | null, reason?: string) => void;
  onOverrideStatus: (ticketId: string, newStatus: TicketStatus, reason: string) => void;
  onAddComment: (ticketId: string, commentBody: string, isInternal: boolean) => void;
}

export const AdminTicketDetailView: React.FC<AdminTicketDetailViewProps> = ({
  ticket,
  currentUser,
  activeSupportUsers,
  onBack,
  onAssignTicket,
  onOverrideStatus,
  onAddComment,
}) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);

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
      {/* Back Navigation & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Master Tiket</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <SLABadge
            status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
            remainingTime={ticket.slaInfo?.remainingTimeFormatted}
          />
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
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
            Pemohon: <strong className="text-zinc-300">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
          </span>
          <span className="text-zinc-600">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
            Dibuat: {formatDate(ticket.createdAt)}
          </span>
        </div>
      </div>

      {/* Administrative Action Bar */}
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-zinc-900 to-zinc-900 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
            Otoritas Manajemen Tiket (Administrator Controls)
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            Penanggung Jawab Saat Ini: <strong className="text-white">{ticket.assigneeName || 'Belum Ditugaskan (Unassigned)'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED' ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3.5 py-2 text-xs font-medium text-zinc-400">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Penanggung Jawab Terkunci ({ticket.status})</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              <UserCheck className="h-4 w-4" />
              <span>{ticket.assigneeName ? 'Reassign / Unassign' : 'Assign ke IT Support'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOverrideModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Override Status</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Column */}
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

          {/* Description */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Deskripsi Laporan Masalah</span>
            </h3>
            <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-4 text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-purple-400" />
                  <span>Lampiran Berkas (Attachments)</span>
                </h3>
                <span className="text-xs text-zinc-400">{ticket.attachments.length} berkas</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-850 p-3.5 text-xs text-zinc-200"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
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
                      className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-750 hover:text-white"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation (Public + Internal Notes) */}
          <SupportConversation
            comments={ticket.comments}
            currentUser={currentUser}
            onAddComment={(body, isInternal) => onAddComment(ticket.id, body, isInternal)}
            isTicketClosed={ticket.status === 'CLOSED'}
          />

          {/* Activity Timeline Audit Log */}
          <TicketTimeline activities={ticket.activities} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Requester Info */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5">
              Data Pemohon (Requester)
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

          {/* SLA Tracking */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5 flex items-center justify-between">
              <span>Status SLA Target</span>
              <SLABadge
                status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                size="sm"
              />
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Response Target:</span>
                <span className="font-semibold text-zinc-200">30 menit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Resolution Target:</span>
                <span className="font-semibold text-zinc-200">4 jam</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-zinc-800/60">
                <span className="text-zinc-400">Sisa Waktu:</span>
                <span className="font-bold text-amber-400">
                  {ticket.slaInfo?.remainingTimeFormatted || '01h 40m'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Metadata */}
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-3.5 text-xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2.5">
              Metadata Tiket
            </h3>

            <div className="flex justify-between">
              <span className="text-zinc-400">Kategori</span>
              <span className="font-semibold text-zinc-200 text-right">{ticket.category}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Subkategori</span>
              <span className="font-medium text-zinc-300 text-right">{ticket.subcategory}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-zinc-800/60">
              <span className="text-zinc-400">Assignee Saat Ini</span>
              <span className="font-bold text-purple-300">
                {ticket.assigneeName || 'Belum Ditugaskan'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Dibuat</span>
              <span className="text-zinc-300">{formatDate(ticket.createdAt)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-400">Terakhir Update</span>
              <span className="text-zinc-300">{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AssignTicketModal
        isOpen={isAssignModalOpen}
        ticketNumber={ticket.number}
        currentAssigneeName={ticket.assigneeName}
        activeSupportUsers={activeSupportUsers}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={(assignee, reason) => onAssignTicket(ticket.id, assignee, reason)}
      />

      <OverrideStatusModal
        isOpen={isOverrideModalOpen}
        ticketNumber={ticket.number}
        currentStatus={ticket.status}
        onClose={() => setIsOverrideModalOpen(false)}
        onSubmit={(newStatus, reason) => onOverrideStatus(ticket.id, newStatus, reason)}
      />
    </div>
  );
};
