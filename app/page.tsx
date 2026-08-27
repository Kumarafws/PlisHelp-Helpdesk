'use client';

import React, { useState, useMemo } from 'react';
import {
  Ticket,
  TicketRating,
  TicketStatus,
  NotificationItem,
  UserProfile,
  TicketRole,
} from '@/types/helpdesk';
import {
  CURRENT_EMPLOYEE,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  computeSummary,
  generateTicketNumber,
} from '@/services/mockTicketService';
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { EmployeeDashboard } from '@/components/employee/Dashboard/EmployeeDashboard';
import { MyTicketsView } from '@/components/employee/MyTickets/MyTicketsView';
import { CreateTicketModal } from '@/components/employee/CreateTicket/CreateTicketModal';
import { TicketDetailView } from '@/components/employee/TicketDetail/TicketDetailView';
import { ProfileView } from '@/components/employee/Profile/ProfileView';
import { SupportDashboard } from '@/components/support/SupportDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { ToastContainer, ToastMessage } from '@/components/employee/Toast';
import {
  LifeBuoy,
  UserRound,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Sparkles,
  Lock,
  Mail,
  AlertCircle,
} from 'lucide-react';

const DEMO_ACCOUNTS: Record<
  TicketRole,
  { email: string; password: string; name: string; department: string; description: string }
> = {
  Employee: {
    email: 'andi@plishelp.co.id',
    password: 'employee123',
    name: 'Andi Pratama',
    department: 'Marketing',
    description: 'Karyawan / Requester permohonan bantuan IT',
  },
  'IT Support': {
    email: 'budi@plishelp.co.id',
    password: 'support123',
    name: 'Budi Santoso',
    department: 'IT Operations',
    description: 'Teknisi helpdesk penangan tiket kendala',
  },
  Admin: {
    email: 'admin@plishelp.co.id',
    password: 'admin123',
    name: 'Admin PlisHelp',
    department: 'IT Infrastructure & Security',
    description: 'Administrator sistem & pengelola master data',
  },
};

