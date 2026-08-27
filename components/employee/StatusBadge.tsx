import React from 'react';
import { TicketStatus } from '@/types/helpdesk';
import { 
  CircleDot, 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  CheckCheck, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-react';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = {
    OPEN: {
      label: 'Open',
      icon: CircleDot,
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]',
    },
    IN_PROGRESS: {
      label: 'In Progress',
      icon: Clock,
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
    },
    NEED_INFO: {
      label: 'Need Info',
      icon: HelpCircle,
      bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      dot: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]',
    },
    ESCALATED: {
      label: 'Escalated',
      icon: AlertTriangle,
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      dot: 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
    },
    RESOLVED: {
      label: 'Resolved',
      icon: CheckCircle2,
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    },
    CLOSED: {
      label: 'Closed',
      icon: CheckCheck,
      bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      dot: 'bg-zinc-400',
    },
    REOPENED: {
      label: 'Reopened',
      icon: RefreshCw,
      bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]',
    },
  }[status] || {
    label: status,
    icon: CircleDot,
    bg: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
    dot: 'bg-zinc-400',
  };

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} transition-all duration-150`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <Icon className="h-3 w-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
