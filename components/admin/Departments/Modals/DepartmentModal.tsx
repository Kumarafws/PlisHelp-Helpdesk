import React, { useState, useEffect } from 'react';
import { DepartmentInfo } from '@/types/helpdesk';
import { X, Building, Save, AlertCircle } from 'lucide-react';

interface DepartmentModalProps {
  isOpen: boolean;
  deptToEdit?: DepartmentInfo | null;
  onClose: () => void;
  onSubmit: (deptData: { name: string; code: string; active: boolean }) => void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({
  isOpen,
  deptToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (deptToEdit) {
      setName(deptToEdit.name);
      setCode(deptToEdit.code);
      setActive(deptToEdit.active);
    } else {
      setName('');
      setCode('');
      setActive(true);
    }
    setError('');
  }, [deptToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      setError('Nama departemen dan kode singkatan wajib diisi.');
      return;
    }

    onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {deptToEdit ? 'Edit Departemen' : 'Tambah Departemen Baru'}
              </h3>
              <p className="text-xs text-zinc-400">Master unit kerja organisasi perusahaan</p>
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
              Nama Departemen <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Legal & Compliance"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Kode Singkatan <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Contoh: LEGAL"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 uppercase focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeDept"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-850 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="activeDept" className="text-xs text-zinc-300 font-medium cursor-pointer">
              Departemen Aktif (Dapat dipilih pada pembuatan tiket)
            </label>
          </div>

          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </p>
          )}

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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{deptToEdit ? 'Simpan' : 'Buat Departemen'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
