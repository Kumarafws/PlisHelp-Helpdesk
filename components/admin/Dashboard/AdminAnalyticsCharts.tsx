import React from 'react';
import { Ticket } from '@/types/helpdesk';
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
import { BarChart3, PieChart as PieIcon, Layers, Building } from 'lucide-react';

interface AdminAnalyticsChartsProps {
  tickets: Ticket[];
}

export const AdminAnalyticsCharts: React.FC<AdminAnalyticsChartsProps> = ({ tickets }) => {
  // 1. Status Distribution
  const statusData = [
    { name: 'Open', count: tickets.filter((t) => t.status === 'OPEN').length, color: '#3b82f6' },
    { name: 'In Progress', count: tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED').length, color: '#f59e0b' },
    { name: 'Need Info', count: tickets.filter((t) => t.status === 'NEED_INFO').length, color: '#f97316' },
    { name: 'Resolved', count: tickets.filter((t) => t.status === 'RESOLVED').length, color: '#10b981' },
    { name: 'Closed', count: tickets.filter((t) => t.status === 'CLOSED').length, color: '#71717a' },
  ];

  // 2. Department Breakdown
  const deptMap: { [key: string]: number } = {};
  tickets.forEach((t) => {
    const key = t.requesterDepartment.split('&')[0].trim();
    deptMap[key] = (deptMap[key] || 0) + 1;
  });

  const deptData = Object.keys(deptMap).map((dept, idx) => {
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'];
    return {
      name: dept,
      count: deptMap[dept],
      color: colors[idx % colors.length],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Status Chart */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Distribusi Status Tiket (Ticket Statuses)</h3>
            <p className="text-[11px] text-zinc-400">Arus penanganan kendala helpdesk saat ini</p>
          </div>
        </div>

        <div className="h-56 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs">
                        <span className="font-semibold text-zinc-200">{data.name}: </span>
                        <strong className="text-white">{data.count} tiket</strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Volume Chart */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tiket Masuk per Departemen</h3>
            <p className="text-[11px] text-zinc-400">Unit kerja dengan volume permintaan tertinggi</p>
          </div>
        </div>

        <div className="h-56 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptData} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 0 }}>
              <XAxis type="number" stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
              <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={11} tickLine={false} width={80} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs">
                        <span className="font-semibold text-zinc-200">{data.name}: </span>
                        <strong className="text-white">{data.count} tiket</strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {deptData.map((entry, index) => (
                  <Cell key={`dept-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
