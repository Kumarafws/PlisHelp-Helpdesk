import React from 'react';
import { SupportDashboardSummary } from '@/types/helpdesk';
import { UserCheck, Clock, HelpCircle, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';

interface SupportSummaryCardsProps {
  summary: SupportDashboardSummary;
  onFilterClick: (filterKey: string) => void;
}

export const SupportSummaryCards: React.FC<SupportSummaryCardsProps> = ({
  summary,
  onFilterClick,
}) => {
  const cards = [
    {
      key: 'ASSIGNED',
      title: 'Assigned to Me',
      count: summary.assignedToMe,
      icon: UserCheck,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      description: 'Tiket dalam tanggung jawab Anda',
    },
    {
      key: 'IN_PROGRESS',
      title: 'In Progress',
      count: summary.inProgress,
      icon: Clock,
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      description: 'Sedang dalam investigasi teknisi',
    },
    {
      key: 'NEED_INFO',
      title: 'Need Info',
      count: summary.needInfo,
      icon: HelpCircle,
      iconBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      description: 'Menunggu respon requester',
    },
    {
      key: 'OVERDUE',
      title: 'Overdue / At Risk',
      count: summary.overdueOrAtRisk,
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      description: 'Mendekati / melewati target SLA',
      highlight: summary.overdueOrAtRisk > 0,
    },
    {
      key: 'RESOLVED',
      title: 'Resolved',
      count: summary.resolved,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      description: 'Menunggu konfirmasi employee',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onFilterClick(card.key)}
            className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-900/90 shadow-md ${
              card.highlight ? 'ring-1 ring-rose-500/30 bg-rose-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} transition-transform group-hover:scale-110 duration-200`}
              >
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
