import React, { createContext, useContext, useState, useEffect } from 'react';
import type { 
  User, Customer, Site, WorkOrder, WorkOrderStatus, Priority, 
  WorkOrderStatusHistory, Part, PartUsage, TimeLog, TechnicianPerformance,
  NotificationItem
} from '../types';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface DataContextType {
  isAuthenticated: boolean;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  users: User[];
  customers: Customer[];
  sites: Site[];
  workOrders: WorkOrder[];
  statusHistory: WorkOrderStatusHistory[];
  parts: Part[];
  partUsages: PartUsage[];
  timeLogs: TimeLog[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  technicianPerformance: TechnicianPerformance[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: Toast[];
  addToast: (type: 'success' | 'error' | 'info', message: string) => void;
  removeToast: (id: string) => void;
  
  // Work Order State Machine Operations
  createWorkOrder: (data: {
    title: string;
    description: string;
    priority: Priority;
    customerId: string;
    siteId: string;
  }) => void;
  
  assignWorkOrder: (workOrderId: string, technicianId: string, note?: string) => boolean;
  transitionStatus: (workOrderId: string, nextStatus: WorkOrderStatus, note?: string) => boolean;
  logPartUsage: (workOrderId: string, partId: string, qty: number) => boolean;
  logTimeSpent: (workOrderId: string, minutes: number, note: string) => boolean;
  
  // Filtering & Helper queries
  getWorkOrderHistory: (workOrderId: string) => WorkOrderStatusHistory[];
  getWorkOrderParts: (workOrderId: string) => PartUsage[];
  getWorkOrderTimeLogs: (workOrderId: string) => TimeLog[];
}

const getRelativeDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
};

const INITIAL_USERS: User[] = [
  { id: 'usr-1', name: 'John Miller', email: 'john.m@meridian.com', role: 'MANAGER', avatarUrl: '' },
  { id: 'usr-2', name: 'Sarah Vance', email: 'sarah.v@meridian.com', role: 'DISPATCHER', avatarUrl: '' },
  { id: 'usr-3', name: 'Mike Smith', email: 'mike.smith@meridian.com', role: 'TECHNICIAN', avatarUrl: '' },
  { id: 'usr-4', name: 'Sarah Johnson', email: 'sarah.j@meridian.com', role: 'TECHNICIAN', avatarUrl: '' },
  { id: 'usr-5', name: 'David Brown', email: 'david.b@meridian.com', role: 'TECHNICIAN', avatarUrl: '' },
  { id: 'usr-6', name: 'Chris Wilson', email: 'chris.w@meridian.com', role: 'TECHNICIAN', avatarUrl: '' },
  { id: 'usr-7', name: 'Alice Acme (Client)', email: 'alice@acmecorp.com', role: 'CUSTOMER', avatarUrl: '' }
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust-1', name: 'Acme Corp', contactEmail: 'contact@acmecorp.com', contactPhone: '+1 555-0192', sitesCount: 4 },
  { id: 'cust-2', name: 'Global Industries', contactEmail: 'facilities@globalind.com', contactPhone: '+1 555-0184', sitesCount: 6 },
  { id: 'cust-3', name: 'Sunset Holdings', contactEmail: 'ops@sunsetholdings.com', contactPhone: '+1 555-0129', sitesCount: 2 },
  { id: 'cust-4', name: 'Tech Park Ltd', contactEmail: 'maintenance@techpark.com', contactPhone: '+1 555-0143', sitesCount: 8 }
];

const INITIAL_SITES: Site[] = [
  { id: 'site-1', customerId: 'cust-1', customerName: 'Acme Corp', name: 'Acme HQ - Tower A', address: '100 Innovation Way, Suite 400' },
  { id: 'site-2', customerId: 'cust-2', customerName: 'Global Industries', name: 'Global Logistics Hub', address: '450 Industrial Pkwy, Bldg 2' },
  { id: 'site-3', customerId: 'cust-3', customerName: 'Sunset Holdings', name: 'Sunset Commercial Plaza', address: '880 Sunset Blvd, Floor 3' },
  { id: 'site-4', customerId: 'cust-4', customerName: 'Tech Park Ltd', name: 'Tech Park Center', address: '12 Technology Dr, Bldg C' }
];

const INITIAL_PARTS: Part[] = [
  { id: 'part-1', name: 'HVAC Air Filter 20x25x1', sku: 'FLT-HVAC-2025', unitCost: 24.50, stockQty: 45 },
  { id: 'part-2', name: 'R-410A Refrigerant 25lb', sku: 'REF-R410A-25', unitCost: 185.00, stockQty: 12 },
  { id: 'part-3', name: '20A Dual-Pole Breaker', sku: 'ELC-BRK-20A', unitCost: 38.00, stockQty: 30 },
  { id: 'part-4', name: 'Commercial Pipe Sealant 500ml', sku: 'PLM-SLT-500', unitCost: 18.25, stockQty: 18 },
  { id: 'part-5', name: 'Heavy Duty Contactor 30A', sku: 'ELC-CNT-30A', unitCost: 52.00, stockQty: 8 }
];

const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-1001',
    code: 'WO-1001',
    title: 'AC not cooling in Main Conference Room',
    description: 'Chiller compressor tripping on high pressure cutout. Needs refrigerant check and filter coil cleaning.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    slaDueAt: getRelativeDate(1),
    createdAt: getRelativeDate(-1),
    customerId: 'cust-1',
    customerName: 'Acme Corp',
    siteId: 'site-1',
    siteName: 'Acme HQ - Tower A',
    assignedToId: 'usr-3',
    assignedToName: 'Mike Smith',
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
    slaDueAt: getRelativeDate(2),
    createdAt: getRelativeDate(-1),
    customerId: 'cust-2',
    customerName: 'Global Industries',
    siteId: 'site-2',
    siteName: 'Global Logistics Hub',
    assignedToId: 'usr-4',
    assignedToName: 'Sarah Johnson',
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
    slaDueAt: getRelativeDate(3),
    createdAt: getRelativeDate(-2),
    customerId: 'cust-3',
    customerName: 'Sunset Holdings',
    siteId: 'site-3',
    siteName: 'Sunset Commercial Plaza',
    assignedToId: 'usr-5',
    assignedToName: 'David Brown',
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
    slaDueAt: getRelativeDate(4),
    createdAt: getRelativeDate(0),
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
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    slaDueAt: getRelativeDate(-1), // Past due! SLA breach alert
    createdAt: getRelativeDate(-2),
    customerId: 'cust-1',
    customerName: 'Acme Corp',
    siteId: 'site-1',
    siteName: 'Acme HQ - Tower A',
    assignedToId: 'usr-3',
    assignedToName: 'Mike Smith',
    partsCost: 52.00,
    laborMinutes: 120
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'SLA Breach Alert',
    message: 'Urgent Job WO-1005 (Acme Corp) has breached resolution SLA window.',
    type: 'sla_breach',
    timestamp: getRelativeDate(0),
    read: false,
    workOrderId: 'WO-1005'
  },
  {
    id: 'notif-2',
    title: 'Job Assigned',
    message: 'WO-1002 assigned to Sarah Johnson for Global Logistics Hub.',
    type: 'assignment',
    timestamp: getRelativeDate(-1),
    read: false,
    workOrderId: 'WO-1002'
  },
  {
    id: 'notif-3',
    title: 'Low Stock Inventory Alert',
    message: 'Heavy Duty Contactor 30A stock is down to 8 units.',
    type: 'inventory',
    timestamp: getRelativeDate(-1),
    read: true
  }
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('keystone_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('keystone_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users] = useState<User[]>(INITIAL_USERS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [sites] = useState<Site[]>(INITIAL_SITES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('keystone_work_orders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });
  const [statusHistory, setStatusHistory] = useState<WorkOrderStatusHistory[]>([]);
  const [parts, setParts] = useState<Part[]>(INITIAL_PARTS);
  const [partUsages, setPartUsages] = useState<PartUsage[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('keystone_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('keystone_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('keystone_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  const login = (email: string): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsAuthenticated(true);
      addToast('success', `Welcome back, ${found.name}! Signed in as ${found.role}.`);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('info', 'Signed out of KEYSTONE.');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('info', 'All notifications cleared.');
  };

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const computeSlaDueDate = (priority: Priority): string => {
    const now = new Date();
    let hoursToAdd = 48;
    if (priority === 'URGENT') hoursToAdd = 4;
    else if (priority === 'HIGH') hoursToAdd = 24;
    else if (priority === 'MEDIUM') hoursToAdd = 48;
    else if (priority === 'LOW') hoursToAdd = 72;

    const due = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000);
    return due.toISOString();
  };

  const technicianPerformance: TechnicianPerformance[] = users
    .filter(u => u.role === 'TECHNICIAN')
    .map(t => {
      const techJobs = workOrders.filter(w => w.assignedToId === t.id);
      const completed = techJobs.filter(w => w.status === 'COMPLETED' || w.status === 'CLOSED').length;
      return {
        id: t.id,
        name: t.name,
        avatarUrl: t.avatarUrl || '',
        completedJobs: completed + 12,
        slaPercentage: Math.min(100, 88 + (completed * 2))
      };
    });

  const createWorkOrder = (data: {
    title: string;
    description: string;
    priority: Priority;
    customerId: string;
    siteId: string;
  }) => {
    const cust = customers.find(c => c.id === data.customerId);
    const site = sites.find(s => s.id === data.siteId);
    if (!cust || !site) return;

    const nextCodeNum = 1000 + workOrders.length + 1;
    const newWo: WorkOrder = {
      id: `WO-${nextCodeNum}`,
      code: `WO-${nextCodeNum}`,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'NEW',
      slaDueAt: computeSlaDueDate(data.priority),
      createdAt: new Date().toISOString(),
      customerId: cust.id,
      customerName: cust.name,
      siteId: site.id,
      siteName: site.name,
      assignedToId: undefined,
      assignedToName: 'Unassigned',
      partsCost: 0,
      laborMinutes: 0
    };

    const auditRow: WorkOrderStatusHistory = {
      id: `hist-${Date.now()}`,
      workOrderId: newWo.id,
      fromStatus: null,
      toStatus: 'NEW',
      changedByUserId: currentUser.id,
      changedByUserName: currentUser.name,
      changedAt: new Date().toISOString(),
      note: 'Work order raised'
    };

    setWorkOrders(prev => [newWo, ...prev]);
    setStatusHistory(prev => [...prev, auditRow]);

    // Push live system notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Work Order Created',
      message: `${newWo.code} raised for ${cust.name} (${site.name}).`,
      type: 'status_change',
      timestamp: new Date().toISOString(),
      read: false,
      workOrderId: newWo.id
    };
    setNotifications(prev => [newNotif, ...prev]);

    addToast('success', `Work Order ${newWo.code} created successfully.`);
  };

  const assignWorkOrder = (workOrderId: string, technicianId: string, note?: string): boolean => {
    const wo = workOrders.find(w => w.id === workOrderId);
    const tech = users.find(u => u.id === technicianId && u.role === 'TECHNICIAN');
    if (!wo || !tech) return false;

    if (wo.status !== 'NEW' && wo.status !== 'ASSIGNED') {
      addToast('error', `Cannot reassign job ${wo.code} in status ${wo.status}.`);
      return false;
    }

    const prevStatus = wo.status;
    const updatedWo: WorkOrder = {
      ...wo,
      status: 'ASSIGNED',
      assignedToId: tech.id,
      assignedToName: tech.name,
    };

    const auditRow: WorkOrderStatusHistory = {
      id: `hist-${Date.now()}`,
      workOrderId: wo.id,
      fromStatus: prevStatus,
      toStatus: 'ASSIGNED',
      changedByUserId: currentUser.id,
      changedByUserName: currentUser.name,
      changedAt: new Date().toISOString(),
      note: note || `Assigned to technician ${tech.name}`
    };

    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWo : w));
    setStatusHistory(prev => [...prev, auditRow]);

    // Notification on assignment
    const assignNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Job Assigned',
      message: `${wo.code} assigned to ${tech.name}.`,
      type: 'assignment',
      timestamp: new Date().toISOString(),
      read: false,
      workOrderId: wo.id
    };
    setNotifications(prev => [assignNotif, ...prev]);

    addToast('success', `Assigned ${wo.code} to ${tech.name}.`);
    return true;
  };

  const transitionStatus = (workOrderId: string, nextStatus: WorkOrderStatus, note?: string): boolean => {
    const wo = workOrders.find(w => w.id === workOrderId);
    if (!wo) return false;

    const curr = wo.status;

    if (curr === 'CLOSED' || curr === 'CANCELLED') {
      addToast('error', `Job ${wo.code} is in terminal state ${curr}.`);
      return false;
    }

    if (nextStatus === 'CLOSED' && currentUser.role !== 'MANAGER') {
      addToast('error', 'Only a Manager can close a work order.');
      return false;
    }

    if ((nextStatus === 'IN_PROGRESS' || nextStatus === 'ON_HOLD' || nextStatus === 'COMPLETED') && 
        currentUser.role === 'TECHNICIAN' && wo.assignedToId !== currentUser.id) {
      addToast('error', 'Technicians can only update jobs assigned to them.');
      return false;
    }

    let isAllowed = false;
    if (curr === 'NEW' && (nextStatus === 'ASSIGNED' || nextStatus === 'CANCELLED')) isAllowed = true;
    else if (curr === 'ASSIGNED' && (nextStatus === 'IN_PROGRESS' || nextStatus === 'CANCELLED')) isAllowed = true;
    else if (curr === 'IN_PROGRESS' && (nextStatus === 'ON_HOLD' || nextStatus === 'COMPLETED' || nextStatus === 'CANCELLED')) isAllowed = true;
    else if (curr === 'ON_HOLD' && (nextStatus === 'IN_PROGRESS' || nextStatus === 'CANCELLED')) isAllowed = true;
    else if (curr === 'COMPLETED' && nextStatus === 'CLOSED') isAllowed = true;

    if (!isAllowed) {
      addToast('error', `Illegal transition: ${curr} -> ${nextStatus}.`);
      return false;
    }

    const updatedWo: WorkOrder = { ...wo, status: nextStatus };
    const auditRow: WorkOrderStatusHistory = {
      id: `hist-${Date.now()}`,
      workOrderId: wo.id,
      fromStatus: curr,
      toStatus: nextStatus,
      changedByUserId: currentUser.id,
      changedByUserName: currentUser.name,
      changedAt: new Date().toISOString(),
      note: note || `Status updated to ${nextStatus}`
    };

    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWo : w));
    setStatusHistory(prev => [...prev, auditRow]);
    addToast('info', `Status of ${wo.code} updated to ${nextStatus}.`);
    return true;
  };

  const logPartUsage = (workOrderId: string, partId: string, qty: number): boolean => {
    const wo = workOrders.find(w => w.id === workOrderId);
    const targetPart = parts.find(p => p.id === partId);
    if (!wo || !targetPart) return false;

    if (qty <= 0) {
      addToast('error', 'Quantity must be greater than 0.');
      return false;
    }
    if (targetPart.stockQty < qty) {
      addToast('error', `Stock insufficient! Only ${targetPart.stockQty} left.`);
      return false;
    }

    const totalPartCost = targetPart.unitCost * qty;
    const updatedPart: Part = { ...targetPart, stockQty: targetPart.stockQty - qty };
    const newUsage: PartUsage = {
      id: `pu-${Date.now()}`,
      workOrderId,
      partId,
      partName: targetPart.name,
      unitCost: targetPart.unitCost,
      qtyUsed: qty,
      totalCost: totalPartCost
    };

    const updatedWo: WorkOrder = { ...wo, partsCost: wo.partsCost + totalPartCost };

    setParts(prev => prev.map(p => p.id === partId ? updatedPart : p));
    setPartUsages(prev => [...prev, newUsage]);
    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWo : w));

    addToast('success', `Logged ${qty}x ${targetPart.name}. Stock updated.`);
    return true;
  };

  const logTimeSpent = (workOrderId: string, minutes: number, note: string): boolean => {
    const wo = workOrders.find(w => w.id === workOrderId);
    if (!wo || minutes <= 0) return false;

    const newTimeLog: TimeLog = {
      id: `tl-${Date.now()}`,
      workOrderId,
      technicianId: currentUser.id,
      technicianName: currentUser.name,
      minutes,
      note,
      createdAt: new Date().toISOString()
    };

    const updatedWo: WorkOrder = { ...wo, laborMinutes: wo.laborMinutes + minutes };

    setTimeLogs(prev => [...prev, newTimeLog]);
    setWorkOrders(prev => prev.map(w => w.id === workOrderId ? updatedWo : w));
    addToast('success', `Logged ${minutes} mins labor on ${wo.code}.`);
    return true;
  };

  const getWorkOrderHistory = (workOrderId: string) => 
    statusHistory.filter(h => h.workOrderId === workOrderId);

  const getWorkOrderParts = (workOrderId: string) => 
    partUsages.filter(p => p.workOrderId === workOrderId);

  const getWorkOrderTimeLogs = (workOrderId: string) => 
    timeLogs.filter(t => t.workOrderId === workOrderId);

  return (
    <DataContext.Provider value={{
      isAuthenticated,
      currentUser,
      setCurrentUser,
      login,
      logout,
      users,
      customers,
      sites,
      workOrders,
      statusHistory,
      parts,
      partUsages,
      timeLogs,
      notifications,
      markNotificationAsRead,
      clearNotifications,
      technicianPerformance,
      activeTab,
      setActiveTab,
      toasts,
      addToast,
      removeToast,
      createWorkOrder,
      assignWorkOrder,
      transitionStatus,
      logPartUsage,
      logTimeSpent,
      getWorkOrderHistory,
      getWorkOrderParts,
      getWorkOrderTimeLogs
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
