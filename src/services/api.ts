import type { WorkOrderStatus, Priority } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Spring Boot REST API Integration Client
 * Appendix B API Reference implementation
 */
export class KeystoneApiClient {
  private static token: string | null = localStorage.getItem('keystone_jwt_token');

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
    };
  }

  // POST /api/auth/login
  static async login(email: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Authentication failed');
    const data = await res.json();
    this.token = data.token;
    if (this.token) localStorage.setItem('keystone_jwt_token', this.token);
    return data;
  }

  // GET /api/work-orders (role-scoped, filterable, paginated)
  static async getWorkOrders(params?: { status?: WorkOrderStatus; priority?: Priority; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE_URL}/work-orders?${query}`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch work orders');
    return await res.json();
  }

  // POST /api/work-orders
  static async createWorkOrder(data: { title: string; description: string; priority: Priority; customerId: string; siteId: string }) {
    const res = await fetch(`${API_BASE_URL}/work-orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create work order');
    return await res.json();
  }

  // POST /api/work-orders/{id}/assign
  static async assignWorkOrder(workOrderId: string, technicianId: string) {
    const res = await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/assign`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ technicianId })
    });
    if (!res.ok) throw new Error('Failed to assign technician');
    return await res.json();
  }

  // POST /api/work-orders/{id}/status (Governed State Machine Transition)
  static async transitionStatus(workOrderId: string, nextStatus: WorkOrderStatus, note?: string) {
    const res = await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/status`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ status: nextStatus, note })
    });
    if (!res.ok) throw new Error('Illegal state transition or unauthorized action');
    return await res.json();
  }

  // POST /api/work-orders/{id}/parts (Transactional Parts Usage)
  static async logPartsUsage(workOrderId: string, partId: string, quantity: number) {
    const res = await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/parts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ partId, quantity })
    });
    if (!res.ok) throw new Error('Failed to log part usage or stock insufficient');
    return await res.json();
  }

  // POST /api/work-orders/{id}/time (Log Labor Time)
  static async logTime(workOrderId: string, minutes: number, note: string) {
    const res = await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/time`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ minutes, note })
    });
    if (!res.ok) throw new Error('Failed to log time');
    return await res.json();
  }

  // GET /api/reports/summary
  static async getDashboardMetrics() {
    const res = await fetch(`${API_BASE_URL}/reports/summary`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return await res.json();
  }
}
