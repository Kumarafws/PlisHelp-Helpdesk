import {
  CategoryInfo,
  DepartmentInfo,
  ManagedUser,
  SLAPolicyItem,
  DashboardSummary,
  SupportDashboardSummary,
  AdminDashboardSummary,
  NotificationItem,
  Ticket,
  TicketActivity,
  TicketComment,
  TicketPriority,
  TicketRating,
  TicketStatus,
  TicketType,
  UserProfile,
} from '@/types/helpdesk';

export const CURRENT_EMPLOYEE: UserProfile = {
  id: 'usr-101',
  name: 'Andi Pratama',
  email: 'andi@plishelp.co.id',
  role: 'Employee',
  department: 'Marketing',
};

export const CURRENT_SUPPORT: UserProfile = {
  id: 'usr-102',
  name: 'Budi Santoso',
  email: 'budi@plishelp.co.id',
  role: 'IT Support',
  department: 'IT Operations',
};

export const CURRENT_ADMIN: UserProfile = {
  id: 'usr-103',
  name: 'Admin PlisHelp',
  email: 'admin@plishelp.co.id',
  role: 'Admin',
  department: 'IT Infrastructure & Security',
};

export const INITIAL_DEPARTMENTS: DepartmentInfo[] = [
  { id: 'dept-1', name: 'Marketing & Communications', code: 'MKTG', active: true, employeeCount: 24 },
  { id: 'dept-2', name: 'IT Operations & Helpdesk', code: 'IT-OPS', active: true, employeeCount: 8 },
  { id: 'dept-3', name: 'Finance & Accounting', code: 'FIN', active: true, employeeCount: 16 },
  { id: 'dept-4', name: 'Human Resources & General Affairs', code: 'HRGA', active: true, employeeCount: 12 },
  { id: 'dept-5', name: 'Sales & Business Development', code: 'SALES', active: true, employeeCount: 30 },
  { id: 'dept-6', name: 'Engineering & Software Product', code: 'ENG', active: true, employeeCount: 45 },
];

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    name: 'Andi Pratama',
    email: 'andi@plishelp.co.id',
    role: 'Employee',
    department: 'Marketing & Communications',
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'usr-2',
    name: 'Budi Santoso',
    email: 'budi@plishelp.co.id',
    role: 'IT Support',
    department: 'IT Operations & Helpdesk',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr-3',
    name: 'Dimas Saputra',
    email: 'dimas@plishelp.co.id',
    role: 'IT Support',
    department: 'IT Operations & Helpdesk',
    status: 'ACTIVE',
    createdAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr-4',
    name: 'Siti Rahmawati',
    email: 'siti@plishelp.co.id',
    role: 'IT Support',
    department: 'IT Operations & Helpdesk',
    status: 'ACTIVE',
    createdAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'usr-5',
    name: 'Admin PlisHelp',
    email: 'admin@plishelp.co.id',
    role: 'Admin',
    department: 'IT Operations & Helpdesk',
    status: 'ACTIVE',
    createdAt: '2025-12-01T08:00:00Z',
  },
  {
    id: 'usr-6',
    name: 'Clara Wijaya',
    email: 'clara@plishelp.co.id',
    role: 'Employee',
    department: 'Finance & Accounting',
    status: 'ACTIVE',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'usr-7',
    name: 'Rian Kurniawan',
    email: 'rian@plishelp.co.id',
    role: 'Employee',
    department: 'Human Resources & General Affairs',
    status: 'INACTIVE',
    createdAt: '2026-03-10T08:00:00Z',
  },
];

