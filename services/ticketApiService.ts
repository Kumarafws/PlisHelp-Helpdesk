import { apiClient, tokenStorage } from '@/lib/apiClient';
import {
  adaptCategory,
  adaptDepartment,
  adaptNotification,
  adaptSlaPolicy,
  adaptTicket,
  adaptUser,
  adaptUserProfile,
} from './adapters';
import {
  CategoryInfo,
  DepartmentInfo,
  ManagedUser,
  NotificationItem,
  SLAPolicyItem,
  Ticket,
  UserProfile,
} from '@/types/helpdesk';

export const ticketApiService = {
  // ==========================================
  // 1. AUTHENTICATION
  // ==========================================
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await apiClient.post<any>('/auth/login', { email, password });
    const token = res.access_token;
    const user = adaptUserProfile(res.user);

    tokenStorage.set(token);
    tokenStorage.setUser(user);

    return { token, user };
  },

  async getMe(): Promise<UserProfile> {
    const res = await apiClient.get<any>('/auth/me');
    const user = adaptUserProfile(res.user);
    tokenStorage.setUser(user);
    return user;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // ignore errors during logout
    } finally {
      tokenStorage.clear();
    }
  },

  // ==========================================
  // 2. TICKETS & WORKFLOW ACTIONS
  // ==========================================
  async getTickets(params?: {
    status?: string;
    priority?: string;
    category_id?: string;
    q?: string;
    page?: number;
    per_page?: number;
  }): Promise<{ tickets: Ticket[]; total: number; currentPage: number; lastPage: number }> {
    const res = await apiClient.get<any>('/tickets', {
      per_page: 50,
      ...params,
    });

    const rawList = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
    const tickets = rawList.map(adaptTicket);

    return {
      tickets,
      total: res.total || tickets.length,
      currentPage: res.current_page || 1,
      lastPage: res.last_page || 1,
    };
  },

  async getTicketDetail(id: string): Promise<Ticket> {
    const res = await apiClient.get<any>(`/tickets/${id}`);
    return adaptTicket(res);
  },

  async createTicket(payload: {
    title: string;
    description: string;
    type?: string;
    category_id: string | number;
    subcategory_id?: string | number;
    subcategory_name?: string;
    priority?: string;
    department_id?: string | number;
    attachments?: Array<{
      file_name: string;
      file_size: string;
      file_type: string;
      path: string;
    }>;
  }): Promise<Ticket> {
    const res = await apiClient.post<any>('/tickets', payload);
    return adaptTicket(res.ticket || res);
  },

  async takeTicket(id: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/take`);
    return adaptTicket(res.ticket || res);
  },

  async assignTicket(id: string, assigneeId: string | number | null, reason?: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/assign`, {
      assignee_id: assigneeId,
      reason,
    });
    return adaptTicket(res.ticket || res);
  },

  async overrideStatus(id: string, status: string, reason: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/override-status`, {
      status,
      reason,
    });
    return adaptTicket(res.ticket || res);
  },

  async requestInfo(id: string, message: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/request-info`, {
      message,
    });
    return adaptTicket(res.ticket || res);
  },

  async resolveTicket(id: string, resolutionSummary: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/resolve`, {
      resolution_summary: resolutionSummary,
    });
    return adaptTicket(res.ticket || res);
  },

  async escalateTicket(id: string, reason: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/escalate`, {
      reason,
    });
    return adaptTicket(res.ticket || res);
  },

  async closeTicket(id: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/close`);
    return adaptTicket(res.ticket || res);
  },

  async reopenTicket(id: string, reason: string): Promise<Ticket> {
    const res = await apiClient.post<any>(`/tickets/${id}/reopen`, {
      reason,
    });
    return adaptTicket(res.ticket || res);
  },

  async submitRating(id: string, score: number, feedback?: string): Promise<any> {
    const res = await apiClient.post<any>(`/tickets/${id}/rating`, {
      score,
      feedback,
    });
    return res;
  },

  async addComment(id: string, body: string, isInternal: boolean = false): Promise<any> {
    const res = await apiClient.post<any>(`/tickets/${id}/comments`, {
      body,
      is_internal: isInternal,
    });
    return res;
  },

  // ==========================================
  // 3. DASHBOARD ANALYTICS
  // ==========================================
  async getDashboardSummary(): Promise<any> {
    return apiClient.get<any>('/dashboard/summary');
  },

  // ==========================================
  // 4. NOTIFICATIONS
  // ==========================================
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await apiClient.get<any>('/notifications');
    const rawList = Array.isArray(res) ? res : res.data || [];
    return rawList.map(adaptNotification);
  },

  async markNotificationRead(id: string): Promise<void> {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiClient.post('/notifications/mark-all-read');
  },

  // ==========================================
  // 5. USER MANAGEMENT (ADMIN)
  // ==========================================
  async getUsers(params?: { role?: string; status?: string; q?: string; page?: number }): Promise<ManagedUser[]> {
    const res = await apiClient.get<any>('/users', {
      per_page: 100,
      ...params,
    });
    const rawList = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
    return rawList.map(adaptUser);
  },

  async createUser(payload: {
    name: string;
    email: string;
    password?: string;
    role: string;
    department_id?: string | number;
    status?: string;
  }): Promise<ManagedUser> {
    const res = await apiClient.post<any>('/users', payload);
    return adaptUser(res.user || res);
  },

  async updateUser(
    id: string,
    payload: {
      name: string;
      email: string;
      password?: string;
      role: string;
      department_id?: string | number;
      status?: string;
    }
  ): Promise<ManagedUser> {
    const res = await apiClient.put<any>(`/users/${id}`, payload);
    return adaptUser(res.user || res);
  },

  async toggleUserStatus(id: string): Promise<ManagedUser> {
    const res = await apiClient.patch<any>(`/users/${id}/toggle-status`);
    return adaptUser(res.user || res);
  },

  // ==========================================
  // 6. MASTER DATA (DEPARTMENTS, CATEGORIES, SLA)
  // ==========================================
  async getDepartments(): Promise<DepartmentInfo[]> {
    const res = await apiClient.get<any>('/departments');
    const rawList = Array.isArray(res) ? res : [];
    return rawList.map(adaptDepartment);
  },

  async saveDepartment(payload: {
    id?: string | number;
    name: string;
    code: string;
    is_active?: boolean;
  }): Promise<DepartmentInfo> {
    const res = await apiClient.post<any>('/departments', payload);
    return adaptDepartment(res.department || res);
  },

  async toggleDepartmentStatus(id: string): Promise<DepartmentInfo> {
    const res = await apiClient.patch<any>(`/departments/${id}/toggle-status`);
    return adaptDepartment(res.department || res);
  },

  async getCategories(): Promise<CategoryInfo[]> {
    const res = await apiClient.get<any>('/categories');
    const rawList = Array.isArray(res) ? res : [];
    return rawList.map(adaptCategory);
  },

  async saveCategory(payload: {
    id?: string | number;
    name: string;
    is_active?: boolean;
    subcategories?: string[];
  }): Promise<CategoryInfo> {
    const res = await apiClient.post<any>('/categories', payload);
    return adaptCategory(res.category || res);
  },

  async toggleCategoryStatus(id: string): Promise<CategoryInfo> {
    const res = await apiClient.patch<any>(`/categories/${id}/toggle-status`);
    return adaptCategory(res.category || res);
  },

  async getSlaPolicies(): Promise<SLAPolicyItem[]> {
    const res = await apiClient.get<any>('/sla-policies');
    const rawList = Array.isArray(res) ? res : [];
    return rawList.map(adaptSlaPolicy);
  },

  async saveSlaPolicies(policies: Array<{
    priority: string;
    response_target_minutes: number;
    resolution_target_hours: number;
    description?: string;
  }>): Promise<SLAPolicyItem[]> {
    const res = await apiClient.post<any>('/sla-policies', { policies });
    const rawList = Array.isArray(res.policies) ? res.policies : [];
    return rawList.map(adaptSlaPolicy);
  },
};
