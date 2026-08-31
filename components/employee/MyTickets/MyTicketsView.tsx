import React, { useState, useMemo } from 'react';
import { Ticket, TicketPriority, TicketStatus, TicketType } from '@/types/helpdesk';
import { StatusBadge } from '../StatusBadge';
import { PriorityBadge } from '../PriorityBadge';
import { EmptyState } from '../EmptyState';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface MyTicketsViewProps {
  tickets: Ticket[];
  initialStatusFilter?: TicketStatus | 'ALL';
  onOpenTicket: (ticket: Ticket) => void;
  onCreateTicket: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({
  tickets,
  initialStatusFilter = 'ALL',
  onOpenTicket,
  onCreateTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRIORITY'>('NEWEST');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((ticket) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchNumber = ticket.number.toLowerCase().includes(q);
          const matchTitle = ticket.title.toLowerCase().includes(q);
          const matchDesc = ticket.description.toLowerCase().includes(q);
          const matchCategory = ticket.category.toLowerCase().includes(q);
          if (!matchNumber && !matchTitle && !matchDesc && !matchCategory) return false;
        }

        // Status filter
        if (statusFilter !== 'ALL' && ticket.status !== statusFilter) return false;

        // Priority filter
        if (priorityFilter !== 'ALL' && ticket.priority !== priorityFilter) return false;

        // Type filter
        if (typeFilter !== 'ALL' && ticket.type !== typeFilter) return false;

        // Category filter
        if (categoryFilter !== 'ALL' && ticket.category !== categoryFilter) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'NEWEST') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'OLDEST') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'PRIORITY') {
          const score = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return score[b.priority] - score[a.priority];
        }
        return 0;
      });
  }, [tickets, searchQuery, statusFilter, priorityFilter, typeFilter, categoryFilter, sortBy]);

  // Pagination calculations
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
    setSortBy('NEWEST');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    statusFilter !== 'ALL' ||
    priorityFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    categoryFilter !== 'ALL';

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Tiket Saya (My Tickets)</h1>
            <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-zinc-300 border border-zinc-700">
              {filteredTickets.length} tiket
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-400">
            Daftar seluruh laporan kendala dan permohonan layanan IT Anda
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTicket}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Tiket Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 shadow-md space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nomor tiket (PH-...), judul, atau kata kunci permasalahan..."
            className="w-full rounded-xl border border-zinc-700/80 bg-zinc-850 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {/* Status filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="NEED_INFO">Need Info</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
              <option value="REOPENED">Reopened</option>
            </select>
          </div>

          {/* Priority filter */}
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Semua Prioritas</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Tipe
            </label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Semua Tipe</option>
              <option value="Incident">Incident</option>
              <option value="Service Request">Service Request</option>
            </select>
          </div>

          {/* Category filter */}
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="ALL">Semua Kategori</option>
              {Array.from(new Set(tickets.map((t) => t.category).filter(Boolean))).map((catName) => (
                <option key={catName} value={catName}>
                  {catName}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Urutkan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-850 px-2.5 py-1.5 text-xs text-zinc-200 focus:border-blue-500 focus:outline-none"
            >
              <option value="NEWEST">Terbaru</option>
              <option value="OLDEST">Terlama</option>
              <option value="PRIORITY">Prioritas Tertinggi</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
            <span className="text-zinc-400">Filter sedang aktif</span>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* Ticket List */}
      {paginatedTickets.length === 0 ? (
        <EmptyState
          title="Tidak ada tiket yang cocok"
          description={
            hasActiveFilters
              ? 'Tidak ditemukan tiket dengan filter yang dipilih. Silakan ubah filter atau kata kunci pencarian.'
              : 'Anda belum memiliki tiket helpdesk.'
          }
          actionLabel={hasActiveFilters ? 'Reset Filter' : 'Buat Tiket Baru'}
          onAction={hasActiveFilters ? resetFilters : onCreateTicket}
        />
      ) : (
        <div className="space-y-3">
          {paginatedTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => onOpenTicket(ticket)}
              className="group flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 sm:p-5 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90 cursor-pointer shadow-md hover:shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                    {ticket.number}
                  </span>
                  <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 border border-zinc-700/60">
                    {ticket.type}
                  </span>
                  <span className="text-xs text-zinc-400">{ticket.category}</span>
                  <span className="text-zinc-600 hidden sm:inline">•</span>
                  <span className="text-xs text-zinc-500 hidden sm:inline">{ticket.subcategory}</span>
                </div>

                <div className="flex items-center gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <StatusBadge status={ticket.status} />
                </div>
              </div>

              <div>
                <h3 className="text-base font-semibold text-zinc-100 group-hover:text-blue-300 transition-colors">
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
                    Assignee: {ticket.assigneeName || 'Belum Ditugaskan'}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-blue-400 group-hover:text-blue-300 font-medium transition-colors">
                  Buka Detail <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
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
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-850 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-850 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