export const INITIAL_SLA_POLICIES: SLAPolicyItem[] = [
  {
    id: 'sla-1',
    priority: 'URGENT',
    responseTargetMinutes: 15,
    resolutionTargetHours: 2,
    description: 'Kendala kritis yang menghentikan operasional seluruh tim/departemen.',
    active: true,
  },
  {
    id: 'sla-2',
    priority: 'HIGH',
    responseTargetMinutes: 30,
    resolutionTargetHours: 4,
    description: 'Gangguan serius pada perangkat/koneksi kerja utama individu.',
    active: true,
  },
  {
    id: 'sla-3',
    priority: 'MEDIUM',
    responseTargetMinutes: 60,
    resolutionTargetHours: 12,
    description: 'Permintaan software standar atau kendala non-blocking.',
    active: true,
  },
  {
    id: 'sla-4',
    priority: 'LOW',
    responseTargetMinutes: 120,
    resolutionTargetHours: 48,
    description: 'Pertanyaan umum atau permohonan akses minor jangka panjang.',
    active: true,
  },
];

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-net',
    name: 'Network & Connectivity',
    subcategories: ['Wi-Fi Kantor', 'VPN & Remote Access', 'Koneksi LAN Kabel', 'DNS & Proxy'],
    active: true,
  },
  {
    id: 'cat-hw',
    name: 'Hardware & Devices',
    subcategories: ['Laptop / PC', 'Monitor Eksternal', 'Keyboard / Mouse', 'Printer & Scanner', 'Docking Station'],
    active: true,
  },
  {
    id: 'cat-sw',
    name: 'Software & Application',
    subcategories: ['Operating System (Windows/Mac)', 'Adobe Creative Cloud', 'Microsoft 365 / Office', 'Figma', 'Antivirus'],
    active: true,
  },
  {
    id: 'cat-acc',
    name: 'Access & Accounts',
    subcategories: ['Shared Drive Marketing', 'Email Perusahaan', 'Portal HR / Payroll', 'ERP & Database Access'],
    active: true,
  },
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-001',
    number: 'PH-20260825-0005',
    title: 'Laptop sering terputus dari Wi-Fi kantor saat meeting',
    type: 'Incident',
    category: 'Network & Connectivity',
    subcategory: 'Wi-Fi Kantor',
    priority: 'HIGH',
    status: 'NEED_INFO',
    requesterName: 'Andi Pratama',
    requesterEmail: 'andi@plishelp.co.id',
    requesterDepartment: 'Marketing & Communications',
    assigneeName: 'Budi Santoso',
    assigneeEmail: 'budi@plishelp.co.id',
    createdAt: '2026-08-25T09:20:00Z',
    updatedAt: '2026-08-25T11:15:00Z',
    slaDueAt: '2026-08-26T17:00:00Z',
    slaInfo: {
      responseTargetMinutes: 30,
      responseActualMinutes: 15,
      resolutionTargetHours: 4,
      remainingTimeFormatted: '01h 20m',
      status: 'PAUSED',
    },
    description:
      'Sejak pagi laptop saya di lantai 3 ruang rapat Marketing sering putus-nyambung dari SSID "Company_Corporate". Sudah mencoba restart laptop dan disable-enable Wi-Fi adapter namun masih berulang.',
    attachments: [
      {
        id: 'att-1',
        fileName: 'wifi_error_event_log.png',
        fileSize: '1.4 MB',
        fileType: 'image/png',
        uploadedAt: '2026-08-25T09:20:00Z',
      },
    ],
    comments: [
      {
        id: 'com-1',
        authorName: 'Budi Santoso',
        authorRole: 'IT Support',
        body: 'Halo Andi, saya sudah memeriksa access point di lantai 3. Apakah Anda bisa menginfokan MAC Address Wi-Fi laptop Anda agar bisa kami cek log di controller AP?',
        createdAt: '2026-08-25T10:30:00Z',
        isInternal: false,
      },
      {
        id: 'com-int-1',
        authorName: 'Budi Santoso',
        authorRole: 'IT Support',
        body: 'Investigasi awal: Access Point AP-L3-MKTG menunjukkan packet drop 8% pada channel 5GHz. Kemungkinan perlu reboot AP setelah jam kantor.',
        createdAt: '2026-08-25T10:32:00Z',
        isInternal: true,
      },
    ],
    activities: [
      {
        id: 'act-1',
        action: 'Ticket Created',
        actor: 'Andi Pratama',
        actorRole: 'Employee',
        timestamp: '2026-08-25T09:20:00Z',
        note: 'Tiket berhasil dibuat oleh requester.',
      },
      {
        id: 'act-2',
        action: 'Assigned to IT Support',
        actor: 'System / Budi Santoso',
        actorRole: 'IT Support',
        timestamp: '2026-08-25T09:35:00Z',
        note: 'Tiket ditugaskan kepada Budi Santoso.',
      },
      {
        id: 'act-3',
        action: 'Status Changed to NEED_INFO',
        actor: 'Budi Santoso',
        actorRole: 'IT Support',
        timestamp: '2026-08-25T10:30:00Z',
        note: 'Menunggu respon requester terkait MAC Address laptop.',
      },
    ],
  },
  {
    id: 'tkt-002',
    number: 'PH-20260825-0006',
    title: 'Permintaan lisensi & instalasi Figma Enterprise untuk tim Design Marketing',
    type: 'Service Request',
    category: 'Software & Application',
    subcategory: 'Figma',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    requesterName: 'Andi Pratama',
    requesterEmail: 'andi@plishelp.co.id',
    requesterDepartment: 'Marketing & Communications',
    assigneeName: 'Dimas Saputra',
    assigneeEmail: 'dimas@plishelp.co.id',
    createdAt: '2026-08-24T14:10:00Z',
    updatedAt: '2026-08-25T15:30:00Z',
    resolvedAt: '2026-08-25T15:30:00Z',
    slaDueAt: '2026-08-26T14:00:00Z',
    slaInfo: {
      responseTargetMinutes: 30,
      responseActualMinutes: 20,
      resolutionTargetHours: 8,
      remainingTimeFormatted: 'Selesai',
      status: 'WITHIN_SLA',
    },
    description:
      'Mohon dibantu pemberian lisensi Figma Enterprise seat Editor dan aktivasi SSO untuk akun andi@plishelp.co.id sesuai persetujuan Head of Marketing.',
    resolutionSummary:
      'Akun Figma Enterprise seat Editor sudah ditambahkan ke workspace perusahaan dan SSO telah diaktivasi. Silakan login menggunakan Google Workspace SSO.',
    attachments: [
      {
        id: 'att-2',
        fileName: 'approval_email_head_of_mktg.pdf',
        fileSize: '320 KB',
        fileType: 'application/pdf',
        uploadedAt: '2026-08-24T14:10:00Z',
      },
    ],
    comments: [
      {
        id: 'com-2',
        authorName: 'Dimas Saputra',
        authorRole: 'IT Support',
        body: 'Halo Andi, lisensi sudah dialokasikan dan email aktivasi dari Figma sudah dikirimkan ke andi@plishelp.co.id. Mohon dicoba login dan konfirmasi kembali ya.',
        createdAt: '2026-08-25T15:30:00Z',
        isInternal: false,
      },
    ],
    activities: [
      {
        id: 'act-4',
        action: 'Ticket Created',
        actor: 'Andi Pratama',
        actorRole: 'Employee',
        timestamp: '2026-08-24T14:10:00Z',
      },
      {
        id: 'act-5',
        action: 'In Progress',
        actor: 'Dimas Saputra',
        actorRole: 'IT Support',
        timestamp: '2026-08-24T15:00:00Z',
      },
      {
        id: 'act-6',
        action: 'Resolved',
        actor: 'Dimas Saputra',
        actorRole: 'IT Support',
        timestamp: '2026-08-25T15:30:00Z',
        note: 'IT Support menandai tiket sebagai Resolved.',
      },
    ],
  },
  {
    id: 'tkt-003',
    number: 'PH-20260824-0003',
    title: 'Monitor eksternal kedua tidak mendeteksi sinyal HDMI',
    type: 'Incident',
    category: 'Hardware & Devices',
    subcategory: 'Monitor Eksternal',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    requesterName: 'Andi Pratama',
    requesterEmail: 'andi@plishelp.co.id',
    requesterDepartment: 'Marketing & Communications',
    assigneeName: 'Budi Santoso',
    assigneeEmail: 'budi@plishelp.co.id',
    createdAt: '2026-08-24T11:00:00Z',
    updatedAt: '2026-08-25T08:45:00Z',
    slaDueAt: '2026-08-25T18:00:00Z',
    slaInfo: {
      responseTargetMinutes: 30,
      responseActualMinutes: 10,
      resolutionTargetHours: 4,
      remainingTimeFormatted: '00h 45m',
      status: 'AT_RISK',
    },
    description:
      'Monitor Dell di meja saya mati total lampu indikatornya dan tidak ada sinyal saat dihubungkan kabel HDMI ke docking station.',
    attachments: [],
    comments: [
      {
        id: 'com-3',
        authorName: 'Budi Santoso',
        authorRole: 'IT Support',
        body: 'Kabel adapter power monitor sedang kami siapkan untuk dites langsung di meja Anda siang ini pukul 13.30.',
        createdAt: '2026-08-25T08:45:00Z',
        isInternal: false,
      },
    ],
    activities: [
      {
        id: 'act-7',
        action: 'Ticket Created',
        actor: 'Andi Pratama',
        actorRole: 'Employee',
        timestamp: '2026-08-24T11:00:00Z',
      },
      {
        id: 'act-8',
        action: 'In Progress',
        actor: 'Budi Santoso',
        actorRole: 'IT Support',
        timestamp: '2026-08-24T13:00:00Z',
      },
    ],
  },
  {
    id: 'tkt-004',
    number: 'PH-20260823-0002',
    title: 'Permintaan akses folder Google Shared Drive "Brand-Assets-2026"',
    type: 'Service Request',
    category: 'Access & Accounts',
    subcategory: 'Shared Drive Marketing',
    priority: 'LOW',
    status: 'OPEN',
    requesterName: 'Andi Pratama',
    requesterEmail: 'andi@plishelp.co.id',
    requesterDepartment: 'Marketing & Communications',
    createdAt: '2026-08-25T16:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
    slaDueAt: '2026-08-27T16:00:00Z',
    slaInfo: {
      responseTargetMinutes: 60,
      resolutionTargetHours: 24,
      remainingTimeFormatted: '22h 10m',
      status: 'WITHIN_SLA',
    },
    description:
      'Membutuhkan akses Content Manager ke Google Shared Drive Brand-Assets-2026 untuk upload video kampanye Q3.',
    attachments: [],
    comments: [],
    activities: [
      {
        id: 'act-9',
        action: 'Ticket Created',
        actor: 'Andi Pratama',
        actorRole: 'Employee',
        timestamp: '2026-08-25T16:00:00Z',
      },
    ],
  },
  {
    id: 'tkt-005',
    number: 'PH-20260820-0001',
    title: 'Update & patching Adobe Premiere Pro sering force close',
    type: 'Incident',
    category: 'Software & Application',
    subcategory: 'Adobe Creative Cloud',
    priority: 'URGENT',
    status: 'CLOSED',
    requesterName: 'Andi Pratama',
    requesterEmail: 'andi@plishelp.co.id',
    requesterDepartment: 'Marketing & Communications',
    assigneeName: 'Dimas Saputra',
    assigneeEmail: 'dimas@plishelp.co.id',
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-21T16:40:00Z',
    resolvedAt: '2026-08-21T15:00:00Z',
    closedAt: '2026-08-21T16:40:00Z',
    slaInfo: {
      responseTargetMinutes: 15,
      responseActualMinutes: 8,
      resolutionTargetHours: 2,
      remainingTimeFormatted: 'Selesai',
      status: 'WITHIN_SLA',
    },
    description:
      'Premiere Pro crash setiap kali export file 4K H.265. Membutuhkan update patch driver GPU NVIDIA.',
    resolutionSummary: 'Driver NVIDIA Studio diupdate ke versi 552.22 dan cache Adobe di-clear. Export render 4K berhasil lancar.',
    attachments: [],
    comments: [
      {
        id: 'com-4',
        authorName: 'Dimas Saputra',
        authorRole: 'IT Support',
        body: 'Driver Studio sudah diperbarui dan diuji coba rendering.',
        createdAt: '2026-08-21T15:00:00Z',
        isInternal: false,
      },
      {
        id: 'com-5',
        authorName: 'Andi Pratama',
        authorRole: 'Employee',
        body: 'Terima kasih banyak, sudah saya tes dan sekarang export video berjalan mulus.',
        createdAt: '2026-08-21T16:35:00Z',
        isInternal: false,
      },
    ],
    activities: [
      { id: 'act-10', action: 'Ticket Created', actor: 'Andi Pratama', actorRole: 'Employee', timestamp: '2026-08-20T08:30:00Z' },
      { id: 'act-11', action: 'Resolved', actor: 'Dimas Saputra', actorRole: 'IT Support', timestamp: '2026-08-21T15:00:00Z' },
      { id: 'act-12', action: 'Closed by Requester', actor: 'Andi Pratama', actorRole: 'Employee', timestamp: '2026-08-21T16:40:00Z', note: 'Requester mengonfirmasi tiket terselesaikan.' },
      { id: 'act-13', action: 'Rating Submitted', actor: 'Andi Pratama', actorRole: 'Employee', timestamp: '2026-08-21T16:42:00Z', note: 'Memberikan rating 5 bintang.' },
    ],
    rating: {
      score: 5,
      feedback: 'Respon cepat dan teknisi sangat solutif. Terima kasih!',
      createdAt: '2026-08-21T16:42:00Z',
    },
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    ticketId: 'tkt-001',
    ticketNumber: 'PH-20260825-0005',
    title: 'Informasi Tambahan Diperlukan',
    message: 'Budi Santoso meminta informasi MAC Address pada tiket PH-20260825-0005.',
    type: 'action_required',
    isRead: false,
    createdAt: '2026-08-25T10:30:00Z',
  },
  {
    id: 'notif-2',
    ticketId: 'tkt-002',
    ticketNumber: 'PH-20260825-0006',
    title: 'Tiket Telah Diselesaikan (Resolved)',
    message: 'Tiket permohonan Figma Anda telah selesai. Mohon periksa dan konfirmasi penyelesaian.',
    type: 'resolved',
    isRead: false,
    createdAt: '2026-08-25T15:30:00Z',
  },
  {
    id: 'notif-3',
    ticketId: 'tkt-003',
    ticketNumber: 'PH-20260824-0003',
    title: 'Komentar Baru dari IT Support',
    message: 'Budi Santoso menambahkan respon terkait pengetesan adaptor monitor.',
    type: 'comment',
    isRead: true,
    createdAt: '2026-08-25T08:45:00Z',
  },
];

