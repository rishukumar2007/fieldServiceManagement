import type { 
  User, Customer, Site, WorkOrder, WorkOrderStatusHistory, 
  Part, TechnicianPerformance 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'John Manager',
    email: 'john.manager@meridian.com',
    role: 'MANAGER',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-2',
    name: 'Sarah Dispatcher',
    email: 'sarah.dispatch@meridian.com',
    role: 'DISPATCHER',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-3',
    name: 'Mike Smith',
    email: 'mike.smith@meridian.com',
    role: 'TECHNICIAN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-4',
    name: 'Sarah Johnson',
    email: 'sarah.j@meridian.com',
    role: 'TECHNICIAN',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-5',
    name: 'David Brown',
    email: 'david.b@meridian.com',
    role: 'TECHNICIAN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-6',
    name: 'Chris Wilson',
    email: 'chris.w@meridian.com',
    role: 'TECHNICIAN',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-7',
    name: 'Alice Acme (Customer)',
    email: 'alice@acmecorp.com',
    role: 'CUSTOMER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Acme Corp', contactEmail: 'contact@acmecorp.com', contactPhone: '+1 555-0192', sitesCount: 4 },
  { id: 'cust-2', name: 'Global Industries', contactEmail: 'facilities@globalind.com', contactPhone: '+1 555-0184', sitesCount: 6 },
  { id: 'cust-3', name: 'Sunset Holdings', contactEmail: 'ops@sunsetholdings.com', contactPhone: '+1 555-0129', sitesCount: 2 },
  { id: 'cust-4', name: 'Tech Park Ltd', contactEmail: 'maintenance@techpark.com', contactPhone: '+1 555-0143', sitesCount: 8 }
];

export const INITIAL_SITES: Site[] = [
  { id: 'site-1', customerId: 'cust-1', customerName: 'Acme Corp', name: 'Acme HQ - Tower A', address: '100 Innovation Way, Suite 400' },
  { id: 'site-2', customerId: 'cust-2', customerName: 'Global Industries', name: 'Global Logistics Hub', address: '450 Industrial Pkwy, Bldg 2' },
  { id: 'site-3', customerId: 'cust-3', customerName: 'Sunset Holdings', name: 'Sunset Commercial Plaza', address: '880 Sunset Blvd, Floor 3' },
  { id: 'site-4', customerId: 'cust-4', customerName: 'Tech Park Ltd', name: 'Tech Park Center', address: '12 Technology Dr, Bldg C' }
];

