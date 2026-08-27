import React from 'react';
import { Ticket } from '@/types/helpdesk';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { AlertCircle, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from 'lucide-react';

interface ActionRequiredProps {
  tickets: Ticket[];
  onOpenTicket: (ticket: Ticket) => void;
}

export const ActionRequired: React.FC<ActionRequiredProps> = ({ tickets, onOpenTicket }) => {
  // Filter tickets that require employee action: NEED_INFO or RESOLVED
  const actionTickets = tickets.filter(
    (t) => t.status === 'NEED_INFO' || t.status === 'RESOLVED'
  );

  if (actionTickets.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-zinc-900/60 to-zinc-900/60 p-5 sm:p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Tindakan Diperlukan (Action Required)</h2>
            <p className="text-xs text-zinc-400">
              Ada {actionTickets.length} tiket yang membutuhkan konfirmasi atau respon dari Anda
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actionTickets.map((ticket) => {
          const isNeedInfo = ticket.status === 'NEED_INFO';
          return (
            <div
              key={ticket.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-850"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium text-zinc-400">{ticket.number}</span>
                  <StatusBadge status={ticket.status} size="sm" />
                </div>

                <h3 className="mt-2 text-sm font-semibold text-zinc-100 line-clamp-1">
                  {ticket.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {isNeedInfo ? (
                    <span className="inline-flex items-center gap-1 text-orange-400">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      IT Support membutuhkan informasi tambahan untuk melanjutkan investigasi.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      IT Support telah menyelesaikan permohonan. Mohon konfirmasi penutupan tiket.
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <PriorityBadge priority={ticket.priority} />
                <button
                  type="button"
                  onClick={() => onOpenTicket(ticket)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    isNeedInfo
                      ? 'bg-orange-500/10 text-orange-300 border border-orange-500/30 hover:bg-orange-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                >
                  <span>{isNeedInfo ? 'Balas IT Support' : 'Review & Konfirmasi'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