export function computeSummary(tickets: Ticket[]): DashboardSummary {
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED').length;
  const needInfo = tickets.filter((t) => t.status === 'NEED_INFO').length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
  const closed = tickets.filter((t) => t.status === 'CLOSED').length;
  const actionRequiredCount = needInfo + resolved;

  return {
    total: tickets.length,
    open,
    inProgress,
    needInfo,
    resolved,
    closed,
    actionRequiredCount,
  };
}

export function computeSupportSummary(tickets: Ticket[], supportUser: UserProfile): SupportDashboardSummary {
  const assignedToMe = tickets.filter(
    (t) => (t.assigneeEmail === supportUser.email || t.assigneeName?.includes(supportUser.name)) && t.status !== 'CLOSED'
  ).length;

  const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED').length;
  const needInfo = tickets.filter((t) => t.status === 'NEED_INFO').length;
  const overdueOrAtRisk = tickets.filter(
    (t) => t.slaInfo?.status === 'AT_RISK' || t.slaInfo?.status === 'BREACHED'
  ).length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
  const availableCount = tickets.filter(
    (t) => t.status === 'OPEN' || !t.assigneeName || t.assigneeName === 'Belum Ditugaskan'
  ).length;

  return {
    assignedToMe,
    inProgress,
    needInfo,
    overdueOrAtRisk,
    resolved,
    availableCount,
  };
}