export const INITIAL_PARTS: Part[] = [
  { id: 'part-1', name: 'HVAC Air Filter 20x25x1', sku: 'FLT-HVAC-2025', unitCost: 24.50, stockQty: 45 },
  { id: 'part-2', name: 'R-410A Refrigerant 25lb', sku: 'REF-R410A-25', unitCost: 185.00, stockQty: 12 },
  { id: 'part-3', name: '20A Dual-Pole Breaker', sku: 'ELC-BRK-20A', unitCost: 38.00, stockQty: 30 },
  { id: 'part-4', name: 'Commercial Pipe Sealant 500ml', sku: 'PLM-SLT-500', unitCost: 18.25, stockQty: 18 },
  { id: 'part-5', name: 'Heavy Duty Contactor 30A', sku: 'ELC-CNT-30A', unitCost: 52.00, stockQty: 8 }
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-1001',
    code: 'WO-1001',
    title: 'AC not cooling in Main Conference Room',
    description: 'Chiller compressor tripping on high pressure cutout. Needs refrigerant check and filter coil cleaning.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    slaDueAt: '2024-05-18T18:00:00Z',
    createdAt: '2024-05-16T09:30:00Z',
    customerId: 'cust-1',
    customerName: 'Acme Corp',
    siteId: 'site-1',
    siteName: 'Acme HQ - Tower A',
    assignedToId: 'usr-3',
    assignedToName: 'Mike Smith',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    partsCost: 49.00,
    laborMinutes: 90
  },
  {
    id: 'WO-1002',
    code: 'WO-1002',
    title: 'Electrical failure on 3rd Floor Lighting Circuit',
    description: 'Main breaker tripping intermittently under load. Suspect damaged wiring near distribution panel 3B.',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    slaDueAt: '2024-05-19T14:00:00Z',
    createdAt: '2024-05-16T11:15:00Z',
    customerId: 'cust-2',
    customerName: 'Global Industries',
    siteId: 'site-2',
    siteName: 'Global Logistics Hub',
    assignedToId: 'usr-4',
    assignedToName: 'Sarah Johnson',
    assignedToAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    partsCost: 0,
    laborMinutes: 0
  },
  {
    id: 'WO-1003',
    code: 'WO-1003',
    title: 'Pipe leakage under West Wing Restroom Sink',
    description: 'Water leaking onto tile floor. Main shutoff valve bypassed temporarily. Requires sealant and fitting replace.',
    priority: 'LOW',
    status: 'ON_HOLD',
    slaDueAt: '2024-05-20T10:00:00Z',
    createdAt: '2024-05-15T16:20:00Z',
    customerId: 'cust-3',
    customerName: 'Sunset Holdings',
    siteId: 'site-3',
    siteName: 'Sunset Commercial Plaza',
    assignedToId: 'usr-5',
    assignedToName: 'David Brown',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    partsCost: 18.25,
    laborMinutes: 45
  },
  {
    id: 'WO-1004',
    code: 'WO-1004',
    title: 'Routine maintenance of Emergency Backup Generator',
    description: 'Quarterly oil level check, battery load test, and automatic transfer switch (ATS) simulation test.',
    priority: 'LOW',
    status: 'NEW',
    slaDueAt: '2024-05-22T17:00:00Z',
    createdAt: '2024-05-17T08:00:00Z',
    customerId: 'cust-4',
    customerName: 'Tech Park Ltd',
    siteId: 'site-4',
    siteName: 'Tech Park Center',
    assignedToId: undefined,
    assignedToName: 'Unassigned',
    partsCost: 0,
    laborMinutes: 0
  },
  {
    id: 'WO-1005',
    code: 'WO-1005',
    title: 'Generator failed start test during power outage test',
    description: 'Starter motor clicking without turning engine over. Check battery voltage and starter solenoid relay.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    slaDueAt: '2024-05-18T12:00:00Z',
    createdAt: '2024-05-17T07:45:00Z',
    customerId: 'cust-1',
    customerName: 'Acme Corp',
    siteId: 'site-1',
    siteName: 'Acme HQ - Tower A',
    assignedToId: 'usr-3',
    assignedToName: 'Mike Smith',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    partsCost: 52.00,
    laborMinutes: 120
  }
];

export const INITIAL_TECHNICIAN_PERFORMANCE: TechnicianPerformance[] = [
  { id: 'usr-3', name: 'Mike Smith', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', completedJobs: 25, slaPercentage: 96 },
  { id: 'usr-4', name: 'Sarah Johnson', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', completedJobs: 18, slaPercentage: 92 },
  { id: 'usr-5', name: 'David Brown', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', completedJobs: 15, slaPercentage: 90 },
  { id: 'usr-6', name: 'Chris Wilson', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', completedJobs: 12, slaPercentage: 88 }
];

export const INITIAL_STATUS_HISTORY: WorkOrderStatusHistory[] = [
  {
    id: 'hist-1',
    workOrderId: 'WO-1001',
    fromStatus: null,
    toStatus: 'NEW',
    changedByUserId: 'usr-7',
    changedByUserName: 'Alice Acme (Customer)',
    changedAt: '2024-05-16T09:30:00Z',
    note: 'Request raised via customer portal'
  },
  {
    id: 'hist-2',
    workOrderId: 'WO-1001',
    fromStatus: 'NEW',
    toStatus: 'ASSIGNED',
    changedByUserId: 'usr-2',
    changedByUserName: 'Sarah Dispatcher',
    changedAt: '2024-05-16T10:00:00Z',
    note: 'Assigned to HVAC Lead Mike Smith'
  },
  {
    id: 'hist-3',
    workOrderId: 'WO-1001',
    fromStatus: 'ASSIGNED',
    toStatus: 'IN_PROGRESS',
    changedByUserId: 'usr-3',
    changedByUserName: 'Mike Smith',
    changedAt: '2024-05-16T10:30:00Z',
    note: 'Arrived on site. Diagnosing pressure trip.'
  }
];
