import React, { useState } from 'react';
import { X, CheckCircle2, Send, AlertCircle } from 'lucide-react';

interface ResolveTicketModalProps {
  isOpen: boolean;
  ticketNumber: string;
  onClose: () => void;
  onSubmit: (resolutionSummary: string) => void;
}

export const ResolveTicketModal: React.FC<ResolveTicketModalProps> = ({
  isOpen,
  ticketNumber,
  onClose,
  onSubmit,
}) => {
  const [resolution, setResolution] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) {
      setError('Ringkasan solusi penanganan wajib diisi.');
      return;
    }
    if (resolution.trim().length < 15) {
      setError('Tuliskan ringkasan solusi dengan jelas minimal 15 karakter.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(resolution.trim());
      setResolution('');
      setError('');
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tandai Selesai (Resolve Ticket)</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Ringkasan Solusi / Tindakan Perbaikan (Resolution Summary) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={resolution}
              onChange={(e) => {
                setResolution(e.target.value);
                setError('');
              }}
              placeholder="Contoh: Konfigurasi DNS adapter telah dipulihkan ke gateway utama dan kabel HDMI diganti dengan kabel baru. Pengujian koneksi berhasil normal."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
            />
            {error && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
            <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
              Status tiket akan berubah menjadi <strong className="text-emerald-400">RESOLVED</strong>. Requester (Employee) akan menerima notifikasi untuk mengonfirmasi penutupan tiket (Close) atau membukanya kembali jika kendala masih berlanjut.
            </p>
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Memproses...' : 'Tandai Tiket Resolved'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
