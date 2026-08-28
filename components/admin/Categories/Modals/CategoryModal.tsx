import React, { useState, useEffect } from 'react';
import { CategoryInfo } from '@/types/helpdesk';
import { X, Layers, Save, AlertCircle, Plus, Trash2 } from 'lucide-react';

interface CategoryModalProps {
  isOpen: boolean;
  categoryToEdit?: CategoryInfo | null;
  onClose: () => void;
  onSubmit: (catData: { name: string; subcategories: string[]; active: boolean }) => void;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  categoryToEdit,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setSubcategories([...categoryToEdit.subcategories]);
      setActive(categoryToEdit.active !== false);
    } else {
      setName('');
      setSubcategories([]);
      setActive(true);
    }
    setNewSubcatInput('');
    setError('');
  }, [categoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSubcat = () => {
    if (!newSubcatInput.trim()) return;
    if (subcategories.includes(newSubcatInput.trim())) {
      setError('Subkategori sudah ada dalam daftar.');
      return;
    }
    setSubcategories([...subcategories, newSubcatInput.trim()]);
    setNewSubcatInput('');
    setError('');
  };

  const handleRemoveSubcat = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Nama kategori utama wajib diisi.');
      return;
    }
    if (subcategories.length === 0) {
      setError('Tambahkan minimal 1 subkategori.');
      return;
    }

    onSubmit({
      name: name.trim(),
      subcategories,
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {categoryToEdit ? 'Edit Taksonomi Kategori' : 'Tambah Kategori Baru'}
              </h3>
              <p className="text-xs text-zinc-400">Klasifikasi masalah & permohonan tiket helpdesk</p>
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
              Nama Kategori Utama <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Cloud Infrastructure & Server"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Daftar Subkategori <span className="text-rose-400">*</span>
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubcatInput}
                onChange={(e) => setNewSubcatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubcat();
                  }
                }}
                placeholder="Ketik subkategori lalu tekan Tambah..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-850 px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubcat}
                className="inline-flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-750 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah</span>
              </button>
            </div>

            {/* List Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {subcategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-850 border border-zinc-750 px-2.5 py-1 text-xs text-zinc-200"
                >
                  <span>{sub}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcat(idx)}
                    className="text-zinc-500 hover:text-rose-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeCat"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-850 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="activeCat" className="text-xs text-zinc-300 font-medium cursor-pointer">
              Kategori Aktif (Dapat dipilih requester saat pembuatan tiket)
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
              <span>{categoryToEdit ? 'Simpan' : 'Buat Kategori'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
