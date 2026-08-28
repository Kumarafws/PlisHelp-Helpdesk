import React, { useState } from 'react';
import { Ticket, UserProfile } from '@/types/helpdesk';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  Hand,
  HelpCircle,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  UserCheck,
} from 'lucide-react';

interface SupportActionBarProps {
  ticket: Ticket;
  currentUser: UserProfile;
  onTakeTicket: () => void;
  onRequestInfoClick: () => void;
  onResolveClick: () => void;
  onEscalateClick: () => void;
}

export const SupportActionBar: React.FC<SupportActionBarProps> = ({
  ticket,
  currentUser,
  onTakeTicket,
  onRequestInfoClick,
  onResolveClick,
  onEscalateClick,
}) => {
  const [isTakeConfirmOpen, setIsTakeConfirmOpen] = useState(false);
  const isUnassigned = ticket.status === 'OPEN' || !ticket.assigneeName;
  const isMyTicket = ticket.assigneeEmail === currentUser.email || ticket.assigneeName?.includes(currentUser.name);
  const canWork = ticket.status === 'IN_PROGRESS' || ticket.status === 'NEED_INFO';

  return (
    <>
      <div className="rounded-2xl border border-zinc-800/80 bg-gradient-to-r from-zinc-900/90 via-zinc-900/90 to-indigo-950/20 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Aksi Alur Penanganan (Resolver Actions)
          </div>
          <p className="text-xs text-zinc-300 mt-0.5">
            {isUnassigned
              ? 'Tiket ini belum memiliki penanggung jawab. Ambil tiket untuk mulai investigasi.'
              : `Tiket sedang ditangani oleh: ${ticket.assigneeName || '-'}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Take Ticket Button */}
          {isUnassigned && (
            <button
              type="button"
              onClick={() => setIsTakeConfirmOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all"
            >
              <Hand className="h-4 w-4" />
              <span>Ambil Tiket (Take Ticket)</span>
            </button>
          )}

          {/* Action Buttons for active handling */}
          {!isUnassigned && (
            <>
              <button
                type="button"
                onClick={onRequestInfoClick}
                disabled={ticket.status === 'NEED_INFO' || ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'}
                className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/40 bg-orange-500/10 px-3.5 py-2 text-xs font-semibold text-orange-300 hover:bg-orange-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Minta Informasi (Need Info)</span>
              </button>

              <button
                type="button"
                onClick={onEscalateClick}
                disabled={ticket.status === 'ESCALATED' || ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span>Eskalasi Tiket</span>
              </button>

              <button
                type="button"
                onClick={onResolveClick}
                disabled={ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Selesaikan (Resolve)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm Take Ticket Dialog */}
      <ConfirmDialog
        isOpen={isTakeConfirmOpen}
        title="Klaim Penanganan Tiket"
        description={
          <div>
            <p>
              Apakah Anda yakin ingin mengambil dan menangani tiket <strong>{ticket.number}</strong> (<em>{ticket.title}</em>)?
            </p>
            <p className="mt-2 text-xs text-zinc-400 bg-blue-950/20 p-2.5 rounded-lg border border-blue-500/20">
              📌 Status tiket akan otomatis berubah menjadi <strong className="text-blue-400">IN_PROGRESS</strong> dan Anda akan tercatat sebagai penanggung jawab utama.
            </p>
          </div>
        }
        confirmText="Ya, Ambil Tiket Ini"
        cancelText="Batal"
        variant="info"
        icon={<Hand className="h-6 w-6 text-blue-400" />}
        onConfirm={() => {
          setIsTakeConfirmOpen(false);
          onTakeTicket();
        }}
        onCancel={() => setIsTakeConfirmOpen(false)}
      />
    </>
  );
};