export function computeAdminSummary(
  tickets: Ticket[],
  users: ManagedUser[]
): AdminDashboardSummary {
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const assigned = tickets.filter(
    (t) => t.status === 'OPEN' && t.assigneeName && t.assigneeName !== 'Belum Ditugaskan'
  ).length;
  const inProgress = tickets.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED').length;
  const needInfo = tickets.filter((t) => t.status === 'NEED_INFO').length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
  const closed = tickets.filter((t) => t.status === 'CLOSED').length;
  const overdue = tickets.filter((t) => t.slaInfo?.status === 'BREACHED').length;

  const totalEmployees = users.filter((u) => u.role === 'Employee' && u.status === 'ACTIVE').length;
  const totalSupport = users.filter((u) => u.role === 'IT Support' && u.status === 'ACTIVE').length;

  const breachedCount = tickets.filter((t) => t.slaInfo?.status === 'BREACHED').length;
  const totalCompletedOrActive = tickets.length || 1;
  const slaComplianceRate = Math.round(((totalCompletedOrActive - breachedCount) / totalCompletedOrActive) * 1000) / 10;

  return {
    totalTickets: tickets.length,
    open,
    assigned,
    inProgress,
    needInfo,
    resolved,
    closed,
    overdue,
    totalEmployees,
    totalSupport,
    slaComplianceRate,
  };
}

export function generateTicketNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PH-${dateStr}-${randomSuffix}`;
}