export default function Home() {
  // Authentication State - Default is null so the initial landing is always "Masuk ke Workspace"
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<TicketRole>('Employee');
  const [loginEmail, setLoginEmail] = useState(DEMO_ACCOUNTS.Employee.email);
  const [loginPassword, setLoginPassword] = useState(DEMO_ACCOUNTS.Employee.password);
  const [loginError, setLoginError] = useState('');

  // Tickets & Notifications State
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'my-tickets' | 'create-ticket' | 'notifications' | 'profile'
  >('dashboard');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialStatusFilter, setInitialStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Update email/password fields when user clicks role chip in login
  const handleRoleSelect = (role: TicketRole) => {
    setSelectedRole(role);
    setLoginEmail(DEMO_ACCOUNTS[role].email);
    setLoginPassword(DEMO_ACCOUNTS[role].password);
    setLoginError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetAccount = DEMO_ACCOUNTS[selectedRole];
    if (loginEmail.trim() === targetAccount.email && loginPassword === targetAccount.password) {
      const userProfile: UserProfile = {
        id: `usr-${selectedRole.toLowerCase()}`,
        name: targetAccount.name,
        email: targetAccount.email,
        role: selectedRole,
        department: targetAccount.department,
      };
      setCurrentUser(userProfile);
      setLoginError('');
    } else {
      setLoginError('Email atau password tidak sesuai dengan kredensial demo.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTicketId(null);
    setActiveTab('dashboard');
  };

  // Computed summary
  const summary = useMemo(() => computeSummary(tickets), [tickets]);

  // Active selected ticket object
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Toast Helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers for Ticket Actions
  const handleCreateTicketSubmit = (newTicketData: {
    title: string;
    description: string;
    type: any;
    category: string;
    subcategory: string;
    priority: any;
    attachments: any[];
  }) => {
    const newTicketNumber = generateTicketNumber();
    const newId = `tkt-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const createdTicket: Ticket = {
      id: newId,
      number: newTicketNumber,
      title: newTicketData.title,
      type: newTicketData.type,
      category: newTicketData.category,
      subcategory: newTicketData.subcategory,
      priority: newTicketData.priority,
      status: 'OPEN',
      requesterName: currentUser?.name || 'Andi Pratama',
      requesterEmail: currentUser?.email || 'andi@plishelp.co.id',
      requesterDepartment: currentUser?.department || 'Marketing',
      createdAt: nowIso,
      updatedAt: nowIso,
      slaStatus: 'Within SLA',
      description: newTicketData.description,
      attachments: newTicketData.attachments,
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          action: 'Ticket Created',
          actor: currentUser?.name || 'Andi Pratama',
          actorRole: 'Employee',
          timestamp: nowIso,
          note: 'Tiket berhasil dibuat dan masuk ke antrean IT Support.',
        },
      ],
    };

    setTickets((prev) => [createdTicket, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId: newId,
      ticketNumber: newTicketNumber,
      title: 'Tiket Berhasil Dibuat',
      message: `Tiket ${newTicketNumber} telah masuk ke sistem dan akan segera ditinjau oleh IT Support.`,
      type: 'status_change',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'success',
      'Tiket Berhasil Dibuat',
      `Tiket nomor ${newTicketNumber} berhasil dikirim ke IT Support.`
    );

    // Auto open created ticket detail
    setSelectedTicketId(newId);
  };

  const handleCloseTicket = (ticketId: string) => {
    const nowIso = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'CLOSED',
          closedAt: nowIso,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Closed',
              actor: currentUser?.name || 'Andi Pratama',
              actorRole: 'Employee',
              timestamp: nowIso,
              note: 'Requester mengonfirmasi bahwa permasalahan telah selesai.',
            },
          ],
        };
      })
    );

    addToast(
      'success',
      'Tiket Ditutup',
      'Tiket telah resmi ditutup. Anda sekarang dapat memberikan rating & ulasan layanan.'
    );
  };

  const handleReopenTicket = (ticketId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          status: 'IN_PROGRESS',
          resolvedAt: undefined,
          updatedAt: nowIso,
          comments: [
            ...t.comments,
            {
              id: `com-${Date.now()}`,
              authorName: currentUser?.name || 'Andi Pratama',
              authorRole: 'Employee',
              body: `[REOPEN REASON]: ${reason}`,
              createdAt: nowIso,
              isInternal: false,
            },
          ],
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Reopened',
              actor: currentUser?.name || 'Andi Pratama',
              actorRole: 'Employee',
              timestamp: nowIso,
              note: `Tiket dibuka kembali oleh requester dengan alasan: "${reason}"`,
            },
          ],
        };
      })
    );

    addToast(
      'info',
      'Tiket Dibuka Kembali',
      'Tiket telah dikembalikan ke status In Progress untuk penanganan lebih lanjut.'
    );
  };

  const handleSubmitRating = (ticketId: string, rating: TicketRating) => {
    const nowIso = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          rating,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Rating Submitted',
              actor: currentUser?.name || 'Andi Pratama',
              actorRole: 'Employee',
              timestamp: nowIso,
              note: `Memberikan penilaian ${rating.score}/5 bintang: "${rating.feedback || 'Tanpa komentar tambahan'}"`,
            },
          ],
        };
      })
    );

    addToast('success', 'Penilaian Diterima', 'Terima kasih atas rating & feedback yang Anda berikan!');
  };

  const handleAddComment = (ticketId: string, commentBody: string) => {
    const nowIso = new Date().toISOString();
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          updatedAt: nowIso,
          comments: [
            ...t.comments,
            {
              id: `com-${Date.now()}`,
              authorName: currentUser?.name || 'Andi Pratama',
              authorRole: 'Employee',
              body: commentBody,
              createdAt: nowIso,
              isInternal: false,
            },
          ],
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Requester Added Reply',
              actor: currentUser?.name || 'Andi Pratama',
              actorRole: 'Employee',
              timestamp: nowIso,
              note: `Membalas pesan: "${commentBody.slice(0, 50)}${commentBody.length > 50 ? '...' : ''}"`,
            },
          ],
        };
      })
    );

    addToast('success', 'Pesan Terkirim', 'Pesan balasan Anda berhasil dikirim ke IT Support.');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi telah ditandai sebagai dibaca.');
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.ticketId) {
      setSelectedTicketId(notif.ticketId);
    }
  };

  const handleSummaryCardFilterClick = (status: TicketStatus | 'ALL') => {
    setInitialStatusFilter(status);
    setSelectedTicketId(null);
    setActiveTab('my-tickets');
  };

  // 1. HALAMAN AWAL: MASUK KE WORKSPACE (PILIH ROLE)
  if (!currentUser) {
    const rolesList: TicketRole[] = ['Employee', 'IT Support', 'Admin'];

    return (
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-zinc-950 text-zinc-100 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <section className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                Plis<span className="text-blue-400">Help</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                INTERNAL IT HELPDESK
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Masuk ke Workspace Kamu
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Pilih role untuk mencoba alur helpdesk sesuai scope hak akses:
            </p>
          </div>

          {/* Role Switcher Chips */}
          <div className="grid grid-cols-3 gap-2">
            {rolesList.map((role) => {
              const isActive = selectedRole === role;
              const Icon =
                role === 'Employee' ? UserRound : role === 'IT Support' ? Headphones : ShieldCheck;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                    isActive
                      ? 'border-blue-500/60 bg-blue-600/15 text-blue-400 shadow-md shadow-blue-950/40 ring-1 ring-blue-500/30'
                      : 'border-zinc-800 bg-zinc-850/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-bold truncate">{role}</span>
                </button>
              );
            })}
          </div>

          {/* Role Description Card */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-850/40 p-3 text-xs text-zinc-400 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-200">{selectedRole}</strong>: {DEMO_ACCOUNTS[selectedRole].description}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Email Perusahaan
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-850 pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all"
            >
              <span>Masuk sebagai {selectedRole}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          {/* Demo Hint */}
          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Employee: <code className="text-zinc-400">employee123</code> · Support:{' '}
            <code className="text-zinc-400">support123</code> · Admin:{' '}
            <code className="text-zinc-400">admin123</code>
          </p>
        </section>
      </main>
    );
  }

  // 2. JIKA LOGIN SEBAGAI IT SUPPORT: BUKA DASHBOARD IT SUPPORT
  if (currentUser.role === 'IT Support') {
    return <SupportDashboard user={currentUser} tickets={tickets} onLogout={handleLogout} />;
  }

  // 3. JIKA LOGIN SEBAGAI ADMIN: BUKA DASHBOARD ADMIN
  if (currentUser.role === 'Admin') {
    return <AdminDashboard user={currentUser} tickets={tickets} onLogout={handleLogout} />;
  }

  // 4. JIKA LOGIN SEBAGAI EMPLOYEE: BUKA DASHBOARD & WORKSPACE EMPLOYEE
  return (
    <>
      <EmployeeLayout
        user={currentUser}
        activeNav={activeTab}
        breadcrumbTitle={selectedTicket ? `Detail Tiket (${selectedTicket.number})` : undefined}
        onNavigate={(tab) => {
          setSelectedTicketId(null);
          setActiveTab(tab);
        }}
        onCreateTicketClick={() => setIsCreateModalOpen(true)}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onSelectNotification={handleSelectNotification}
        onLogout={handleLogout}
      >
        {/* Render Content Based on Active View or Selected Ticket */}
        {selectedTicket ? (
          <TicketDetailView
            ticket={selectedTicket}
            currentUser={currentUser}
            onBack={() => setSelectedTicketId(null)}
            onCloseTicket={handleCloseTicket}
            onReopenTicket={handleReopenTicket}
            onSubmitRating={handleSubmitRating}
            onAddComment={handleAddComment}
          />
        ) : activeTab === 'dashboard' ? (
          <EmployeeDashboard
            user={currentUser}
            tickets={tickets}
            summary={summary}
            onCreateTicket={() => setIsCreateModalOpen(true)}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onSelectStatusFilter={handleSummaryCardFilterClick}
            onViewAllTickets={() => {
              setInitialStatusFilter('ALL');
              setActiveTab('my-tickets');
            }}
          />
        ) : activeTab === 'my-tickets' ? (
          <MyTicketsView
            tickets={tickets}
            initialStatusFilter={initialStatusFilter}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onCreateTicket={() => setIsCreateModalOpen(true)}
          />
        ) : activeTab === 'profile' ? (
          <ProfileView
            user={currentUser}
            tickets={tickets}
            onCreateTicket={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <EmployeeDashboard
            user={currentUser}
            tickets={tickets}
            summary={summary}
            onCreateTicket={() => setIsCreateModalOpen(true)}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onSelectStatusFilter={handleSummaryCardFilterClick}
            onViewAllTickets={() => setActiveTab('my-tickets')}
          />
        )}
      </EmployeeLayout>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicketSubmit}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
