import {
  CategoryInfo,
  DepartmentInfo,
  ManagedUser,
  NotificationItem,
  SLAPolicyItem,
  Ticket,
  TicketActivity,
  TicketAttachment,
  TicketComment,
  TicketPriority,
  TicketRating,
  TicketRole,
  TicketStatus,
  TicketType,
  UserProfile,
} from '@/types/helpdesk';

export function calculateRemainingSla(slaDueAt?: string, status?: string): string {
  if (status === 'RESOLVED' || status === 'CLOSED') {
    return 'Completed';
  }
  if (status === 'NEED_INFO') {
    return 'Paused';
  }
  if (!slaDueAt) return '-';

  const due = new Date(slaDueAt).getTime();
  const now = Date.now();
  const diffMs = due - now;

  if (diffMs <= 0) {
    return '00h 00m (Breached)';
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;
}

export function adaptUser(raw: any): ManagedUser {
  return {
    id: String(raw.id),
    name: raw.name || '',
    email: raw.email || '',
    role: (raw.role || 'Employee') as TicketRole,
    department: raw.department?.name || raw.department_name || 'General',
    status: (raw.status || 'ACTIVE') as 'ACTIVE' | 'INACTIVE',
    createdAt: raw.created_at || new Date().toISOString(),
  };
}

export function adaptUserProfile(raw: any): UserProfile {
  return {
    id: String(raw.id),
    name: raw.name || '',
    email: raw.email || '',
    role: (raw.role || 'Employee') as TicketRole,
    department: raw.department?.name || raw.department || 'General',
    avatarUrl: raw.avatar_url || undefined,
  };
}

export function adaptDepartment(raw: any): DepartmentInfo {
  return {
    id: String(raw.id),
    name: raw.name || '',
    code: raw.code || '',
    active: typeof raw.is_active === 'boolean' ? raw.is_active : true,
    employeeCount: raw.users_count || raw.employee_count || 0,
  };
}

export function adaptCategory(raw: any): CategoryInfo {
  const subcategories = Array.isArray(raw.subcategories)
    ? raw.subcategories.map((s: any) => (typeof s === 'string' ? s : s.name))
    : [];

  return {
    id: String(raw.id),
    name: raw.name || '',
    subcategories,
    active: typeof raw.is_active === 'boolean' ? raw.is_active : true,
  };
}

export function adaptSlaPolicy(raw: any): SLAPolicyItem {
  return {
    id: String(raw.id),
    priority: (raw.priority || 'MEDIUM') as TicketPriority,
    responseTargetMinutes: Number(raw.response_target_minutes || 60),
    resolutionTargetHours: Number(raw.resolution_target_hours || 24),
    description: raw.description || '',
    active: true,
  };
}

export function adaptNotification(raw: any): NotificationItem {
  return {
    id: String(raw.id),
    ticketId: raw.ticket_id ? String(raw.ticket_id) : undefined,
    ticketNumber: raw.ticket_number || undefined,
    title: raw.title || '',
    message: raw.message || '',
    type: (raw.type || 'status_change') as any,
    isRead: Boolean(raw.is_read),
    createdAt: raw.created_at || new Date().toISOString(),
  };
}

export function adaptComment(raw: any): TicketComment {
  return {
    id: String(raw.id),
    authorName: raw.author_name || raw.author?.name || 'User',
    authorRole: (raw.author_role || raw.author?.role || 'Employee') as TicketRole,
    authorAvatar: raw.author_avatar || undefined,
    body: raw.body || '',
    createdAt: raw.created_at || new Date().toISOString(),
    isInternal: Boolean(raw.is_internal),
  };
}

export function adaptActivity(raw: any): TicketActivity {
  return {
    id: String(raw.id),
    action: raw.action || '',
    actor: raw.actor_name || raw.actor || 'System',
    actorRole: (raw.actor_role || 'Employee') as TicketRole,
    timestamp: raw.created_at || raw.timestamp || new Date().toISOString(),
    note: raw.note || undefined,
  };
}

export function adaptAttachment(raw: any): TicketAttachment {
  return {
    id: String(raw.id),
    fileName: raw.file_name || raw.fileName || 'file',
    fileSize: raw.file_size || raw.fileSize || '1 MB',
    fileType: raw.file_type || raw.fileType || 'application/octet-stream',
    url: raw.path || raw.url || undefined,
    uploadedAt: raw.created_at || raw.uploadedAt || new Date().toISOString(),
  };
}

export function adaptRating(raw: any): TicketRating | undefined {
  if (!raw) return undefined;
  return {
    score: Number(raw.score || 5),
    feedback: raw.feedback || undefined,
    createdAt: raw.created_at || new Date().toISOString(),
  };
}

export function adaptTicket(raw: any): Ticket {
  const comments = Array.isArray(raw.comments) ? raw.comments.map(adaptComment) : [];
  const activities = Array.isArray(raw.activities) ? raw.activities.map(adaptActivity) : [];
  const attachments = Array.isArray(raw.attachments) ? raw.attachments.map(adaptAttachment) : [];
  const rating = adaptRating(raw.rating);

  const slaRemaining = calculateRemainingSla(raw.sla_due_at, raw.status);

  return {
    id: String(raw.id),
    number: raw.number || `TKT-${raw.id}`,
    title: raw.title || '',
    type: (raw.type || 'Incident') as TicketType,
    category: raw.category?.name || raw.category || 'General',
    subcategory: raw.subcategory?.name || raw.subcategory_name || raw.subcategory || '',
    priority: (raw.priority || 'MEDIUM') as TicketPriority,
    status: (raw.status || 'OPEN') as TicketStatus,
    requesterName: raw.requester?.name || raw.requesterName || 'Karyawan',
    requesterEmail: raw.requester?.email || raw.requesterEmail || '',
    requesterDepartment:
      raw.department?.name ||
      raw.requester?.department?.name ||
      raw.requesterDepartment ||
      'General',
    assigneeName: raw.assignee?.name || raw.assigneeName || undefined,
    assigneeEmail: raw.assignee?.email || raw.assigneeEmail || undefined,
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
    resolvedAt: raw.resolved_at || undefined,
    closedAt: raw.closed_at || undefined,
    slaDueAt: raw.sla_due_at || undefined,
    slaInfo: {
      responseTargetMinutes: Number(raw.sla_response_minutes || 30),
      responseActualMinutes: raw.first_response_at ? 15 : undefined,
      resolutionTargetHours: Number(raw.sla_resolution_hours || 4),
      remainingTimeFormatted: slaRemaining,
      status: (raw.sla_status || 'WITHIN_SLA') as any,
    },
    description: raw.description || '',
    resolutionSummary: raw.resolution_summary || undefined,
    escalationReason: raw.escalation_reason || undefined,
    attachments,
    comments,
    activities,
    rating,
  };
}
