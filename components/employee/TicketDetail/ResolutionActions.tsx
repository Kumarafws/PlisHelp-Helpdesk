import React, { useState } from 'react';
import { Ticket, TicketRating } from '@/types/helpdesk';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CheckCircle2, RefreshCw, Star, Send, ShieldCheck, AlertCircle } from 'lucide-react';

interface ResolutionActionsProps {
  ticket: Ticket;
  onCloseTicket: () => void;
  onReopenTicket: (reason: string) => void;
  onSubmitRating: (rating: TicketRating) => void;
}

export const ResolutionActions: React.FC<ResolutionActionsProps> = ({
  ticket,
  onCloseTicket,
  onReopenTicket,
  onSubmitRating,
}) => {
  const [showReopenInput, setShowReopenInput] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [selectedScore, setSelectedScore] = useState<number>(ticket.rating?.score || 5);
  const [hoverScore, setHoverScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(ticket.rating?.feedback || '');
  const [isRatingSubmitted, setIsRatingSubmitted] = useState<boolean>(!!ticket.rating);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const [isReopenConfirmOpen, setIsReopenConfirmOpen] = useState(false);

  // When ticket is RESOLVED: Show resolution confirmation card
  if (ticket.status === 'RESOLVED') {
    return (
      <>
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/25 via-zinc-900/90 to-zinc-900/90 p-5 sm:p-6 shadow-xl shadow-emerald-950/10">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-white">Konfirmasi Penyelesaian Tiket (Confirm Resolution)</h3>
              <p className="mt-1 text-sm text-zinc-300">
                Tim IT Support telah menandai permohonan/kendala ini sebagai <strong className="text-emerald-400">Resolved</strong>.
              </p>
              {ticket.resolutionSummary && (
                <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-950/30 p-3.5 text-xs text-zinc-200">
                  <span className="font-semibold text-emerald-400">Ringkasan Solusi IT Support:</span>
                  <p className="mt-1 leading-relaxed text-zinc-300">{ticket.resolutionSummary}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-zinc-800/80">
                <p className="text-sm font-medium text-zinc-200 mb-3">
                  Apakah permasalahan Anda sudah terselesaikan dengan baik?
                </p>

                {!showReopenInput ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCloseConfirmOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Ya, Tutup Tiket (Close Ticket)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReopenInput(true)}
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Belum, Buka Kembali (Reopen)</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-850 p-4 animate-in fade-in duration-150">
                    <label className="block text-xs font-medium text-zinc-300">
                      Sampaikan alasan kendala yang masih dialami:
                    </label>
                    <textarea
                      rows={2}
                      value={reopenReason}
                      onChange={(e) => setReopenReason(e.target.value)}
                      placeholder="Contoh: Wi-Fi masih terputus saat berada di ruang rapat tim..."
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-900 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReopenInput(false)}
                        className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        disabled={!reopenReason.trim()}
                        onClick={() => setIsReopenConfirmOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 disabled:opacity-50 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Kirim & Reopen Tiket</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Close Ticket Dialog */}
        <ConfirmDialog
          isOpen={isCloseConfirmOpen}
          title="Konfirmasi Penutupan Tiket"
          description={
            <div>
              <p>
                Apakah Anda yakin ingin menutup tiket <strong>{ticket.number}</strong> secara resmi?
              </p>
              <p className="mt-2 text-zinc-400 text-xs bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-500/20">
                ✅ Tiket akan berstatus <strong className="text-emerald-400">CLOSED</strong>. Setelah ditutup, Anda dapat memberikan penilaian bintang & ulasan performa penanganan IT Support.
              </p>
            </div>
          }
          confirmText="Ya, Tutup Tiket Sekarang"
          cancelText="Belum, Periksa Lagi"
          variant="success"
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-400" />}
          onConfirm={() => {
            setIsCloseConfirmOpen(false);
            onCloseTicket();
          }}
          onCancel={() => setIsCloseConfirmOpen(false)}
        />

        {/* Confirm Reopen Ticket Dialog */}
        <ConfirmDialog
          isOpen={isReopenConfirmOpen}
          title="Buka Kembali Tiket (Reopen)"
          description={
            <div>
              <p>
                Tiket <strong>{ticket.number}</strong> akan dikembalikan ke status{' '}
                <strong className="text-amber-400">IN_PROGRESS</strong> untuk ditangani lebih lanjut oleh tim IT Support.
              </p>
              <p className="mt-2 text-xs text-zinc-300 bg-zinc-800 p-2.5 rounded-lg border border-zinc-700">
                Alasan: &ldquo;{reopenReason}&rdquo;
              </p>
            </div>
          }
          confirmText="Ya, Buka Kembali Tiket"
          cancelText="Batal"
          variant="warning"
          icon={<RefreshCw className="h-6 w-6 text-orange-400" />}
          onConfirm={() => {
            setIsReopenConfirmOpen(false);
            onReopenTicket(reopenReason);
          }}
          onCancel={() => setIsReopenConfirmOpen(false)}
        />
      </>
    );
  }

  // When ticket is CLOSED: Show rating/feedback box (Section 17)
  if (ticket.status === 'CLOSED') {
    const starLabels = [
      'Sangat Tidak Puas',
      'Tidak Puas',
      'Cukup / Netral',
      'Puas',
      'Sangat Puas',
    ];

    const currentScore = hoverScore || selectedScore;

    return (
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Penilaian Layanan (Support Rating)</h3>
            <p className="text-xs text-zinc-400">Bagaimana kualitas bantuan IT Support pada tiket ini?</p>
          </div>
        </div>

        {isRatingSubmitted ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-850/60 p-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= (ticket.rating?.score || selectedScore)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-zinc-200">
                {starLabels[(ticket.rating?.score || selectedScore) - 1]}
              </span>
            </div>
            {ticket.rating?.feedback && (
              <p className="mt-2 text-xs text-zinc-400 italic">
                "{ticket.rating.feedback}"
              </p>
            )}
            <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Feedback telah tersimpan dan membantu evaluasi performa tim IT.</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedScore(star)}
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(null)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        star <= currentScore
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-medium text-amber-400">
                {starLabels[currentScore - 1]}
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Komentar / Masukan Tambahan (Opsional)
              </label>
              <textarea
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tulis ulasan pengalaman Anda terhadap kecepatan atau keramahan teknisi IT..."
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                const newRating: TicketRating = {
                  score: selectedScore,
                  feedback: feedback.trim() || undefined,
                  createdAt: new Date().toISOString(),
                };
                onSubmitRating(newRating);
                setIsRatingSubmitted(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-semibold text-zinc-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirim Penilaian (Submit Feedback)</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
};
