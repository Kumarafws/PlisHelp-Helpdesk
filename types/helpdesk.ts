export type TicketRole = 'Employee' | 'IT Support' | 'Admin';

export type TicketStatus = 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'NEED_INFO' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED' 
  | 'REOPENED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketType = 'Incident' | 'Service Request';

export interface CategoryInfo {
  id: string;
  name: string;
  subcategories: string[];
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: string; // e.g. "1.2 MB"
  fileType: string;
  url?: string;
  uploadedAt: string;
}

export interface TicketComment {
  id: string;
  authorName: string;
  authorRole: TicketRole;
  authorAvatar?: string;
  body: string;
  createdAt: string;
  isInternal: boolean;
}

export interface TicketActivity {
  id: string;
  action: string;
  actor: string;
  actorRole: TicketRole;
  timestamp: string;
  note?: string;
}

export interface TicketRating {
  score: number; // 1 to 5
  feedback?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  number: string; // e.g. "PH-20260825-0005"
  title: string;
  type: TicketType;
  category: string;
  subcategory: string;
  priority: TicketPriority;
  status: TicketStatus;
  requesterName: string;
  requesterEmail: string;
  requesterDepartment: string;
  assigneeName?: string;
  assigneeEmail?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  slaDueAt?: string;
  slaStatus?: 'Within SLA' | 'Near Breach' | 'Breached';
  description: string;
  resolutionSummary?: string;
  attachments: TicketAttachment[];
  comments: TicketComment[];
  activities: TicketActivity[];
  rating?: TicketRating;
}

export interface NotificationItem {
  id: string;
  ticketId?: string;
  ticketNumber?: string;
  title: string;
  message: string;
  type: 'status_change' | 'comment' | 'action_required' | 'resolved' | 'assigned';
  isRead: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: TicketRole;
  department: string;
  avatarUrl?: string;
}

export interface DashboardSummary {
  total: number;
  open: number;
  inProgress: number;
  needInfo: number;
  resolved: number;
  closed: number;
  actionRequiredCount: number;
}
