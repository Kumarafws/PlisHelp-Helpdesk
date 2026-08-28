import React, { useState, useEffect } from 'react';
import { ManagedUser, TicketRole, DepartmentInfo } from '@/types/helpdesk';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  userToEdit?: ManagedUser | null;
  departments: DepartmentInfo[];
  onClose: () => void;
  onSubmit: (userData: {
    name: string;
    email: string;
    role: TicketRole;
    department: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) => void;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  userToEdit,
  departments,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TicketRole>('Employee');
  const [department, setDepartment] = useState(departments[0]?.name || 'Marketing & Communications');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRole(userToEdit.role);
      setDepartment(userToEdit.department);
      setStatus(userToEdit.status);
    } else {
      setName('');
      setEmail('');
      setRole('Employee');
      setDepartment(departments[0]?.name || 'Marketing & Communications');
      setStatus('ACTIVE');
    }
    setError('');
  }, [userToEdit, isOpen, departments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Nama lengkap dan email wajib diisi.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Format email tidak valid.');
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {userToEdit ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <p className="text-xs text-zinc-400">Atur hak akses, unit kerja, dan status akun</p>
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
              Nama Lengkap <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rian Anggara"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Perusahaan <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rian@plishelp.co.id"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Role Akses
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="Employee">Employee (Requester)</option>
                <option value="IT Support">IT Support (Resolver)</option>
                <option value="Admin">IT Admin (Administrator)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Status Akun
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                <option value="ACTIVE">ACTIVE (Aktif)</option>
                <option value="INACTIVE">INACTIVE (Non-aktif)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Departemen / Unit Kerja
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-850 p-3 text-xs sm:text-sm text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
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
              <span>{userToEdit ? 'Simpan Perubahan' : 'Buat Pengguna'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
