import React, { useState } from 'react';
import { X, HelpCircle, Send, AlertCircle } from 'lucide-react';

interface RequestInfoModalProps {
  isOpen: boolean;
  ticketNumber: string;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

export const RequestInfoModal: React.FC<RequestInfoModalProps> = ({
  isOpen,
  ticketNumber,
  onClose,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Pesan permintaan informasi wajib diisi.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Berikan penjelasan detail minimal 10 karakter.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(message.trim());
      setMessage('');
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Minta Informasi Tambahan</h3>
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
              Pesan untuk Requester (Employee) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setError('');
              }}
              placeholder="Contoh: Mohon informasikan MAC Address Wi-Fi atau kirimkan screenshot pesan error yang muncul..."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all resize-none"
            />
            {error && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
            <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
              Status tiket akan berubah menjadi <strong className="text-orange-400">NEED_INFO</strong> dan SLA penghitungan akan di-pause sampai requester memberikan balasan.
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-orange-500/20 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Mengirim...' : 'Kirim Permintaan Info'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
