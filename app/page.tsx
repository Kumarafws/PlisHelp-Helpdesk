'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Ticket,
  TicketRating,
  TicketStatus,
  NotificationItem,
  UserProfile,
  TicketRole,
  ManagedUser,
  DepartmentInfo,
  CategoryInfo,
  SLAPolicyItem,
} from '@/types/helpdesk';
import {
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  CATEGORIES_DATA,
  INITIAL_SLA_POLICIES,
  computeSummary,
  computeSupportSummary,
  computeAdminSummary,
} from '@/services/mockTicketService';
import { ticketApiService } from '@/services/ticketApiService';
import { tokenStorage, ApiError } from '@/lib/apiClient';

// Employee Components
import { EmployeeLayout } from '@/components/employee/EmployeeLayout';
import { EmployeeDashboard } from '@/components/employee/Dashboard/EmployeeDashboard';
import { MyTicketsView } from '@/components/employee/MyTickets/MyTicketsView';
import { CreateTicketModal } from '@/components/employee/CreateTicket/CreateTicketModal';
import { TicketDetailView } from '@/components/employee/TicketDetail/TicketDetailView';
import { ProfileView } from '@/components/employee/Profile/ProfileView';

// Support Components
import { SupportLayout } from '@/components/support/SupportLayout';
import { SupportDashboardView } from '@/components/support/Dashboard/SupportDashboardView';
import { SupportTicketListView } from '@/components/support/Tickets/SupportTicketListView';
import { SupportTicketDetailView } from '@/components/support/TicketDetail/SupportTicketDetailView';
import { SupportProfileView } from '@/components/support/Profile/SupportProfileView';

// Admin Components
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboardView } from '@/components/admin/Dashboard/AdminDashboardView';
import { AdminTicketListView } from '@/components/admin/Tickets/AdminTicketListView';
import { AdminTicketDetailView } from '@/components/admin/Tickets/AdminTicketDetailView';
import { AdminUsersView } from '@/components/admin/Users/AdminUsersView';
import { AdminDepartmentsView } from '@/components/admin/Departments/AdminDepartmentsView';
import { AdminCategoriesView } from '@/components/admin/Categories/AdminCategoriesView';
import { AdminSLAManagementView } from '@/components/admin/SLA/AdminSLAManagementView';
import { AdminReportsView } from '@/components/admin/Reports/AdminReportsView';
import { AdminProfileView } from '@/components/admin/Profile/AdminProfileView';

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
  Loader2,
} from 'lucide-react';

const DEMO_ACCOUNTS: Record<
  TicketRole,
  { email: string; password: string; name: string; department: string; description: string }
> = {
  Employee: {
    email: 'andi@plishelp.co.id',
    password: 'password123',
    name: 'Andi Pratama',
    department: 'Marketing & Communications',
    description: 'Karyawan / Requester permohonan bantuan IT',
  },
  'IT Support': {
    email: 'budi@plishelp.co.id',
    password: 'password123',
    name: 'Budi Santoso',
    department: 'IT Operations & Helpdesk',
    description: 'Teknisi helpdesk resolver penangan kendala IT',
  },
  Admin: {
    email: 'admin@plishelp.co.id',
    password: 'password123',
    name: 'Admin PlisHelp',
    department: 'IT Operations & Helpdesk',
    description: 'Administrator sistem & pengelola master data',
  },
};

