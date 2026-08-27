import React from 'react';
import { DashboardSummary, TicketStatus } from '@/types/helpdesk';
import { CircleDot, Clock, HelpCircle, CheckCircle2, CheckCheck, ChevronRight } from 'lucide-react';

interface SummaryCardsProps {
  summary: DashboardSummary;
  onSelectStatusFilter: (status: TicketStatus | 'ALL') => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, onSelectStatusFilter }) => {
  const cards = [
    {
      title: 'Open',
      status: 'OPEN' as TicketStatus,
      count: summary.open,
      icon: CircleDot,
      color: 'text-blue-400',
      borderHover: 'hover:border-blue-500/50 hover:shadow-blue-950/30',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      description: 'Menunggu penugasan IT',
    },
    {
      title: 'In Progress',
      status: 'IN_PROGRESS' as TicketStatus,
      count: summary.inProgress,
      icon: Clock,
      color: 'text-amber-400',
      borderHover: 'hover:border-amber-500/50 hover:shadow-amber-950/30',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      description: 'Sedang ditangani teknisi',
    },
    {
      title: 'Need Info',
      status: 'NEED_INFO' as TicketStatus,
      count: summary.needInfo,
      icon: HelpCircle,
      color: 'text-orange-400',
      borderHover: 'hover:border-orange-500/50 hover:shadow-orange-950/30',
      iconBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      description: 'Membutuhkan respon Anda',
      highlight: summary.needInfo > 0,
    },
    {
      title: 'Resolved',
      status: 'RESOLVED' as TicketStatus,
      count: summary.resolved,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50 hover:shadow-emerald-950/30',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      description: 'Menunggu konfirmasi selesai',
      highlight: summary.resolved > 0,
    },
    {
      title: 'Closed',
      status: 'CLOSED' as TicketStatus,
      count: summary.closed,
      icon: CheckCheck,
      color: 'text-zinc-400',
      borderHover: 'hover:border-zinc-500/50 hover:shadow-zinc-950/30',
      iconBg: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
      description: 'Tiket selesai ditutup',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.status}
            type="button"
            onClick={() => onSelectStatusFilter(card.status)}
            className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-900/90 shadow-md ${card.borderHover} ${
              card.highlight ? 'ring-1 ring-orange-500/30 bg-orange-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform group-hover:scale-110 duration-200`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5">
                Lihat <ChevronRight className="h-3 w-3" />
              </span>
            </div>

            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {card.count}
              </div>
              <div className="mt-1 text-sm font-medium text-zinc-200">{card.title}</div>
              <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{card.description}</p>
            </div>

            {card.highlight && (
              <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
