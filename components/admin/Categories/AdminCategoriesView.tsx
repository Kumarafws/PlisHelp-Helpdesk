import React, { useState } from 'react';
import { CategoryInfo } from '@/types/helpdesk';
import { CategoryModal } from './Modals/CategoryModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Layers, Plus, Edit2, CheckCircle2, Search, Tag } from 'lucide-react';

interface AdminCategoriesViewProps {
  categories: CategoryInfo[];
  onSaveCategory: (catData: { id?: string; name: string; subcategories: string[]; active: boolean }) => void;
  onToggleStatus: (catId: string) => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  categories,
  onSaveCategory,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryInfo | null>(null);
  const [catToToggle, setCatToToggle] = useState<CategoryInfo | null>(null);

  const filteredCategories = categories.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchName = c.name.toLowerCase().includes(q);
    const matchSub = c.subcategories.some((s) => s.toLowerCase().includes(q));
    return matchName || matchSub;
  });

  const handleEditClick = (c: CategoryInfo) => {
    setCategoryToEdit(c);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Kategori & Subkategori</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
              {categories.length} taksonomi
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola pengelompokan jenis kendala dan permintaan layanan helpdesk
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-md">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori atau subkategori masalah..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCategories.map((c) => {
          const isActive = c.active !== false;

          return (
            <div
              key={c.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCatToToggle(c)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-300'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                    }`}
                    title="Klik untuk ubah status"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                    <span>{isActive ? 'Aktif' : 'Non-Aktif'}</span>
                  </button>
                </div>

                {/* Subcategories Tags */}
                <div>
                  <div className="text-xs text-zinc-400 mb-2 font-medium">Subkategori Terdaftar:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subcategories.map((sub, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-850 px-2.5 py-1 text-xs text-zinc-300 border border-zinc-750"
                      >
                        <Tag className="h-3 w-3 text-purple-400" />
                        <span>{sub}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleEditClick(c)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Taksonomi</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        categoryToEdit={categoryToEdit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(catData) => {
          onSaveCategory({
            ...catData,
            id: categoryToEdit ? categoryToEdit.id : undefined,
          });
        }}
      />

      {/* Confirm Category Toggle Dialog */}
      {catToToggle && (
        <ConfirmDialog
          isOpen={!!catToToggle}
          title={catToToggle.active !== false ? 'Nonaktifkan Kategori' : 'Aktifkan Kategori'}
          description={
            <div>
              <p>
                Apakah Anda yakin ingin {catToToggle.active !== false ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
                kategori <strong>{catToToggle.name}</strong>?
              </p>
              {catToToggle.active !== false ? (
                <p className="mt-2 text-rose-400 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  ⚠️ Seluruh subkategori ({catToToggle.subcategories.join(', ')}) tidak akan dapat dipilih pada form pembuatan tiket baru.
                </p>
              ) : (
                <p className="mt-2 text-zinc-400 text-xs">
                  Kategori dan subkategorinya akan dapat dipilih kembali oleh karyawan saat membuat tiket.
                </p>
              )}
            </div>
          }
          confirmText={catToToggle.active !== false ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
          cancelText="Batal"
          variant={catToToggle.active !== false ? 'danger' : 'info'}
          onConfirm={() => {
            if (catToToggle) {
              onToggleStatus(catToToggle.id);
              setCatToToggle(null);
            }
          }}
          onCancel={() => setCatToToggle(null)}
        />
      )}
    </div>
  );
};
