export type Role = 'DISPATCHER' | 'TECHNICIAN' | 'MANAGER' | 'CUSTOMER';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type WorkOrderStatus = 
  | 'NEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CLOSED'
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  sitesCount: number;
}

export interface Site {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  address: string;
}

export interface WorkOrder {
  id: string;
  code: string;
  title: string;
  description: string;
  priority: Priority;
  status: WorkOrderStatus;
  slaDueAt: string;
  createdAt: string;
  customerId: string;
  customerName: string;
  siteId: string;
  siteName: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToAvatar?: string;
  partsCost: number;
  laborMinutes: number;
}

export interface WorkOrderStatusHistory {
  id: string;
  workOrderId: string;
  fromStatus: WorkOrderStatus | null;
  toStatus: WorkOrderStatus;
  changedByUserId: string;
  changedByUserName: string;
  changedAt: string;
  note?: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  unitCost: number;
  stockQty: number;
}

export interface PartUsage {
  id: string;
  workOrderId: string;
  partId: string;
  partName: string;
  unitCost: number;
  qtyUsed: number;
  totalCost: number;
}

export interface TimeLog {
  id: string;
  workOrderId: string;
  technicianId: string;
  technicianName: string;
  minutes: number;
  note?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'sla_breach' | 'assignment' | 'inventory' | 'status_change';
  timestamp: string;
  read: boolean;
  workOrderId?: string;
}

export interface TechnicianPerformance {
  id: string;
  name: string;
  avatarUrl: string;
  completedJobs: number;
  slaPercentage: number;
}
