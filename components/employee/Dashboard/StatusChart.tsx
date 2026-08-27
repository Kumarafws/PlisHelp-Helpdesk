import React from 'react';
import { DashboardSummary } from '@/types/helpdesk';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PieChart as ChartIcon } from 'lucide-react';

interface StatusChartProps {
  summary: DashboardSummary;
}

export const StatusChart: React.FC<StatusChartProps> = ({ summary }) => {
  const chartData = [
    { name: 'Open', value: summary.open, color: '#60a5fa' },
    { name: 'In Progress', value: summary.inProgress, color: '#fbbf24' },
    { name: 'Need Info', value: summary.needInfo, color: '#fb923c' },
    { name: 'Resolved', value: summary.resolved, color: '#34d399' },
    { name: 'Closed', value: summary.closed, color: '#71717a' },
  ].filter((item) => item.value > 0);

  const total = summary.total;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(0) : 0;
      return (
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/95 p-3 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: data.payload.color }}
            />
            <span className="text-xs font-medium text-zinc-300">{data.name}</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-lg font-bold text-white">{data.value} tiket</span>
            <span className="text-xs text-zinc-400">({percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ChartIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Distribusi Status Tiket</h3>
            <p className="text-xs text-zinc-400">Proporsi status tiket Anda</p>
          </div>
        </div>
        <span className="text-xs font-medium text-zinc-400 bg-zinc-850 px-2.5 py-1 rounded-full border border-zinc-800">
          Total: {total}
        </span>
      </div>

      {total === 0 ? (
        <div className="flex h-48 items-center justify-center text-xs text-zinc-500">
          Belum ada tiket untuk ditampilkan
        </div>
      ) : (
        <div className="h-60 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-zinc-400 ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
