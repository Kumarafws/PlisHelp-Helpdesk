import React from 'react';
import { AdminDashboardSummary } from '@/types/helpdesk';
import {
  Ticket as TicketIcon,
  Inbox,
  UserCheck,
  Clock,
  HelpCircle,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Users,
  Headphones,
  ChevronRight,
} from 'lucide-react';

interface AdminSummaryCardsProps {
  summary: AdminDashboardSummary;
  onFilterClick: (statusKey: string) => void;
  onNavigateToUsers: (roleFilter?: string) => void;
}

export const AdminSummaryCards: React.FC<AdminSummaryCardsProps> = ({
  summary,
  onFilterClick,
  onNavigateToUsers,
}) => {
  const cards = [
    {
      key: 'ALL',
      title: 'Total Tiket',
      count: summary.totalTickets,
      icon: TicketIcon,
      color: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
      action: () => onFilterClick('ALL'),
    },
    {
      key: 'OPEN',
      title: 'Tiket Open',
      count: summary.open,
      icon: Inbox,
      color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      action: () => onFilterClick('OPEN'),
    },
    {
      key: 'IN_PROGRESS',
      title: 'In Progress',
      count: summary.inProgress,
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      action: () => onFilterClick('IN_PROGRESS'),
    },
    {
      key: 'NEED_INFO',
      title: 'Need Info',
      count: summary.needInfo,
      icon: HelpCircle,
      color: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      action: () => onFilterClick('NEED_INFO'),
    },
    {
      key: 'RESOLVED',
      title: 'Resolved',
      count: summary.resolved,
      icon: CheckCircle2,
      color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      action: () => onFilterClick('RESOLVED'),
    },
    {
      key: 'CLOSED',
      title: 'Closed',
      count: summary.closed,
      icon: Archive,
      color: 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20',
      action: () => onFilterClick('CLOSED'),
    },
    {
      key: 'OVERDUE',
      title: 'SLA Breached',
      count: summary.overdue,
      icon: AlertTriangle,
      color: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      action: () => onFilterClick('OVERDUE'),
      highlight: summary.overdue > 0,
    },
    {
      key: 'EMPLOYEES',
      title: 'Total Employee',
      count: summary.totalEmployees,
      icon: Users,
      color: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      action: () => onNavigateToUsers('Employee'),
    },
    {
      key: 'SUPPORT',
      title: 'Tim IT Support',
      count: summary.totalSupport,
      icon: Headphones,
      color: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20',
      action: () => onNavigateToUsers('IT Support'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.key}
            type="button"
            onClick={card.action}
            className={`group relative flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:bg-zinc-900/90 shadow-md ${
              card.highlight ? 'ring-1 ring-rose-500/30 bg-rose-950/10' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors inline-flex items-center gap-0.5">
                Detail <ChevronRight className="h-3 w-3" />
              </span>
            </div>

            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-white">{card.count}</div>
              <div className="mt-0.5 text-xs font-semibold text-zinc-300 truncate">{card.title}</div>
            </div>

            {card.highlight && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
