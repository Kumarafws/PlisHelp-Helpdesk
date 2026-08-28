import React, { useState, useEffect } from 'react';
import { CategoryInfo, TicketPriority, TicketType, TicketAttachment } from '@/types/helpdesk';
import { CATEGORIES_DATA } from '@/services/mockTicketService';
import { 
  X, 
  Upload, 
  FileText, 
  AlertCircle, 
  Sparkles, 
  Paperclip, 
  Check, 
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  categories?: CategoryInfo[];
  onClose: () => void;
  onSubmit: (newTicketData: {
    title: string;
    description: string;
    type: TicketType;
    category: string;
    subcategory: string;
    priority: TicketPriority;
    attachments: TicketAttachment[];
  }) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  categories = CATEGORIES_DATA,
  onClose,
  onSubmit,
}) => {
  const activeCategories = categories.filter((c) => c.active !== false);
  const defaultCategory = activeCategories[0] || CATEGORIES_DATA[0];

  const [ticketType, setTicketType] = useState<TicketType>('Incident');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory.name);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    defaultCategory.subcategories[0] || ''
  );
  const [priority, setPriority] = useState<TicketPriority>('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update subcategory options whenever category changes
  const activeCategoryObj =
    activeCategories.find((c) => c.name === selectedCategory) || defaultCategory;

  useEffect(() => {
    if (activeCategoryObj && activeCategoryObj.subcategories.length > 0) {
      if (!activeCategoryObj.subcategories.includes(selectedSubcategory)) {
        setSelectedSubcategory(activeCategoryObj.subcategories[0]);
      }
    }
  }, [selectedCategory, activeCategoryObj, selectedSubcategory]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check max file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, file: 'Ukuran file melebihi batas maksimal 10MB' }));
      return;
    }

    const fileSizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    const newAtt: TicketAttachment = {
      id: `att-${Date.now()}`,
      fileName: file.name,
      fileSize: fileSizeFormatted,
      fileType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };

    setAttachments((prev) => [...prev, newAtt]);
    setErrors((prev) => {
      const rest = { ...prev };
      delete rest.file;
      return rest;
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Judul tiket wajib diisi';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Judul tiket minimal 5 karakter';
    }

    if (!description.trim()) {
      newErrors.description = 'Deskripsi permasalahan wajib diisi';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Berikan deskripsi detail minimal 15 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        type: ticketType,
        category: selectedCategory,
        subcategory: selectedSubcategory,
        priority,
        attachments,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/80 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Buat Tiket Baru (Create Ticket)</h2>
              <p className="text-xs text-zinc-400">
                Sampaikan kendala atau permohonan layanan IT kepada tim IT Support
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Ticket Type Radio Group */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Tipe Permohonan (Ticket Type) <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  ticketType === 'Incident'
                    ? 'border-blue-500/60 bg-blue-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="ticketType"
                  value="Incident"
                  checked={ticketType === 'Incident'}
                  onChange={() => setTicketType('Incident')}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Incident</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Kerusakan, error, atau gangguan pada sistem/perangkat
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all ${
                  ticketType === 'Service Request'
                    ? 'border-blue-500/60 bg-blue-500/10 text-white'
                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="ticketType"
                  value="Service Request"
                  checked={ticketType === 'Service Request'}
                  onChange={() => setTicketType('Service Request')}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Service Request</div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Permintaan lisensi baru, instalasi software, akses folder
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Kategori (Category) <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {activeCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Subkategori (Subcategory) <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {activeCategoryObj.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Tingkat Urgensi / Prioritas (Priority) <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as TicketPriority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  LOW: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
                  MEDIUM: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
                  HIGH: 'border-amber-500/40 text-amber-300 bg-amber-500/10',
                  URGENT: 'border-rose-500/50 text-rose-300 bg-rose-500/15',
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                      isSelected
                        ? `${colors[p]} ring-1 ring-offset-1 ring-offset-zinc-900`
                        : 'border-zinc-800 bg-zinc-850/50 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Judul Tiket (Title) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Laptop tidak bisa connect ke Wi-Fi kantor"
              className={`w-full rounded-xl border bg-zinc-850 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all ${
                errors.title
                  ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                  : 'border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Deskripsi Masalah / Permohonan (Description) <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan secara detail kendala yang dialami, pesan error yang muncul, atau rincian aplikasi yang dibutuhkan..."
              className={`w-full rounded-xl border bg-zinc-850 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all ${
                errors.description
                  ? 'border-rose-500/80 focus:ring-1 focus:ring-rose-500'
                  : 'border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Lampiran Pendukung (Attachment)
            </label>
            <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-850/40 p-4 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/png,image/jpeg,image/jpg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Upload className="h-3.5 w-3.5 text-blue-400" />
                <span>Pilih File dari Komputer</span>
              </label>
              <p className="mt-2 text-xs text-zinc-500">
                Format didukung: PNG, JPG, PDF, DOCX (Maksimal 10MB)
              </p>
              {errors.file && (
                <p className="mt-1 text-xs text-rose-400 flex items-center justify-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {errors.file}
                </p>
              )}
            </div>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-850 p-2.5 text-xs text-zinc-300"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="truncate font-medium">{att.fileName}</span>
                      <span className="text-zinc-500">({att.fileSize})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-transparent px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <span>Mengirim Tiket...</span>
              ) : (
                <>
                  <span>Kirim Tiket (Submit)</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
