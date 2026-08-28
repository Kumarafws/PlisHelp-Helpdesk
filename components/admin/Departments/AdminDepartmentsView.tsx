import React, { useState } from 'react';
import { DepartmentInfo } from '@/types/helpdesk';
import { DepartmentModal } from './Modals/DepartmentModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Building, Plus, Edit2, CheckCircle2, XCircle, Search } from 'lucide-react';

interface AdminDepartmentsViewProps {
  departments: DepartmentInfo[];
  onSaveDepartment: (deptData: { id?: string; name: string; code: string; active: boolean }) => void;
  onToggleStatus: (deptId: string) => void;
}

export const AdminDepartmentsView: React.FC<AdminDepartmentsViewProps> = ({
  departments,
  onSaveDepartment,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<DepartmentInfo | null>(null);
  const [deptToToggle, setDeptToToggle] = useState<DepartmentInfo | null>(null);

  const filteredDepts = departments.filter((d) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q);
  });

  const handleEditClick = (d: DepartmentInfo) => {
    setDeptToEdit(d);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setDeptToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Master Departemen</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
              {departments.length} unit
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola struktur divisi dan unit kerja perusahaan
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Departemen</span>
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
            placeholder="Cari nama atau kode singkatan departemen..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepts.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 shadow-md flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                  {d.code}
                </span>

                <button
                  type="button"
                  onClick={() => setDeptToToggle(d)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                    d.active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-300'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                  }`}
                  title="Klik untuk ubah status"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${d.active ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                  <span>{d.active ? 'Aktif' : 'Non-Aktif'}</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white mt-3">{d.name}</h3>
              <p className="text-xs text-zinc-400 mt-1">{d.employeeCount} karyawan terdaftar</p>
            </div>

            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleEditClick(d)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Departemen</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        deptToEdit={deptToEdit}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(deptData) => {
          onSaveDepartment({
            ...deptData,
            id: deptToEdit ? deptToEdit.id : undefined,
          });
        }}
      />

      {/* Confirm Department Toggle Dialog */}
      {deptToToggle && (
        <ConfirmDialog
          isOpen={!!deptToToggle}
          title={deptToToggle.active ? 'Nonaktifkan Departemen' : 'Aktifkan Departemen'}
          description={
            <div>
              <p>
                Apakah Anda yakin ingin {deptToToggle.active ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
                departemen <strong>{deptToToggle.name} ({deptToToggle.code})</strong>?
              </p>
              {deptToToggle.active ? (
                <p className="mt-2 text-rose-400 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  ⚠️ Departemen yang dinonaktifkan tidak akan muncul pada pilihan registrasi/formulir permohonan baru.
                </p>
              ) : (
                <p className="mt-2 text-zinc-400 text-xs">
                  Departemen akan aktif kembali dan dapat dipilih dalam seluruh formulir helpdesk.
                </p>
              )}
            </div>
          }
          confirmText={deptToToggle.active ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
          cancelText="Batal"
          variant={deptToToggle.active ? 'danger' : 'info'}
          onConfirm={() => {
            if (deptToToggle) {
              onToggleStatus(deptToToggle.id);
              setDeptToToggle(null);
            }
          }}
          onCancel={() => setDeptToToggle(null)}
        />
      )}
    </div>
  );
};
