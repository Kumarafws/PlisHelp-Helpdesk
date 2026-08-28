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

export type SLAStatusType = 'WITHIN_SLA' | 'AT_RISK' | 'BREACHED' | 'PAUSED';

export interface CategoryInfo {
  id: string;
  name: string;
  subcategories: string[];
  active?: boolean;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  active: boolean;
  employeeCount: number;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: TicketRole;
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SLAPolicyItem {
  id: string;
  priority: TicketPriority;
  responseTargetMinutes: number;
  resolutionTargetHours: number;
  description: string;
  active: boolean;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: string;
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
  isInternal: boolean; // true = Internal Note (Support/Admin only)
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

export interface TicketSLAInfo {
  responseTargetMinutes: number;
  responseActualMinutes?: number;
  resolutionTargetHours: number;
  remainingTimeFormatted: string;
  status: SLAStatusType;
}

export interface Ticket {
  id: string;
  number: string;
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
  slaInfo?: TicketSLAInfo;
  description: string;
  resolutionSummary?: string;
  escalationReason?: string;
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
  type: 'status_change' | 'comment' | 'action_required' | 'resolved' | 'assigned' | 'escalated';
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

export interface SupportDashboardSummary {
  assignedToMe: number;
  inProgress: number;
  needInfo: number;
  overdueOrAtRisk: number;
  resolved: number;
  availableCount: number;
}

export interface AdminDashboardSummary {
  totalTickets: number;
  open: number;
  assigned: number;
  inProgress: number;
  needInfo: number;
  resolved: number;
  closed: number;
  overdue: number;
  totalEmployees: number;
  totalSupport: number;
  slaComplianceRate: number; // e.g. 96.4
}
