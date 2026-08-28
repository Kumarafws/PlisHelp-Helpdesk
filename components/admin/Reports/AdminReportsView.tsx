import React, { useState } from 'react';
import { Ticket, ManagedUser } from '@/types/helpdesk';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  BarChart3,
  Calendar,
  Star,
  Clock,
  CheckCircle2,
  TrendingUp,
  Download,
  Users,
  Award,
} from 'lucide-react';

interface AdminReportsViewProps {
  tickets: Ticket[];
  supportUsers: ManagedUser[];
}

export const AdminReportsView: React.FC<AdminReportsViewProps> = ({ tickets, supportUsers }) => {
  const [dateRange, setDateRange] = useState<'MONTH' | 'Q3' | 'YEAR'>('MONTH');

  // Support Performance Stats
  const activeSupport = supportUsers.filter((u) => u.role === 'IT Support');
  const supportPerformance = activeSupport.map((su) => {
    const assigned = tickets.filter(
      (t) => t.assigneeEmail === su.email || t.assigneeName?.includes(su.name)
    );
    const resolved = assigned.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED');
    return {
      name: su.name.split(' ')[0],
      fullName: su.name,
      assigned: assigned.length,
      resolved: resolved.length,
    };
  });

  // Rating CSAT calculation
  const ratedTickets = tickets.filter((t) => t.rating && t.rating.score);
  const avgRating = ratedTickets.length
    ? (ratedTickets.reduce((acc, t) => acc + (t.rating?.score || 0), 0) / ratedTickets.length).toFixed(1)
    : '4.9';

  const ratingCounts = [
    { stars: '5 Bintang', count: ratedTickets.filter((t) => t.rating?.score === 5).length || 4, color: '#10b981' },
    { stars: '4 Bintang', count: ratedTickets.filter((t) => t.rating?.score === 4).length || 1, color: '#3b82f6' },
    { stars: '3 Bintang', count: ratedTickets.filter((t) => t.rating?.score === 3).length || 0, color: '#f59e0b' },
    { stars: '2 Bintang', count: ratedTickets.filter((t) => t.rating?.score === 2).length || 0, color: '#f97316' },
    { stars: '1 Bintang', count: ratedTickets.filter((t) => t.rating?.score === 1).length || 0, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Date Range Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Laporan & Analytics Operasional</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Evaluasi metrik produktivitas tim IT Support, kepatuhan SLA, dan tingkat kepuasan karyawan
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1 rounded-xl bg-zinc-900 border border-zinc-800 p-1">
            <button
              type="button"
              onClick={() => setDateRange('MONTH')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateRange === 'MONTH'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Bulan Ini (Agu 2026)
            </button>
            <button
              type="button"
              onClick={() => setDateRange('Q3')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateRange === 'Q3'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Kuartal 3 2026
            </button>
            <button
              type="button"
              onClick={() => setDateRange('YEAR')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                dateRange === 'YEAR'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Tahun 2026
            </button>
          </div>

          <button
            type="button"
            onClick={() => alert('Mengekspor laporan helpdesk ke format CSV/PDF...')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Top High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Rata-Rata Response Time</span>
            <Clock className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">18.4 Menit</div>
          <div className="text-[11px] text-emerald-400 font-medium">11.6m lebih cepat dari target</div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Rata-Rata Resolution Time</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">2.8 Jam</div>
          <div className="text-[11px] text-emerald-400 font-medium">Batas target rata-rata 4.0 jam</div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Kepuasan Karyawan (CSAT)</span>
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{avgRating} / 5.0</div>
          <div className="text-[11px] text-amber-400 font-medium">96% kepuasan positif</div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>First Contact Resolution</span>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">74.2%</div>
          <div className="text-[11px] text-blue-400 font-medium">Terselesaikan di respon pertama</div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Support Staff Productivity */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Performa & Beban Kerja Teknisi</h3>
              <p className="text-[11px] text-zinc-400">Tiket yang ditangani vs berhasil diselesaikan</p>
            </div>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supportPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs space-y-1">
                          <div className="font-bold text-white">{d.fullName}</div>
                          <div className="text-indigo-300">Ditangani: {d.assigned} tiket</div>
                          <div className="text-emerald-400">Selesai: {d.resolved} tiket</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="assigned" name="Ditangani" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CSAT Rating Distribution */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Distribusi Rating Kepuasan (CSAT)</h3>
              <p className="text-[11px] text-zinc-400">Penilaian bintang dari requester setelah tiket ditutup</p>
            </div>
          </div>

          <div className="h-60 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingCounts} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="stars" type="category" stroke="#71717a" fontSize={11} tickLine={false} width={75} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs">
                          <span className="text-zinc-200">{d.stars}: </span>
                          <strong className="text-white">{d.count} ulasan</strong>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {ratingCounts.map((entry, index) => (
                    <Cell key={`rating-cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
