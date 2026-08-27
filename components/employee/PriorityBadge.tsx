import React from 'react';
import { TicketPriority } from '@/types/helpdesk';
import { Flame, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = {
    LOW: {
      label: 'Low',
      icon: ArrowDown,
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    },
    MEDIUM: {
      label: 'Medium',
      icon: AlertCircle,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    HIGH: {
      label: 'High',
      icon: ArrowUp,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    URGENT: {
      label: 'Urgent',
      icon: Flame,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 font-semibold shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    },
  }[priority] || {
    label: priority,
    icon: AlertCircle,
    color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs ${config.color}`}
    >
      <Icon className="h-3 w-3" />
      <span>{config.label}</span>
    </span>
  );
};
