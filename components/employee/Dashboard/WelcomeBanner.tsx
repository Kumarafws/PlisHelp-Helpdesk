import React from 'react';
import { UserProfile } from '@/types/helpdesk';
import { Plus, Sparkles, Calendar, HelpCircle } from 'lucide-react';

interface WelcomeBannerProps {
  user: UserProfile;
  onCreateTicket: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user, onCreateTicket }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-blue-950/40 p-6 sm:p-8 shadow-xl shadow-black/20">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 right-1/3 h-48 w-48 rounded-full bg-indigo-600/10 blur-2xl" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-blue-400">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-0.5 border border-blue-500/20">
              <Sparkles className="h-3.5 w-3.5" />
              <span>EMPLOYEE WORKSPACE</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center gap-1 text-zinc-400">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{user.name}</span>
          </h1>

          <p className="text-sm text-zinc-400 max-w-xl">
            Ada kendala teknis atau permohonan layanan IT hari ini? Tim IT Support siap membantu operasional departemen <span className="text-zinc-200 font-medium">{user.department}</span>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onCreateTicket}
            className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] transition-all duration-200"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Buat Tiket Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
