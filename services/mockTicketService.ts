import {
  CategoryInfo,
  DashboardSummary,
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

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    id: 'cat-net',
    name: 'Network & Connectivity',
    subcategories: ['Wi-Fi Kantor', 'VPN & Remote Access', 'Koneksi LAN Kabel', 'DNS & Proxy'],
  },
  {
    id: 'cat-hw',
    name: 'Hardware & Devices',
    subcategories: ['Laptop / PC', 'Monitor Eksternal', 'Keyboard / Mouse', 'Printer & Scanner', 'Docking Station'],
  },
  {
    id: 'cat-sw',
    name: 'Software & Application',
    subcategories: ['Operating System (Windows/Mac)', 'Adobe Creative Cloud', 'Microsoft 365 / Office', 'Figma', 'Antivirus'],
  },
  {
    id: 'cat-acc',
    name: 'Access & Accounts',
    subcategories: ['Shared Drive Marketing', 'Email Perusahaan', 'Portal HR / Payroll', 'ERP & Database Access'],
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
    requesterDepartment: 'Marketing',
    assigneeName: 'Budi Santoso (IT Support)',
    assigneeEmail: 'budi@plishelp.co.id',
    createdAt: '2026-08-25T09:20:00Z',
    updatedAt: '2026-08-25T11:15:00Z',
    slaDueAt: '2026-08-26T17:00:00Z',
    slaStatus: 'Within SLA',
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
    requesterDepartment: 'Marketing',
    assigneeName: 'Dimas Saputra (IT Support)',
    assigneeEmail: 'dimas@plishelp.co.id',
    createdAt: '2026-08-24T14:10:00Z',
    updatedAt: '2026-08-25T15:30:00Z',
    resolvedAt: '2026-08-25T15:30:00Z',
    slaDueAt: '2026-08-26T14:00:00Z',
    slaStatus: 'Within SLA',
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
    requesterDepartment: 'Marketing',
    assigneeName: 'Budi Santoso (IT Support)',
    assigneeEmail: 'budi@plishelp.co.id',
    createdAt: '2026-08-24T11:00:00Z',
    updatedAt: '2026-08-25T08:45:00Z',
    slaDueAt: '2026-08-25T18:00:00Z',
    slaStatus: 'Within SLA',
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
    requesterDepartment: 'Marketing',
    createdAt: '2026-08-25T16:00:00Z',
    updatedAt: '2026-08-25T16:00:00Z',
    slaDueAt: '2026-08-27T16:00:00Z',
    slaStatus: 'Within SLA',
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
    requesterDepartment: 'Marketing',
    assigneeName: 'Dimas Saputra (IT Support)',
    assigneeEmail: 'dimas@plishelp.co.id',
    createdAt: '2026-08-20T08:30:00Z',
    updatedAt: '2026-08-21T16:40:00Z',
    resolvedAt: '2026-08-21T15:00:00Z',
    closedAt: '2026-08-21T16:40:00Z',
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

export function generateTicketNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PH-${dateStr}-${randomSuffix}`;
}
