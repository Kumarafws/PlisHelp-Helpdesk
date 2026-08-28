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
import { BarChart3, PieChart as PieIcon } from 'lucide-react';

interface SupportAnalyticsChartsProps {
  tickets: Ticket[];
}

export const SupportAnalyticsCharts: React.FC<SupportAnalyticsChartsProps> = ({ tickets }) => {
  // 1. Priority Data
  const priorityCounts = {
    LOW: tickets.filter((t) => t.priority === 'LOW').length,
    MEDIUM: tickets.filter((t) => t.priority === 'MEDIUM').length,
    HIGH: tickets.filter((t) => t.priority === 'HIGH').length,
    URGENT: tickets.filter((t) => t.priority === 'URGENT').length,
  };

  const priorityData = [
    { name: 'Low', count: priorityCounts.LOW, color: '#94a3b8' },
    { name: 'Medium', count: priorityCounts.MEDIUM, color: '#38bdf8' },
    { name: 'High', count: priorityCounts.HIGH, color: '#fbbf24' },
    { name: 'Urgent', count: priorityCounts.URGENT, color: '#f43f5e' },
  ];

  // 2. Category Data
  const categoryMap: { [key: string]: number } = {};
  tickets.forEach((t) => {
    const key = t.category.split(' ')[0]; // short category name
    categoryMap[key] = (categoryMap[key] || 0) + 1;
  });

  const categoryData = Object.keys(categoryMap).map((cat, idx) => {
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
    return {
      name: cat,
      value: categoryMap[cat],
      color: colors[idx % colors.length],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Bar Chart */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Distribusi Prioritas (Tickets by Priority)</h3>
            <p className="text-[11px] text-zinc-400">Tingkat urgensi beban tiket yang masuk</p>
          </div>
        </div>

        <div className="h-56 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs">
                        <span className="font-semibold text-zinc-200">{data.name} Priority: </span>
                        <strong className="text-white">{data.count} tiket</strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Distribusi Kategori (Tickets by Category)</h3>
            <p className="text-[11px] text-zinc-400">Proporsi kategori permohonan / masalah IT</p>
          </div>
        </div>

        <div className="h-56 w-full mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2.5 shadow-xl text-xs">
                        <span className="font-semibold text-zinc-200">{data.name}: </span>
                        <strong className="text-white">{data.value} tiket</strong>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(val) => <span className="text-xs text-zinc-400 ml-1">{val}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
