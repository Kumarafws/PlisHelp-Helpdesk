'use client';

import React, { useState, useMemo } from 'react';
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
  CURRENT_EMPLOYEE,
  CURRENT_SUPPORT,
  CURRENT_ADMIN,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  CATEGORIES_DATA,
  INITIAL_SLA_POLICIES,
  computeSummary,
  computeSupportSummary,
  computeAdminSummary,
  generateTicketNumber,
} from '@/services/mockTicketService';

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
} from 'lucide-react';

const DEMO_ACCOUNTS: Record<
  TicketRole,
  { email: string; password: string; name: string; department: string; description: string }
> = {
  Employee: {
    email: 'andi@plishelp.co.id',
    password: 'employee123',
    name: 'Andi Pratama',
    department: 'Marketing & Communications',
    description: 'Karyawan / Requester permohonan bantuan IT',
  },
  'IT Support': {
    email: 'budi@plishelp.co.id',
    password: 'support123',
    name: 'Budi Santoso',
    department: 'IT Operations & Helpdesk',
    description: 'Teknisi helpdesk resolver penangan kendala IT',
  },
  Admin: {
    email: 'admin@plishelp.co.id',
    password: 'admin123',
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

  // Core Master Data State
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

  // Update credentials when clicking role chip
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
      setSelectedTicketId(null);
      setActiveTab('dashboard');
      setSupportNav('dashboard');
      setAdminNav('dashboard');
    } else {
      setLoginError('Email atau password tidak sesuai dengan kredensial demo.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedTicketId(null);
    setActiveTab('dashboard');
    setSupportNav('dashboard');
    setAdminNav('dashboard');
  };

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
        : computeSupportSummary(tickets, CURRENT_SUPPORT),
    [tickets, currentUser]
  );
  const adminSummary = useMemo(() => computeAdminSummary(tickets, users), [tickets, users]);

  // ==========================================
  // SHARED ACTIONS & LOGIC
  // ==========================================

  // 1. Employee Creates Ticket
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
      requesterDepartment: currentUser?.department || 'Marketing & Communications',
      createdAt: nowIso,
      updatedAt: nowIso,
      slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slaInfo: {
        responseTargetMinutes: 30,
        resolutionTargetHours: 4,
        remainingTimeFormatted: '03h 59m',
        status: 'WITHIN_SLA',
      },
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

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId: newId,
      ticketNumber: newTicketNumber,
      title: 'Tiket Berhasil Dibuat',
      message: `Tiket ${newTicketNumber} telah masuk ke sistem helpdesk.`,
      type: 'status_change',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast(
      'success',
      'Tiket Berhasil Dibuat',
      `Tiket nomor ${newTicketNumber} berhasil dikirim ke antrean IT Support.`
    );

    setSelectedTicketId(newId);
  };

  // 2. IT Support / Admin Takes or Assigns Ticket
  const handleTakeTicket = (ticketId: string) => {
    const nowIso = new Date().toISOString();
    const supportName = currentUser?.name || 'Budi Santoso';
    const supportEmail = currentUser?.email || 'budi@plishelp.co.id';
    let takenTicketNumber = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        takenTicketNumber = t.number;
        return {
          ...t,
          status: 'IN_PROGRESS',
          assigneeName: supportName,
          assigneeEmail: supportEmail,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Assigned / Taken',
              actor: supportName,
              actorRole: 'IT Support',
              timestamp: nowIso,
              note: `Tiket diambil oleh ${supportName} untuk segera dilakukan investigasi.`,
            },
          ],
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId,
      ticketNumber: takenTicketNumber,
      title: 'Tiket Sedang Ditangani',
      message: `Tiket ${takenTicketNumber} telah ditugaskan kepada ${supportName}.`,
      type: 'assigned',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'success',
      'Tiket Berhasil Diambil',
      `Anda telah menjadi penanggung jawab tiket ${takenTicketNumber}.`
    );
  };

  // Admin Assign / Reassign / Unassign
  const handleAdminAssignTicket = (
    ticketId: string,
    assignee: ManagedUser | null,
    reason?: string
  ) => {
    const target = tickets.find((t) => t.id === ticketId);
    if (target && (target.status === 'RESOLVED' || target.status === 'CLOSED')) {
      addToast(
        'error',
        'Penugasan Terkunci',
        'Tiket yang sudah Resolved atau Closed tidak dapat dialihkan penugasannya untuk menjaga integritas KPI teknisi.'
      );
      return;
    }

    const nowIso = new Date().toISOString();
    const adminName = currentUser?.name || 'Admin PlisHelp';
    let targetTicketNumber = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        targetTicketNumber = t.number;

        if (!assignee) {
          return {
            ...t,
            status: 'OPEN',
            assigneeName: undefined,
            assigneeEmail: undefined,
            updatedAt: nowIso,
            activities: [
              ...t.activities,
              {
                id: `act-${Date.now()}`,
                action: 'Ticket Unassigned by Admin',
                actor: adminName,
                actorRole: 'Admin',
                timestamp: nowIso,
                note: `Penugasan dibatalkan oleh Administrator. Alasan: "${reason || 'Penugasan ulang'}"`,
              },
            ],
          };
        }

        const nextStatus = t.status === 'OPEN' ? 'IN_PROGRESS' : t.status;
        return {
          ...t,
          status: nextStatus,
          assigneeName: assignee.name,
          assigneeEmail: assignee.email,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Assigned by Admin',
              actor: adminName,
              actorRole: 'Admin',
              timestamp: nowIso,
              note: `Admin menugaskan tiket kepada ${assignee.name}. ${reason ? `Alasan: "${reason}"` : ''}`,
            },
          ],
        };
      })
    );

    addToast(
      'success',
      'Penugasan Diperbarui',
      assignee
        ? `Tiket ${targetTicketNumber} berhasil ditugaskan ke ${assignee.name}.`
        : `Tiket ${targetTicketNumber} dikembalikan ke status Open tanpa penanggung jawab.`
    );
  };

  // Admin Override Status
  const handleAdminOverrideStatus = (
    ticketId: string,
    newStatus: TicketStatus,
    reason: string
  ) => {
    const nowIso = new Date().toISOString();
    const adminName = currentUser?.name || 'Admin PlisHelp';
    let targetNum = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        targetNum = t.number;
        return {
          ...t,
          status: newStatus,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: `Admin Status Override to ${newStatus}`,
              actor: adminName,
              actorRole: 'Admin',
              timestamp: nowIso,
              note: `Administrator melakukan koreksi status ke ${newStatus}. Alasan: "${reason}"`,
            },
          ],
        };
      })
    );

    addToast(
      'info',
      'Override Status Berhasil',
      `Status tiket ${targetNum} berhasil diubah ke ${newStatus}.`
    );
  };

  // 3. Request Information
  const handleRequestInfo = (ticketId: string, message: string) => {
    const nowIso = new Date().toISOString();
    const supportName = currentUser?.name || 'Budi Santoso';
    let targetTicketNumber = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        targetTicketNumber = t.number;
        return {
          ...t,
          status: 'NEED_INFO',
          updatedAt: nowIso,
          slaInfo: t.slaInfo ? { ...t.slaInfo, status: 'PAUSED' } : undefined,
          comments: [
            ...t.comments,
            {
              id: `com-${Date.now()}`,
              authorName: supportName,
              authorRole: currentUser?.role || 'IT Support',
              body: `[PERMINTAAN INFORMASI]: ${message}`,
              createdAt: nowIso,
              isInternal: false,
            },
          ],
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Status Changed to NEED_INFO',
              actor: supportName,
              actorRole: currentUser?.role || 'IT Support',
              timestamp: nowIso,
              note: `Meminta informasi tambahan: "${message.slice(0, 60)}..."`,
            },
          ],
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId,
      ticketNumber: targetTicketNumber,
      title: 'Informasi Tambahan Diperlukan',
      message: `${supportName} memerlukan informasi tambahan pada tiket ${targetTicketNumber}: "${message}"`,
      type: 'action_required',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'info',
      'Permintaan Info Dikirim',
      `Status tiket diubah ke Need Info dan penghitungan SLA di-pause.`
    );
  };

  // 4. Resolve Ticket
  const handleResolveTicket = (ticketId: string, resolutionSummary: string) => {
    const nowIso = new Date().toISOString();
    const supportName = currentUser?.name || 'Budi Santoso';
    let resolvedTicketNumber = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        resolvedTicketNumber = t.number;
        return {
          ...t,
          status: 'RESOLVED',
          resolvedAt: nowIso,
          resolutionSummary,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Resolved',
              actor: supportName,
              actorRole: currentUser?.role || 'IT Support',
              timestamp: nowIso,
              note: `Tiket diselesaikan dengan ringkasan: "${resolutionSummary}"`,
            },
          ],
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId,
      ticketNumber: resolvedTicketNumber,
      title: 'Tiket Telah Diselesaikan (Resolved)',
      message: `Tiket ${resolvedTicketNumber} telah selesai. Mohon konfirmasi penutupan tiket.`,
      type: 'resolved',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'success',
      'Tiket Ditandai Resolved',
      `Tiket ${resolvedTicketNumber} berhasil diselesaikan. Menunggu konfirmasi requester.`
    );
  };

  // 5. Escalate Ticket
  const handleEscalateTicket = (ticketId: string, reason: string) => {
    const nowIso = new Date().toISOString();
    const supportName = currentUser?.name || 'Budi Santoso';
    let escalatedNumber = '';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        escalatedNumber = t.number;
        return {
          ...t,
          status: 'ESCALATED',
          escalationReason: reason,
          updatedAt: nowIso,
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: 'Ticket Escalated',
              actor: supportName,
              actorRole: currentUser?.role || 'IT Support',
              timestamp: nowIso,
              note: `Eskalasi ke level yang lebih tinggi: "${reason}"`,
            },
          ],
        };
      })
    );

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      ticketId,
      ticketNumber: escalatedNumber,
      title: 'Tiket Dieskalasi',
      message: `Tiket ${escalatedNumber} telah dieskalasi ke tim specialist IT Admin.`,
      type: 'escalated',
      isRead: false,
      createdAt: nowIso,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      'info',
      'Tiket Berhasil Dieskalasi',
      `Tiket ${escalatedNumber} telah dialihkan ke status Escalated.`
    );
  };

  // 6. Comments (Public & Internal)
  const handleAddComment = (ticketId: string, commentBody: string, isInternal = false) => {
    const nowIso = new Date().toISOString();
    const authorName = currentUser?.name || 'User';
    const authorRole = currentUser?.role || 'Employee';

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const nextStatus =
          t.status === 'NEED_INFO' && authorRole === 'Employee' ? 'IN_PROGRESS' : t.status;
        const nextSlaStatus =
          t.status === 'NEED_INFO' && authorRole === 'Employee' ? 'WITHIN_SLA' : t.slaInfo?.status;

        return {
          ...t,
          status: nextStatus,
          updatedAt: nowIso,
          slaInfo: t.slaInfo ? { ...t.slaInfo, status: nextSlaStatus as any } : undefined,
          comments: [
            ...t.comments,
            {
              id: `com-${Date.now()}`,
              authorName,
              authorRole,
              body: commentBody,
              createdAt: nowIso,
              isInternal,
            },
          ],
          activities: [
            ...t.activities,
            {
              id: `act-${Date.now()}`,
              action: isInternal
                ? 'Internal Note Added'
                : authorRole === 'Employee'
                ? 'Requester Added Reply'
                : `${authorRole} Added Comment`,
              actor: authorName,
              actorRole: authorRole as TicketRole,
              timestamp: nowIso,
              note: isInternal
                ? 'Catatan troubleshooting internal ditambahkan.'
                : `Membalas pesan: "${commentBody.slice(0, 50)}${commentBody.length > 50 ? '...' : ''}"`,
            },
          ],
        };
      })
    );

    addToast(
      'success',
      isInternal ? 'Catatan Tersimpan' : 'Pesan Terkirim',
      isInternal
        ? 'Catatan internal berhasil disimpan khusus untuk tim IT.'
        : 'Pesan Anda berhasil dikirimkan.'
    );
  };

  // 7. Employee Closes Ticket
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

  // 8. Employee Reopens Ticket
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

  // 9. Employee Submits Rating
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

  // 10. Admin User Management CRUD
  const handleSaveUser = (userData: {
    id?: string;
    name: string;
    email: string;
    role: TicketRole;
    department: string;
    status: 'ACTIVE' | 'INACTIVE';
  }) => {
    if (userData.id) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userData.id ? { ...u, ...userData } : u))
      );
      addToast('success', 'User Diperbarui', `Data akun ${userData.name} berhasil disimpan.`);
    } else {
      const newUser: ManagedUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        department: userData.department,
        status: userData.status,
        createdAt: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      addToast('success', 'User Dibuat', `Akun baru ${userData.name} berhasil ditambahkan.`);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : u
      )
    );
    addToast('info', 'Status Akun', 'Status keaktifan akun berhasil diubah.');
  };

  // 11. Admin Department Management CRUD
  const handleSaveDepartment = (deptData: {
    id?: string;
    name: string;
    code: string;
    active: boolean;
  }) => {
    if (deptData.id) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === deptData.id ? { ...d, ...deptData } : d))
      );
      addToast('success', 'Departemen Diperbarui', `Departemen ${deptData.name} berhasil diubah.`);
    } else {
      const newDept: DepartmentInfo = {
        id: `dept-${Date.now()}`,
        name: deptData.name,
        code: deptData.code,
        active: deptData.active,
        employeeCount: 0,
      };
      setDepartments((prev) => [...prev, newDept]);
      addToast('success', 'Departemen Dibuat', `Departemen baru ${deptData.name} berhasil dibuat.`);
    }
  };

  const handleToggleDepartmentStatus = (deptId: string) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === deptId ? { ...d, active: !d.active } : d))
    );
    addToast('info', 'Status Departemen', 'Status keaktifan departemen berhasil diubah.');
  };

  // 12. Admin Category Management CRUD
  const handleSaveCategory = (catData: {
    id?: string;
    name: string;
    subcategories: string[];
    active: boolean;
  }) => {
    if (catData.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === catData.id ? { ...c, ...catData } : c))
      );
      addToast('success', 'Kategori Diperbarui', `Kategori ${catData.name} berhasil diubah.`);
    } else {
      const newCat: CategoryInfo = {
        id: `cat-${Date.now()}`,
        name: catData.name,
        subcategories: catData.subcategories,
        active: catData.active,
      };
      setCategories((prev) => [...prev, newCat]);
      addToast('success', 'Kategori Dibuat', `Kategori baru ${catData.name} berhasil dibuat.`);
    }
  };

  const handleToggleCategoryStatus = (catId: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, active: c.active === false ? true : false } : c))
    );
    addToast('info', 'Status Kategori', 'Status keaktifan kategori berhasil diubah.');
  };

  // 13. Admin SLA Policies Update
  const handleSaveSLAPolicies = (updatedPolicies: SLAPolicyItem[]) => {
    setSlaPolicies(updatedPolicies);
    addToast('success', 'Kebijakan SLA Disimpan', 'Target SLA berhasil disinkronkan ke seluruh sistem.');
  };

  // Notifications Handlers
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] transition-all"
            >
              <span>Masuk sebagai {selectedRole}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
            Employee: <code className="text-zinc-400">employee123</code> · Support:{' '}
            <code className="text-zinc-400">support123</code> · Admin:{' '}
            <code className="text-zinc-400">admin123</code>
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
