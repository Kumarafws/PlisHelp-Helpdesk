import React, { useState } from 'react';
import { TicketStatus } from '@/types/helpdesk';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { X, ShieldAlert, AlertCircle, Check } from 'lucide-react';

interface OverrideStatusModalProps {
  isOpen: boolean;
  ticketNumber: string;
  currentStatus: TicketStatus;
  onClose: () => void;
  onSubmit: (newStatus: TicketStatus, overrideReason: string) => void;
}

export const OverrideStatusModal: React.FC<OverrideStatusModalProps> = ({
  isOpen,
  ticketNumber,
  currentStatus,
  onClose,
  onSubmit,
}) => {
  const [newStatus, setNewStatus] = useState<TicketStatus>('IN_PROGRESS');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const validStatuses: TicketStatus[] = [
    'OPEN',
    'IN_PROGRESS',
    'NEED_INFO',
    'ESCALATED',
    'RESOLVED',
    'CLOSED',
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Alasan override administratif wajib diisi untuk audit log.');
      return;
    }
    if (reason.trim().length < 10) {
      setError('Tuliskan alasan override minimal 10 karakter.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleExecuteOverride = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(newStatus, reason.trim());
      setIsSubmitting(false);
      setIsConfirmOpen(false);
      onClose();
    }, 250);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Override Status Administratif</h3>
                <p className="text-xs text-zinc-400 font-mono">{ticketNumber}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-850/50 p-3 text-xs flex justify-between items-center">
              <span className="text-zinc-400">Status Saat Ini:</span>
              <span className="font-bold text-zinc-200">{currentStatus}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Pilih Status Baru
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                {validStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Alasan Override (Mandatory Audit Log) <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError('');
                }}
                placeholder="Contoh: Koreksi status karena kesalahan teknis penutupan tiket oleh resolver..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none"
              />
              {error && (
                <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-zinc-700 bg-transparent px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-600/25 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition-all"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Memproses...' : 'Terapkan Override'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Override Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Konfirmasi Override Status Tiket"
        description={
          <div>
            <p>
              Apakah Anda yakin ingin mengubah status tiket <strong>{ticketNumber}</strong> dari{' '}
              <span className="font-semibold text-zinc-200">{currentStatus}</span> menjadi{' '}
              <span className="font-semibold text-amber-400">{newStatus}</span>?
            </p>
            <p className="mt-2 text-xs text-zinc-400 bg-zinc-800/60 p-2.5 rounded-lg border border-zinc-700">
              Alasan: &ldquo;{reason}&rdquo;
            </p>
          </div>
        }
        confirmText="Ya, Override Status"
        cancelText="Periksa Kembali"
        variant="warning"
        icon={<ShieldAlert className="h-6 w-6 text-amber-400" />}
        isLoading={isSubmitting}
        onConfirm={handleExecuteOverride}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
