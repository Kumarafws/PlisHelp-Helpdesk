import React from 'react';
import { TicketActivity } from '@/types/helpdesk';
import {
  History,
  Clock,
  CheckCircle2,
  PlusCircle,
  RefreshCw,
  UserCheck,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  User,
  Sparkles,
} from 'lucide-react';

interface TicketTimelineProps {
  activities: TicketActivity[];
}

export const TicketTimeline: React.FC<TicketTimelineProps> = ({ activities }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getActivityTheme = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('created')) {
      return {
        icon: PlusCircle,
        nodeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30 ring-4 ring-blue-500/10',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      };
    }
    if (act.includes('assigned')) {
      return {
        icon: UserCheck,
        nodeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 ring-4 ring-indigo-500/10',
        badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      };
    }
    if (act.includes('need_info') || act.includes('need info') || act.includes('informasi')) {
      return {
        icon: HelpCircle,
        nodeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30 ring-4 ring-orange-500/10',
        badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      };
    }
    if (act.includes('resolved') || act.includes('closed')) {
      return {
        icon: CheckCircle2,
        nodeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-4 ring-emerald-500/10',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    }
    if (act.includes('reopen')) {
      return {
        icon: RefreshCw,
        nodeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30 ring-4 ring-purple-500/10',
        badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      };
    }
    return {
      icon: ArrowRight,
      nodeBg: 'bg-zinc-800 text-zinc-400 border-zinc-700 ring-4 ring-zinc-800/50',
      badge: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    };
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Riwayat Aktivitas (Timeline)</h3>
            <p className="text-[11px] text-zinc-400">Jejak progres penanganan tiket oleh tim IT</p>
          </div>
        </div>
        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-400 border border-zinc-700">
          {activities.length} aktivitas
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-7 space-y-5 before:absolute before:left-3.5 before:top-2 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-zinc-700 before:via-zinc-800 before:to-zinc-900">
        {activities.map((act, index) => {
          const theme = getActivityTheme(act.action);
          const Icon = theme.icon;

          return (
            <div key={act.id || index} className="relative group">
              {/* Left timeline node icon */}
              <div
                className={`absolute -left-7 top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-zinc-900 shadow-md transition-transform group-hover:scale-110 duration-200 ${theme.nodeBg}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Event Content Card */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-850/40 p-3.5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-850/70 shadow-sm space-y-2">
                {/* Top row: Action Title & Time badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                    <span>{act.action}</span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700/60">
                    <Clock className="h-2.5 w-2.5 text-zinc-500" />
                    {formatDate(act.timestamp)}
                  </span>
                </div>

                {/* Middle row: Actor / Role info */}
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <User className="h-3 w-3 text-zinc-500 shrink-0" />
                  <span>
                    Oleh: <strong className="text-zinc-200 font-medium">{act.actor}</strong>
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700/50">
                    {act.actorRole}
                  </span>
                </div>

                {/* Note / Description if present */}
                {act.note && (
                  <div className="rounded-lg bg-zinc-900/60 border border-zinc-800/70 p-2.5 text-xs text-zinc-300 leading-relaxed">
                    {act.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
