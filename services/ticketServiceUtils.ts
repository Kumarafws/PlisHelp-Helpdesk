import {
  DashboardSummary,
  SupportDashboardSummary,
  AdminDashboardSummary,
  Ticket,
  UserProfile,
  ManagedUser,
} from '@/types/helpdesk';

/**
 * Calculates Employee Dashboard ticket status counters
 */
export function computeSummary(tickets: Ticket[]): DashboardSummary {
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgress = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED'
  ).length;
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

/**
 * Calculates IT Support Resolver Dashboard queue metrics
 */
export function computeSupportSummary(
  tickets: Ticket[],
  supportUser: UserProfile
): SupportDashboardSummary {
  const assignedToMe = tickets.filter(
    (t) =>
      (t.assigneeEmail === supportUser.email ||
        (t.assigneeName && supportUser.name && t.assigneeName.includes(supportUser.name))) &&
      t.status !== 'CLOSED'
  ).length;

  const inProgress = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED'
  ).length;
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

/**
 * Calculates Admin System Dashboard metrics & SLA compliance
 */
export function computeAdminSummary(
  tickets: Ticket[],
  users: ManagedUser[]
): AdminDashboardSummary {
  const open = tickets.filter((t) => t.status === 'OPEN').length;
  const assigned = tickets.filter(
    (t) => t.status === 'OPEN' && t.assigneeName && t.assigneeName !== 'Belum Ditugaskan'
  ).length;
  const inProgress = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'REOPENED'
  ).length;
  const needInfo = tickets.filter((t) => t.status === 'NEED_INFO').length;
  const resolved = tickets.filter((t) => t.status === 'RESOLVED').length;
  const closed = tickets.filter((t) => t.status === 'CLOSED').length;
  const overdue = tickets.filter((t) => t.slaInfo?.status === 'BREACHED').length;

  const totalEmployees = users.filter((u) => u.role === 'Employee' && u.status === 'ACTIVE').length;
  const totalSupport = users.filter((u) => u.role === 'IT Support' && u.status === 'ACTIVE').length;

  const breachedCount = tickets.filter((t) => t.slaInfo?.status === 'BREACHED').length;
  const totalCompletedOrActive = tickets.length || 1;
  const slaComplianceRate =
    Math.round(((totalCompletedOrActive - breachedCount) / totalCompletedOrActive) * 1000) / 10;

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

/**
 * Generate human-readable ticket number
 */
export function generateTicketNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `PH-${dateStr}-${randomSuffix}`;
}
