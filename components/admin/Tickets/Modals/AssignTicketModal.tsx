import React, { useState } from 'react';
import { ManagedUser } from '@/types/helpdesk';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { X, UserCheck, Send, AlertCircle, UserX } from 'lucide-react';

interface AssignTicketModalProps {
  isOpen: boolean;
  ticketNumber: string;
  currentAssigneeName?: string;
  activeSupportUsers: ManagedUser[];
  onClose: () => void;
  onSubmit: (assignee: ManagedUser | null, reason?: string) => void;
}

export const AssignTicketModal: React.FC<AssignTicketModalProps> = ({
  isOpen,
  ticketNumber,
  currentAssigneeName,
  activeSupportUsers,
  onClose,
  onSubmit,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(
    activeSupportUsers[0]?.id || ''
  );
  const [isUnassign, setIsUnassign] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const targetUser = activeSupportUsers.find((u) => u.id === selectedUserId) || null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleExecuteAssign = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      if (isUnassign) {
        onSubmit(null, reason.trim() || 'Dibatalkan penugasannya oleh Administrator.');
      } else {
        onSubmit(targetUser, reason.trim());
      }
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
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Penugasan Teknisi (Assignment)</h3>
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
              <span className="text-zinc-400">Penanggung Jawab Saat Ini:</span>
              <span className="font-semibold text-zinc-200">
                {currentAssigneeName || 'Belum Ditugaskan (Unassigned)'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Pilih Teknisi IT Support Aktif
                </label>
                <button
                  type="button"
                  onClick={() => setIsUnassign(!isUnassign)}
                  className={`text-[11px] font-medium transition-colors ${
                    isUnassign ? 'text-purple-400 font-bold' : 'text-zinc-500 hover:text-rose-400'
                  }`}
                >
                  {isUnassign ? '✓ Batalkan Unassign (Pilih Teknisi)' : 'Batalkan Penugasan (Unassign)'}
                </button>
              </div>

              {!isUnassign ? (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                >
                  {activeSupportUsers.map((su) => (
                    <option key={su.id} value={su.id}>
                      {su.name} ({su.email}) - {su.department}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300 flex items-center gap-2">
                  <UserX className="h-4 w-4 shrink-0" />
                  <span>Tiket akan dikembalikan ke status Open tanpa penanggung jawab.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Alasan Penugasan / Reassign (Opsional)
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Contoh: Pengalihan beban kerja karena teknisi sebelumnya sedang menangani kendala server di lantai 2..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all resize-none"
              />
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
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSubmitting ? 'Menyimpan...' : isUnassign ? 'Batalkan Penugasan' : 'Simpan Penugasan'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Assign/Unassign Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={isUnassign ? 'Konfirmasi Pembatalan Penugasan (Unassign)' : 'Konfirmasi Penugasan Teknisi'}
        description={
          <div>
            {isUnassign ? (
              <>
                <p>
                  Apakah Anda yakin ingin melepas penugasan teknisi pada tiket <strong>{ticketNumber}</strong>?
                </p>
                <p className="mt-2 text-rose-400 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  ⚠️ Tiket akan kembali ke antrean Open tanpa penanggung jawab teknisi.
                </p>
              </>
            ) : (
              <>
                <p>
                  Tugaskan penanganan tiket <strong>{ticketNumber}</strong> kepada teknisi{' '}
                  <strong className="text-purple-400">{targetUser?.name}</strong>?
                </p>
                {reason && (
                  <p className="mt-2 text-xs text-zinc-400 bg-zinc-850 p-2.5 rounded-lg border border-zinc-700">
                    Catatan: &ldquo;{reason}&rdquo;
                  </p>
                )}
              </>
            )}
          </div>
        }
        confirmText={isUnassign ? 'Ya, Unassign Tiket' : 'Ya, Tugaskan'}
        cancelText="Periksa Kembali"
        variant={isUnassign ? 'danger' : 'info'}
        icon={isUnassign ? <UserX className="h-6 w-6 text-rose-400" /> : <UserCheck className="h-6 w-6 text-purple-400" />}
        isLoading={isSubmitting}
        onConfirm={handleExecuteAssign}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
};
