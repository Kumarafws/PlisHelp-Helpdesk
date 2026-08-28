import React, { useState, useMemo } from 'react';
import { ManagedUser, DepartmentInfo, TicketRole } from '@/types/helpdesk';
import { UserModal } from './Modals/UserModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/employee/EmptyState';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  ShieldCheck,
  Headphones,
  UserRound,
  CheckCircle2,
  XCircle,
  Building,
} from 'lucide-react';

interface AdminUsersViewProps {
  users: ManagedUser[];
  departments: DepartmentInfo[];
  initialRoleFilter?: string;
  onSaveUser: (userData: {
    id?: string;
    name: string;
    email: string;
    role: TicketRole;
    department: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) => void;
  onToggleStatus: (userId: string) => void;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({
  users,
  departments,
  initialRoleFilter = 'ALL',
  onSaveUser,
  onToggleStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>(initialRoleFilter);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<ManagedUser | null>(null);
  const [userToToggle, setUserToToggle] = useState<ManagedUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.department.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      return true;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleEditClick = (u: ManagedUser) => {
    setUserToEdit(u);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen User & Role</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
              {filteredUsers.length} pengguna
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Kelola akun karyawan, teknisi IT Support, dan administrator helpdesk
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/25 hover:from-purple-500 hover:to-indigo-500 transition-all self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, atau departemen..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-850 px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="ALL">Semua Role</option>
            <option value="Employee">Employee</option>
            <option value="IT Support">IT Support</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-zinc-700 bg-zinc-850 px-3 py-2 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif (Active)</option>
            <option value="INACTIVE">Non-Aktif (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          title="Tidak ada pengguna yang cocok"
          description="Ubah filter pencarian atau buat pengguna baru dengan tombol di atas."
        />
      ) : (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-850/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Pengguna</th>
                  <th className="px-4 py-3.5">Departemen</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Terdaftar</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {filteredUsers.map((u) => {
                  const isSupport = u.role === 'IT Support';
                  const isAdmin = u.role === 'Admin';
                  const isActive = u.status === 'ACTIVE';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs shadow-sm ${
                              isAdmin
                                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                                : isSupport
                                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-zinc-100 truncate">{u.name}</div>
                            <div className="text-[11px] text-zinc-500 truncate">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-zinc-300">{u.department}</span>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border ${
                            isAdmin
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                              : isSupport
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          }`}
                        >
                          {isAdmin ? (
                            <ShieldCheck className="h-3 w-3" />
                          ) : isSupport ? (
                            <Headphones className="h-3 w-3" />
                          ) : (
                            <UserRound className="h-3 w-3" />
                          )}
                          <span>{u.role}</span>
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setUserToToggle(u)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                            isActive
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/30'
                              : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-emerald-500/10 hover:text-emerald-400'
                          }`}
                          title="Klik untuk ubah status"
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? 'bg-emerald-400' : 'bg-zinc-500'
                            }`}
                          />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td className="px-4 py-4 text-zinc-400 text-[11px]">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleEditClick(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-300 transition-colors"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        userToEdit={userToEdit}
        departments={departments}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(userData) => {
          onSaveUser({
            ...userData,
            id: userToEdit ? userToEdit.id : undefined,
          });
        }}
      />

      {/* Confirm Status Toggle Dialog */}
      {userToToggle && (
        <ConfirmDialog
          isOpen={!!userToToggle}
          title={userToToggle.status === 'ACTIVE' ? 'Nonaktifkan Akun Pengguna' : 'Aktifkan Akun Pengguna'}
          description={
            <div>
              <p>
                Apakah Anda yakin ingin {userToToggle.status === 'ACTIVE' ? 'menonaktifkan' : 'mengaktifkan kembali'}{' '}
                akun <strong>{userToToggle.name}</strong> ({userToToggle.role})?
              </p>
              {userToToggle.status === 'ACTIVE' ? (
                <p className="mt-2 text-rose-400 text-xs bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                  ⚠️ Pengguna tidak akan dapat masuk ke sistem helpdesk dan menerima penugasan tiket baru selama status nonaktif.
                </p>
              ) : (
                <p className="mt-2 text-zinc-400 text-xs">
                  Pengguna akan dapat masuk kembali ke sistem helpdesk dan beraktivitas sesuai rolenya.
                </p>
              )}
            </div>
          }
          confirmText={userToToggle.status === 'ACTIVE' ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan'}
          cancelText="Batal"
          variant={userToToggle.status === 'ACTIVE' ? 'danger' : 'info'}
          onConfirm={() => {
            if (userToToggle) {
              onToggleStatus(userToToggle.id);
              setUserToToggle(null);
            }
          }}
          onCancel={() => setUserToToggle(null)}
        />
      )}
    </div>
  );
};
