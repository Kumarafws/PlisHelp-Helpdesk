import React from 'react';
import { SLAStatusType } from '@/types/helpdesk';
import { Clock, AlertTriangle, AlertCircle, PauseCircle } from 'lucide-react';

interface SLABadgeProps {
  status?: SLAStatusType;
  remainingTime?: string;
  size?: 'sm' | 'md';
}

export const SLABadge: React.FC<SLABadgeProps> = ({
  status = 'WITHIN_SLA',
  remainingTime,
  size = 'md',
}) => {
  const config = {
    WITHIN_SLA: {
      label: 'Within SLA',
      icon: Clock,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    AT_RISK: {
      label: 'At Risk',
      icon: AlertTriangle,
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/40 animate-pulse',
      dot: 'bg-amber-400',
    },
    BREACHED: {
      label: 'Breached',
      icon: AlertCircle,
      color: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      dot: 'bg-rose-400',
    },
    PAUSED: {
      label: 'Paused',
      icon: PauseCircle,
      color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
      dot: 'bg-zinc-400',
    },
  }[status];

  const Icon = config.icon;
  const paddingClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${config.color} ${paddingClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <Icon className="h-3 w-3 shrink-0" />
      <span>
        {config.label}
        {remainingTime ? ` (${remainingTime})` : ''}
      </span>
    </span>
  );
};