export default function Home() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<TicketRole>('Employee');
  const [loginEmail, setLoginEmail] = useState(DEMO_ACCOUNTS.Employee.email);
  const [loginPassword, setLoginPassword] = useState(DEMO_ACCOUNTS.Employee.password);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Core Data State (Synced with Backend API)
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [departments, setDepartments] = useState<DepartmentInfo[]>(INITIAL_DEPARTMENTS);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES_DATA);
  const [slaPolicies, setSlaPolicies] = useState<SLAPolicyItem[]>(INITIAL_SLA_POLICIES);

  // Navigation States
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'my-tickets' | 'create-ticket' | 'notifications' | 'profile'
  >('dashboard');

  const [supportNav, setSupportNav] = useState<
    'dashboard' | 'my-tickets' | 'available-tickets' | 'all-tickets' | 'notifications' | 'profile'
  >('dashboard');

  const [adminNav, setAdminNav] = useState<
    | 'dashboard'
    | 'tickets'
    | 'users'
    | 'departments'
    | 'categories'
    | 'sla'
    | 'reports'
    | 'notifications'
    | 'profile'
  >('dashboard');

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialStatusFilter, setInitialStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load All App Data from Backend
  const loadAppData = useCallback(async (user?: UserProfile | null) => {
    const role = user?.role || currentUser?.role;
    try {
      const [ticketsRes, notifsRes, deptsRes, catsRes, slaRes] = await Promise.allSettled([
        ticketApiService.getTickets(),
        ticketApiService.getNotifications(),
        ticketApiService.getDepartments(),
        ticketApiService.getCategories(),
        ticketApiService.getSlaPolicies(),
      ]);

      if (ticketsRes.status === 'fulfilled') {
        setTickets(ticketsRes.value.tickets);
      }
      if (notifsRes.status === 'fulfilled') {
        setNotifications(notifsRes.value);
      }
      if (deptsRes.status === 'fulfilled' && deptsRes.value.length > 0) {
        setDepartments(deptsRes.value);
      }
      if (catsRes.status === 'fulfilled' && catsRes.value.length > 0) {
        setCategories(catsRes.value);
      }
      if (slaRes.status === 'fulfilled' && slaRes.value.length > 0) {
        setSlaPolicies(slaRes.value);
      }

      if (role === 'Admin') {
        try {
          const usersRes = await ticketApiService.getUsers();
          if (usersRes.length > 0) {
            setUsers(usersRes);
          }
        } catch {
          // silent fallback
        }
      }
    } catch (err: any) {
      console.error('Error loading app data:', err);
    }
  }, [currentUser?.role]);

  // Session Recovery on Mount (Auto-login)
  useEffect(() => {
    async function initAuth() {
      const token = tokenStorage.get();
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        const user = await ticketApiService.getMe();
        setCurrentUser(user);
        setSelectedRole(user.role);
        await loadAppData(user);
      } catch {
        tokenStorage.clear();
        setCurrentUser(null);
      } finally {
        setIsInitializing(false);
      }
    }

    initAuth();
  }, [loadAppData]);

  // Update credentials when clicking role chip
  const handleRoleSelect = (role: TicketRole) => {
    setSelectedRole(role);
    setLoginEmail(DEMO_ACCOUNTS[role].email);
    setLoginPassword(DEMO_ACCOUNTS[role].password);
    setLoginError('');
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const { user } = await ticketApiService.login(loginEmail.trim(), loginPassword);
      setCurrentUser(user);
      setSelectedTicketId(null);
      setActiveTab('dashboard');
      setSupportNav('dashboard');
      setAdminNav('dashboard');
      addToast('success', 'Login Berhasil', `Selamat datang kembali, ${user.name}!`);
      await loadAppData(user);
    } catch (err: any) {
      const msg = err instanceof ApiError ? err.message : 'Kredensial email atau password tidak sesuai.';
      setLoginError(msg);
      addToast('error', 'Gagal Masuk', msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await ticketApiService.logout();
    setCurrentUser(null);
    setSelectedTicketId(null);
    setActiveTab('dashboard');
    setSupportNav('dashboard');
    setAdminNav('dashboard');
    addToast('info', 'Sesi Berakhir', 'Anda telah keluar dari aplikasi.');
  };

  // Selected Ticket Object
  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  // Active Support Staff for assignment dropdown
  const activeSupportUsers = useMemo(
    () => users.filter((u) => u.role === 'IT Support' && u.status === 'ACTIVE'),
    [users]
  );

  // Summaries
  const employeeSummary = useMemo(() => computeSummary(tickets), [tickets]);
  const supportSummary = useMemo(
    () =>
      currentUser
        ? computeSupportSummary(tickets, currentUser)
        : computeSupportSummary(tickets, { id: '2', name: 'Budi Santoso', email: 'budi@plishelp.co.id', role: 'IT Support', department: 'IT Operations' }),
    [tickets, currentUser]
  );
  const adminSummary = useMemo(() => computeAdminSummary(tickets, users), [tickets, users]);

  // ==========================================
  // SHARED ACTIONS & WORKFLOW TRANSITIONS
  // ==========================================

  // 1. Employee Creates Ticket
  const handleCreateTicketSubmit = async (newTicketData: {
    title: string;
    description: string;
    type: any;
    category: string;
    subcategory: string;
    priority: any;
    attachments: any[];
  }) => {
    try {
      const catObj = categories.find((c) => c.name.toLowerCase() === newTicketData.category.toLowerCase());
      const catId = catObj?.id ? Number(catObj.id) : 1;

      const created = await ticketApiService.createTicket({
        title: newTicketData.title,
        description: newTicketData.description,
        type: newTicketData.type,
        category_id: catId,
        subcategory_name: newTicketData.subcategory,
        priority: newTicketData.priority,
        attachments: newTicketData.attachments.map((a) => ({
          file_name: a.fileName,
          file_size: a.fileSize,
          file_type: a.fileType,
          path: a.url || `/uploads/${a.fileName}`,
        })),
      });

      addToast(
        'success',
        'Tiket Berhasil Dibuat',
        `Tiket nomor ${created.number} berhasil dikirim ke antrean IT Support.`
      );

      await loadAppData();
      setSelectedTicketId(created.id);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      addToast('error', 'Gagal Membuat Tiket', err.message || 'Terjadi kesalahan saat menyimpan tiket.');
    }
  };

  // 2. IT Support Takes Ticket
  const handleTakeTicket = async (ticketId: string) => {
    try {
      const updated = await ticketApiService.takeTicket(ticketId);
      addToast('success', 'Tiket Berhasil Diambil', `Anda telah menjadi penanggung jawab tiket ${updated.number}.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengambil Tiket', err.message || 'Tiket tidak dapat diambil.');
    }
  };

  // Admin Assign / Reassign / Unassign
  const handleAdminAssignTicket = async (
    ticketId: string,
    assignee: ManagedUser | null,
    reason?: string
  ) => {
    try {
      const assigneeId = assignee?.id ? Number(assignee.id) : null;
      await ticketApiService.assignTicket(ticketId, assigneeId, reason);
      addToast(
        'success',
        'Penugasan Diperbarui',
        assignee
          ? `Tiket berhasil ditugaskan ke ${assignee.name}.`
          : `Tiket dikembalikan ke status Open tanpa penanggung jawab.`
      );
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menugaskan Tiket', err.message || 'Penugasan gagal diperbarui.');
    }
  };

  // Admin Override Status
  const handleAdminOverrideStatus = async (
    ticketId: string,
    newStatus: TicketStatus,
    reason: string
  ) => {
    try {
      await ticketApiService.overrideStatus(ticketId, newStatus, reason);
      addToast('info', 'Override Status Berhasil', `Status tiket berhasil diubah ke ${newStatus}.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Override Status', err.message || 'Koreksi status gagal.');
    }
  };

  // 3. Request Information
  const handleRequestInfo = async (ticketId: string, message: string) => {
    try {
      await ticketApiService.requestInfo(ticketId, message);
      addToast('info', 'Permintaan Info Dikirim', 'Status tiket diubah ke Need Info dan penghitungan SLA di-pause.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengirim Permintaan', err.message || 'Tidak dapat mengubah status.');
    }
  };

  // 4. Resolve Ticket
  const handleResolveTicket = async (ticketId: string, resolutionSummary: string) => {
    try {
      const updated = await ticketApiService.resolveTicket(ticketId, resolutionSummary);
      addToast('success', 'Tiket Ditandai Resolved', `Tiket ${updated.number} berhasil diselesaikan. Menunggu konfirmasi.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyelesaikan Tiket', err.message || 'Gagal mengubah status resolved.');
    }
  };

  // 5. Escalate Ticket
  const handleEscalateTicket = async (ticketId: string, reason: string) => {
    try {
      const updated = await ticketApiService.escalateTicket(ticketId, reason);
      addToast('info', 'Tiket Berhasil Dieskalasi', `Tiket ${updated.number} telah dialihkan ke status Escalated.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Eskalasi', err.message || 'Eskalasi gagal dilakukan.');
    }
  };

  // 6. Comments (Public & Internal)
  const handleAddComment = async (ticketId: string, commentBody: string, isInternal = false) => {
    try {
      await ticketApiService.addComment(ticketId, commentBody, isInternal);
      addToast(
        'success',
        isInternal ? 'Catatan Tersimpan' : 'Pesan Terkirim',
        isInternal
          ? 'Catatan internal berhasil disimpan khusus untuk tim IT.'
          : 'Pesan Anda berhasil dikirimkan.'
      );
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengirim Komentar', err.message || 'Pesan gagal dikirim.');
    }
  };

  // 7. Employee Closes Ticket
  const handleCloseTicket = async (ticketId: string) => {
    try {
      await ticketApiService.closeTicket(ticketId);
      addToast('success', 'Tiket Ditutup', 'Tiket telah resmi ditutup. Anda sekarang dapat memberikan rating & ulasan.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menutup Tiket', err.message || 'Tidak dapat menutup tiket.');
    }
  };

  // 8. Employee Reopens Ticket
  const handleReopenTicket = async (ticketId: string, reason: string) => {
    try {
      await ticketApiService.reopenTicket(ticketId, reason);
      addToast('info', 'Tiket Dibuka Kembali', 'Tiket telah dikembalikan ke status In Progress untuk penanganan lebih lanjut.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Membuka Kembali Tiket', err.message || 'Tiket gagal dibuka kembali.');
    }
  };

  // 9. Employee Submits Rating
  const handleSubmitRating = async (ticketId: string, rating: TicketRating) => {
    try {
      await ticketApiService.submitRating(ticketId, rating.score, rating.feedback);
      addToast('success', 'Penilaian Diterima', 'Terima kasih atas rating & feedback yang Anda berikan!');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan Rating', err.message || 'Rating gagal disimpan.');
    }
  };

  // 10. Admin User Management CRUD
  const handleSaveUser = async (userData: {
    id?: string;
    name: string;
    email: string;
    password?: string;
    role: TicketRole;
    department: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    try {
      const deptObj = departments.find((d) => d.name.toLowerCase() === userData.department.toLowerCase());
      const deptId = deptObj?.id ? Number(deptObj.id) : undefined;

      if (userData.id && !userData.id.startsWith('usr-temp')) {
        await ticketApiService.updateUser(userData.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          department_id: deptId,
          status: userData.status,
          password: userData.password || undefined,
        });
        addToast('success', 'User Diperbarui', `Data akun ${userData.name} berhasil disimpan.`);
      } else {
        await ticketApiService.createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password || 'password123',
          role: userData.role,
          department_id: deptId,
          status: userData.status,
        });
        addToast('success', 'User Dibuat', `Akun baru ${userData.name} berhasil ditambahkan.`);
      }
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan User', err.message || 'User gagal disimpan.');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await ticketApiService.toggleUserStatus(userId);
      addToast('info', 'Status Akun', 'Status keaktifan akun berhasil diubah.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengubah Status', err.message || 'Gagal mengubah status.');
    }
  };

  // 11. Admin Department Management CRUD
  const handleSaveDepartment = async (deptData: {
    id?: string;
    name: string;
    code: string;
    active: boolean;
  }) => {
    try {
      await ticketApiService.saveDepartment({
        id: deptData.id && !deptData.id.startsWith('dept-temp') ? Number(deptData.id) : undefined,
        name: deptData.name,
        code: deptData.code,
        is_active: deptData.active,
      });
      addToast('success', 'Departemen Disimpan', `Departemen ${deptData.name} berhasil disimpan.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan Departemen', err.message || 'Departemen gagal disimpan.');
    }
  };

  const handleToggleDepartmentStatus = async (deptId: string) => {
    try {
      await ticketApiService.toggleDepartmentStatus(deptId);
      addToast('info', 'Status Departemen', 'Status keaktifan departemen berhasil diubah.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengubah Status', err.message || 'Gagal mengubah status.');
    }
  };

  // 12. Admin Category Management CRUD
  const handleSaveCategory = async (catData: {
    id?: string;
    name: string;
    subcategories: string[];
    active: boolean;
  }) => {
    try {
      await ticketApiService.saveCategory({
        id: catData.id && !catData.id.startsWith('cat-temp') ? Number(catData.id) : undefined,
        name: catData.name,
        is_active: catData.active,
        subcategories: catData.subcategories,
      });
      addToast('success', 'Kategori Disimpan', `Kategori ${catData.name} berhasil disimpan.`);
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan Kategori', err.message || 'Kategori gagal disimpan.');
    }
  };

  const handleToggleCategoryStatus = async (catId: string) => {
    try {
      await ticketApiService.toggleCategoryStatus(catId);
      addToast('info', 'Status Kategori', 'Status keaktifan kategori berhasil diubah.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Mengubah Status', err.message || 'Gagal mengubah status.');
    }
  };

  // 13. Admin SLA Policies Update
  const handleSaveSLAPolicies = async (updatedPolicies: SLAPolicyItem[]) => {
    try {
      await ticketApiService.saveSlaPolicies(
        updatedPolicies.map((p) => ({
          priority: p.priority,
          response_target_minutes: p.responseTargetMinutes,
          resolution_target_hours: p.resolutionTargetHours,
          description: p.description,
        }))
      );
      addToast('success', 'Kebijakan SLA Disimpan', 'Target SLA berhasil disinkronkan ke seluruh sistem.');
      await loadAppData();
    } catch (err: any) {
      addToast('error', 'Gagal Menyimpan SLA', err.message || 'Gagal menyimpan target SLA.');
    }
  };

  // Notifications Handlers
  const handleMarkNotificationAsRead = async (id: string) => {
    try {
      await ticketApiService.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch {
      // fallback local
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await ticketApiService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      addToast('info', 'Notifikasi Dibaca', 'Semua notifikasi telah ditandai sebagai dibaca.');
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.ticketId) {
      setSelectedTicketId(notif.ticketId);
    }
  };

  // Initializing Splash Screen
  if (isInitializing) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 animate-pulse">
            <LifeBuoy className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold tracking-wider text-zinc-400">Memuat Sesi PlisHelp...</p>
        </div>
      </main>
    );
  }

  // ==========================================
  // VIEW RENDER LOGIC
  // ==========================================

  // 1. HALAMAN AWAL: MASUK KE WORKSPACE (PILIH ROLE)
  if (!currentUser) {
    const rolesList: TicketRole[] = ['Employee', 'IT Support', 'Admin'];

    return (
      <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-zinc-950 text-zinc-100 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <section className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
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

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-850/40 p-3 text-xs text-zinc-400 flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-zinc-200">{selectedRole}</strong>: {DEMO_ACCOUNTS[selectedRole].description}
            </div>
          </div>

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
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] disabled:opacity-60 transition-all"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk sebagai {selectedRole}</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Password akun demo seeder: <code className="text-zinc-400 font-mono">password123</code>
          </p>
        </section>
      </main>
    );
  }

  // 2. DASHBOARD IT ADMIN (ADMIN PORTAL)
  if (currentUser.role === 'Admin') {
    return (
      <>
        <AdminLayout
          user={currentUser}
          activeNav={adminNav}
          breadcrumbTitle={selectedTicket ? `Detail Tiket (${selectedTicket.number})` : undefined}
          onNavigate={(nav) => {
            setSelectedTicketId(null);
            setAdminNav(nav);
          }}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onSelectNotification={handleSelectNotification}
          onLogout={handleLogout}
        >
          {selectedTicket ? (
            <AdminTicketDetailView
              ticket={selectedTicket}
              currentUser={currentUser}
              activeSupportUsers={activeSupportUsers}
              onBack={() => setSelectedTicketId(null)}
              onAssignTicket={handleAdminAssignTicket}
              onOverrideStatus={handleAdminOverrideStatus}
              onAddComment={handleAddComment}
            />
          ) : adminNav === 'dashboard' ? (
            <AdminDashboardView
              user={currentUser}
              tickets={tickets}
              users={users}
              summary={adminSummary}
              onFilterClick={(statusKey) => {
                setSelectedTicketId(null);
                setAdminNav('tickets');
              }}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onNavigateToTab={(tab) => {
                setSelectedTicketId(null);
                setAdminNav(tab);
              }}
            />
          ) : adminNav === 'tickets' ? (
            <AdminTicketListView
              tickets={tickets}
              departments={departments}
              activeSupportUsers={activeSupportUsers}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onAssignTicket={handleAdminAssignTicket}
            />
          ) : adminNav === 'users' ? (
            <AdminUsersView
              users={users}
              departments={departments}
              onSaveUser={handleSaveUser}
              onToggleStatus={handleToggleUserStatus}
            />
          ) : adminNav === 'departments' ? (
            <AdminDepartmentsView
              departments={departments}
              onSaveDepartment={handleSaveDepartment}
              onToggleStatus={handleToggleDepartmentStatus}
            />
          ) : adminNav === 'categories' ? (
            <AdminCategoriesView
              categories={categories}
              onSaveCategory={handleSaveCategory}
              onToggleStatus={handleToggleCategoryStatus}
            />
          ) : adminNav === 'sla' ? (
            <AdminSLAManagementView
              policies={slaPolicies}
              onSavePolicies={handleSaveSLAPolicies}
            />
          ) : adminNav === 'reports' ? (
            <AdminReportsView tickets={tickets} supportUsers={users} />
          ) : adminNav === 'profile' ? (
            <AdminProfileView user={currentUser} tickets={tickets} users={users} />
          ) : (
            <AdminDashboardView
              user={currentUser}
              tickets={tickets}
              users={users}
              summary={adminSummary}
              onFilterClick={() => setAdminNav('tickets')}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onNavigateToTab={(tab) => setAdminNav(tab)}
            />
          )}
        </AdminLayout>

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 3. DASHBOARD IT SUPPORT
  if (currentUser.role === 'IT Support') {
    return (
      <>
        <SupportLayout
          user={currentUser}
          activeNav={supportNav}
          breadcrumbTitle={selectedTicket ? `Detail Tiket (${selectedTicket.number})` : undefined}
          onNavigate={(nav) => {
            setSelectedTicketId(null);
            setSupportNav(nav);
          }}
          notifications={notifications}
          availableCount={supportSummary.availableCount}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onSelectNotification={handleSelectNotification}
          onLogout={handleLogout}
        >
          {selectedTicket ? (
            <SupportTicketDetailView
              ticket={selectedTicket}
              currentUser={currentUser}
              onBack={() => setSelectedTicketId(null)}
              onTakeTicket={handleTakeTicket}
              onRequestInfo={handleRequestInfo}
              onResolveTicket={handleResolveTicket}
              onEscalateTicket={handleEscalateTicket}
              onAddComment={handleAddComment}
            />
          ) : supportNav === 'dashboard' ? (
            <SupportDashboardView
              user={currentUser}
              tickets={tickets}
              summary={supportSummary}
              onFilterClick={() => {
                setSelectedTicketId(null);
                setSupportNav('all-tickets');
              }}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onTakeTicket={handleTakeTicket}
              onViewMyTickets={() => {
                setSelectedTicketId(null);
                setSupportNav('my-tickets');
              }}
              onViewAvailableTickets={() => {
                setSelectedTicketId(null);
                setSupportNav('available-tickets');
              }}
            />
          ) : supportNav === 'my-tickets' ? (
            <SupportTicketListView
              tickets={tickets}
              currentUser={currentUser}
              title="Tiket Tanggungan Saya"
              subtitle="Daftar seluruh tiket kendala yang ditugaskan khusus kepada Anda"
              initialStatusFilter="ASSIGNED_TO_ME"
              isMyTicketsOnly={true}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onTakeTicket={handleTakeTicket}
            />
          ) : supportNav === 'available-tickets' ? (
            <SupportTicketListView
              tickets={tickets}
              currentUser={currentUser}
              title="Antrean Tiket Tersedia (Open Queue)"
              subtitle="Tiket masuk yang belum memiliki penanggung jawab IT Support"
              initialStatusFilter="AVAILABLE"
              isAvailableQueueOnly={true}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onTakeTicket={handleTakeTicket}
            />
          ) : supportNav === 'all-tickets' ? (
            <SupportTicketListView
              tickets={tickets}
              currentUser={currentUser}
              title="Semua Antrean Tiket"
              subtitle="Seluruh arsip dan tiket kendala aktif dari seluruh divisi perusahaan"
              initialStatusFilter="ALL"
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onTakeTicket={handleTakeTicket}
            />
          ) : supportNav === 'profile' ? (
            <SupportProfileView user={currentUser} tickets={tickets} />
          ) : (
            <SupportDashboardView
              user={currentUser}
              tickets={tickets}
              summary={supportSummary}
              onFilterClick={() => setSupportNav('all-tickets')}
              onOpenTicket={(t) => setSelectedTicketId(t.id)}
              onTakeTicket={handleTakeTicket}
              onViewMyTickets={() => setSupportNav('my-tickets')}
              onViewAvailableTickets={() => setSupportNav('available-tickets')}
            />
          )}
        </SupportLayout>

        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // 4. DASHBOARD EMPLOYEE
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
        {selectedTicket ? (
          <TicketDetailView
            ticket={selectedTicket}
            currentUser={currentUser}
            onBack={() => setSelectedTicketId(null)}
            onCloseTicket={handleCloseTicket}
            onReopenTicket={handleReopenTicket}
            onSubmitRating={handleSubmitRating}
            onAddComment={(tId, body) => handleAddComment(tId, body, false)}
          />
        ) : activeTab === 'dashboard' ? (
          <EmployeeDashboard
            user={currentUser}
            tickets={tickets}
            summary={employeeSummary}
            onCreateTicket={() => setIsCreateModalOpen(true)}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onSelectStatusFilter={(status) => {
              setInitialStatusFilter(status);
              setSelectedTicketId(null);
              setActiveTab('my-tickets');
            }}
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
            summary={employeeSummary}
            onCreateTicket={() => setIsCreateModalOpen(true)}
            onOpenTicket={(ticket) => setSelectedTicketId(ticket.id)}
            onSelectStatusFilter={(status) => {
              setInitialStatusFilter(status);
              setSelectedTicketId(null);
              setActiveTab('my-tickets');
            }}
            onViewAllTickets={() => setActiveTab('my-tickets')}
          />
        )}
      </EmployeeLayout>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        categories={categories}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTicketSubmit}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </>
  );
}
