import React, { useState, useMemo } from 'react';
import { Ticket, TicketPriority, TicketStatus, TicketType, SLAStatusType, ManagedUser, DepartmentInfo } from '@/types/helpdesk';
import { StatusBadge } from '@/components/employee/StatusBadge';
import { PriorityBadge } from '@/components/employee/PriorityBadge';
import { SLABadge } from '@/components/support/SLABadge';
import { EmptyState } from '@/components/employee/EmptyState';
import { AssignTicketModal } from './Modals/AssignTicketModal';
import {
  Search,
  RotateCcw,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ArrowUpRight,
  Building,
  Filter,
} from 'lucide-react';

interface AdminTicketListViewProps {
  tickets: Ticket[];
  departments: DepartmentInfo[];
  activeSupportUsers: ManagedUser[];
  onOpenTicket: (ticket: Ticket) => void;
  onAssignTicket: (ticketId: string, assignee: ManagedUser | null, reason?: string) => void;
}

export const AdminTicketListView: React.FC<AdminTicketListViewProps> = ({
  tickets,
  departments,
  activeSupportUsers,
  onOpenTicket,
  onAssignTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');
  const [slaFilter, setSlaFilter] = useState<SLAStatusType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRIORITY'>('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected ticket for assign modal
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNum = ticket.number.toLowerCase().includes(q);
          const matchTitle = ticket.title.toLowerCase().includes(q);
          const matchReq = ticket.requesterName.toLowerCase().includes(q);
          const matchDept = ticket.requesterDepartment.toLowerCase().includes(q);
          if (!matchNum && !matchTitle && !matchReq && !matchDept) return false;
        }

        if (statusFilter === 'UNASSIGNED') {
          if (ticket.assigneeName && ticket.assigneeName !== 'Belum Ditugaskan') return false;
        } else if (statusFilter !== 'ALL' && ticket.status !== statusFilter) {
          return false;
        }

        if (priorityFilter !== 'ALL' && ticket.priority !== priorityFilter) return false;
        if (typeFilter !== 'ALL' && ticket.type !== typeFilter) return false;
        if (categoryFilter !== 'ALL' && ticket.category !== categoryFilter) return false;

        if (departmentFilter !== 'ALL' && !ticket.requesterDepartment.includes(departmentFilter)) {
          return false;
        }

        if (assigneeFilter !== 'ALL') {
          if (assigneeFilter === 'UNASSIGNED' && ticket.assigneeName && ticket.assigneeName !== 'Belum Ditugaskan') {
            return false;
          }
          if (assigneeFilter !== 'UNASSIGNED' && !ticket.assigneeName?.includes(assigneeFilter)) {
            return false;
          }
        }

        if (slaFilter !== 'ALL' && ticket.slaInfo?.status !== slaFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'PRIORITY') {
          const score = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return score[b.priority] - score[a.priority];
        }
        return 0;
      });
  }, [
    tickets,
    searchQuery,
    statusFilter,
    priorityFilter,
    typeFilter,
    categoryFilter,
    departmentFilter,
    assigneeFilter,
    slaFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(start, start + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setPriorityFilter('ALL');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
    setDepartmentFilter('ALL');
    setAssigneeFilter('ALL');
    setSlaFilter('ALL');
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    categoryFilter !== 'ALL' ||
    departmentFilter !== 'ALL' ||
    assigneeFilter !== 'ALL' ||
    slaFilter !== 'ALL';

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Manajemen Seluruh Tiket</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
              {filteredTickets.length} tiket
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Daftar lengkap seluruh tiket kendala dan permohonan layanan helpdesk perusahaan
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 shadow-md space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nomor tiket, judul masalah, nama karyawan, atau departemen..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Dropdowns Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">Open</option>
              <option value="UNASSIGNED">Belum Ditugaskan</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NEED_INFO">Need Info</option>
              <option value="ESCALATED">Escalated</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Prioritas
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Kategori
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              {Array.from(new Set(tickets.map((t) => t.category).filter(Boolean))).map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Departemen
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua Dept</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name.split('&')[0].trim()}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Teknisi Assignee
            </label>
            <select
              value={assigneeFilter}
              onChange={(e) => {
                setAssigneeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua Teknisi</option>
              <option value="UNASSIGNED">Belum Ditugaskan</option>
              {activeSupportUsers.map((su) => (
                <option key={su.id} value={su.name}>
                  {su.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              SLA Status
            </label>
            <select
              value={slaFilter}
              onChange={(e) => {
                setSlaFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="ALL">Semua SLA</option>
              <option value="WITHIN_SLA">Within SLA</option>
              <option value="AT_RISK">At Risk</option>
              <option value="BREACHED">Breached</option>
              <option value="PAUSED">Paused</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-purple-500 focus:outline-none"
            >
              <option value="NEWEST">Terbaru</option>
              <option value="OLDEST">Terlama</option>
              <option value="PRIORITY">Prioritas Tertinggi</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
            <span className="text-zinc-400">Filter pencarian aktif</span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Ticket List */}
      {paginatedTickets.length === 0 ? (
        <EmptyState
          title="Tidak ada tiket yang cocok"
          description="Tidak ditemukan tiket dengan filter yang dipilih. Silakan ubah filter atau kata kunci pencarian Anda."
          actionLabel={hasActiveFilters ? 'Reset Filter' : undefined}
          onAction={hasActiveFilters ? resetFilters : undefined}
        />
      ) : (
        <div className="space-y-3">
          {paginatedTickets.map((ticket) => {
            const isUnassigned =
              ticket.status === 'OPEN' ||
              !ticket.assigneeName ||
              ticket.assigneeName === 'Belum Ditugaskan';

            return (
              <div
                key={ticket.id}
                className="group flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/20">
                      {ticket.number}
                    </span>
                    <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 border border-zinc-700/60">
                      {ticket.type}
                    </span>
                    <span className="text-xs text-zinc-400">{ticket.category}</span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs text-zinc-300">
                      Pemohon: <strong className="text-white">{ticket.requesterName}</strong> ({ticket.requesterDepartment})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <SLABadge
                      status={ticket.slaInfo?.status || (ticket.status === 'NEED_INFO' ? 'PAUSED' : 'WITHIN_SLA')}
                      remainingTime={ticket.slaInfo?.remainingTimeFormatted}
                      size="sm"
                    />
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} size="sm" />
                  </div>
                </div>

                <div className="cursor-pointer" onClick={() => onOpenTicket(ticket)}>
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-purple-300 transition-colors">
                    {ticket.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/70 text-xs text-zinc-400">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-zinc-500" />
                      Dibuat: {formatDate(ticket.createdAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-zinc-500" />
                      Penanggung Jawab:{' '}
                      <strong className={isUnassigned ? 'text-amber-400 font-normal' : 'text-purple-300 font-semibold'}>
                        {ticket.assigneeName || 'Belum Ditugaskan'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                      <button
                        type="button"
                        onClick={() => setSelectedTicketForAssign(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>{isUnassigned ? 'Assign' : 'Reassign'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onOpenTicket(ticket)}
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                    >
                      <span>Detail & Audit</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 px-2">
              <span className="text-xs text-zinc-400">
                Menampilkan halaman <strong className="text-zinc-200">{currentPage}</strong> dari{' '}
                <strong className="text-zinc-200">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-850 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-850 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Assign Modal */}
      {selectedTicketForAssign && (
        <AssignTicketModal
          isOpen={!!selectedTicketForAssign}
          ticketNumber={selectedTicketForAssign.number}
          currentAssigneeName={selectedTicketForAssign.assigneeName}
          activeSupportUsers={activeSupportUsers}
          onClose={() => setSelectedTicketForAssign(null)}
          onSubmit={(assignee, reason) => {
            onAssignTicket(selectedTicketForAssign.id, assignee, reason);
            setSelectedTicketForAssign(null);
          }}
        />
      )}
    </div>
  );
};
