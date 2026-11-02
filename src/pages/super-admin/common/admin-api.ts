import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';

export interface AdminMetrics {
  total_customers: number;
  active_tenants: number;
  total_monthly_recurring_revenue: number;
  total_gross_volume: number;
  open_support_tickets: number;
  tickets_breached_sla: number;
}

export interface AdminCustomer {
  company_id: string;
  company_name: string;
  owner_email: string;
  subscription_plan: string;
  status: string;
  mrr: number;
  total_invoices: number;
  total_payments: number;
  gross_volume: number;
  created_at: string;
  last_active_at?: string;
}

export interface SupportTicket {
  id: string;
  ticket_number: string;
  company_id: string;
  company_name: string;
  reporter_user_id: string;
  reporter_email: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_ON_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  created_at: string;
  updated_at: string;
  sla_due_at?: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_user_id: string;
  sender_name?: string;
  sender_email?: string;
  is_platform_admin: boolean;
  is_internal_note: boolean;
  message: string;
  created_at: string;
}

export const adminApi = {
  getMetrics: async (): Promise<AdminMetrics> => {
    const res = await request('GET', endpoint('/api/v1/admin/metrics'));
    return (res.data?.data || res.data) as AdminMetrics;
  },

  getCustomers: async (page = 1, perPage = 50): Promise<AdminCustomer[]> => {
    const res = await request('GET', endpoint(`/api/v1/admin/customers?page=${page}&per_page=${perPage}`));
    return (res.data?.data || res.data || []) as AdminCustomer[];
  },

  getCustomerDetails: async (companyId: string): Promise<AdminCustomer> => {
    const res = await request('GET', endpoint(`/api/v1/admin/customers/${companyId}`));
    return (res.data?.data || res.data) as AdminCustomer;
  },

  impersonateCustomer: async (companyId: string): Promise<string> => {
    const res = await request('POST', endpoint(`/api/v1/admin/customers/${companyId}/impersonate`));
    return res.data?.token;
  },

  getSupportTickets: async (status?: string, page = 1, perPage = 30): Promise<SupportTicket[]> => {
    const query = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}&page=${page}&per_page=${perPage}` : `?page=${page}&per_page=${perPage}`;
    const res = await request('GET', endpoint(`/api/v1/admin/support/tickets${query}`));
    return (res.data?.data || res.data || []) as SupportTicket[];
  },

  createSupportTicket: async (data: {
    company_id?: string;
    account_id?: string;
    subject: string;
    priority: string;
    category: string;
    message: string;
  }): Promise<SupportTicket> => {
    const res = await request('POST', endpoint('/api/v1/admin/support/tickets'), data);
    return (res.data?.data || res.data) as SupportTicket;
  },

  getTicketMessages: async (ticketId: string): Promise<SupportTicketMessage[]> => {
    const res = await request('GET', endpoint(`/api/v1/admin/support/tickets/${ticketId}/messages`));
    return (res.data?.data || res.data || []) as SupportTicketMessage[];
  },

  replyToTicket: async (
    ticketId: string,
    payload: { message: string; is_internal_note: boolean; status?: string }
  ): Promise<SupportTicketMessage> => {
    const res = await request('POST', endpoint(`/api/v1/admin/support/tickets/${ticketId}/reply`), payload);
    return (res.data?.data || res.data) as SupportTicketMessage;
  },
};
