import React, { useState } from 'react';
import { SLAPolicyItem, TicketPriority } from '@/types/helpdesk';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Clock, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface AdminSLAManagementViewProps {
  policies: SLAPolicyItem[];
  onSavePolicies: (updatedPolicies: SLAPolicyItem[]) => void;
}

export const AdminSLAManagementView: React.FC<AdminSLAManagementViewProps> = ({
  policies,
  onSavePolicies,
}) => {
  const [localPolicies, setLocalPolicies] = useState<SLAPolicyItem[]>(policies);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);

  const handleValueChange = (
    id: string,
    field: 'responseTargetMinutes' | 'resolutionTargetHours' | 'description',
    value: any
  ) => {
    setLocalPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    setSaveSuccess(false);
  };

  const handleExecuteSave = () => {
    onSavePolicies(localPolicies);
    setIsConfirmSaveOpen(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Kebijakan SLA (Service Level Agreement)</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Konfigurasi target batas waktu respons awal dan penyelesaian kendala berdasarkan tingkat urgensi
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsConfirmSaveOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all self-start sm:self-auto"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Kebijakan SLA</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Kebijakan SLA berhasil diperbarui ke seluruh sistem helpdesk.</span>
        </div>
      )}

      {/* SLA Policy Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-850/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Tingkat Prioritas</th>
                <th className="px-5 py-3.5">Target Response Time</th>
                <th className="px-5 py-3.5">Target Resolution Time</th>
                <th className="px-5 py-3.5">Deskripsi Panduan Urgensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
              {localPolicies.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <PriorityBadge priority={p.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="5"
                        max="1440"
                        value={p.responseTargetMinutes}
                        onChange={(e) =>
                          handleValueChange(p.id, 'responseTargetMinutes', parseInt(e.target.value) || 15)
                        }
                        className="w-24 rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-100 font-bold focus:border-purple-500 focus:outline-none"
                      />
                      <span className="text-zinc-400 font-medium">Menit</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="168"
                        value={p.resolutionTargetHours}
                        onChange={(e) =>
                          handleValueChange(p.id, 'resolutionTargetHours', parseInt(e.target.value) || 2)
                        }
                        className="w-24 rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-100 font-bold focus:border-purple-500 focus:outline-none"
                      />
                      <span className="text-zinc-400 font-medium">Jam</span>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <input
                      type="text"
                      value={p.description}
                      onChange={(e) => handleValueChange(p.id, 'description', e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-3 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 text-xs text-zinc-400 space-y-2">
        <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-purple-400" />
          <span>Aturan Penghitungan SLA (Business Rules):</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-zinc-400 pl-1 leading-relaxed">
          <li>
            <strong>Response Time:</strong> Dihitung sejak tiket dibuat hingga respons pertama atau penugasan teknisi.
          </li>
          <li>
            <strong>Resolution Time:</strong> Dihitung hingga tiket ditandai sebagai Resolved oleh IT Support.
          </li>
          <li>
            <strong>SLA Pause:</strong> Jika status tiket berubah menjadi <code className="text-orange-300">NEED_INFO</code>, penghitungan waktu resolusi otomatis dihentikan sementara hingga requester memberikan balasan.
          </li>
        </ul>
      </div>

      {/* Confirm Save SLA Dialog */}
      <ConfirmDialog
        isOpen={isConfirmSaveOpen}
        title="Simpan Kebijakan SLA Global"
        description={
          <div>
            <p>
              Apakah Anda yakin ingin menerapkan konfigurasi target Response Time dan Resolution Time SLA baru ke seluruh sistem helpdesk?
            </p>
            <p className="mt-2 text-zinc-400 text-xs bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-700">
              ℹ️ Kebijakan baru akan menjadi acuan penghitungan deadline dan indikator SLA tiket yang masuk ke sistem.
            </p>
          </div>
        }
        confirmText="Ya, Terapkan Kebijakan"
        cancelText="Periksa Kembali"
        variant="info"
        icon={<Save className="h-6 w-6 text-purple-400" />}
        onConfirm={handleExecuteSave}
        onCancel={() => setIsConfirmSaveOpen(false)}
      />
    </div>
  );
};
