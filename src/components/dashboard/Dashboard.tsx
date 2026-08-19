import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle2, Clock, AlertTriangle, 
  ShieldCheck, Users, Download, Calendar, ArrowUpRight, 
  ArrowDownRight, ChevronRight
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { WorkOrderStatus, Priority } from '../../types';

export const Dashboard: React.FC = () => {
  const { workOrders, technicianPerformance, setActiveTab, currentUser, addToast } = useData();
  
  // Format live current date range
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 6);
  
  const formatDateStr = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const defaultRangeText = `${formatDateStr(weekStart)} – ${formatDateStr(today)}, ${today.getFullYear()}`;

  const [dateRange, setDateRange] = useState(defaultRangeText);

  // Compute stats dynamically from real workOrders state array!
  const totalCount = workOrders.length;
  const completedCount = workOrders.filter(w => w.status === 'COMPLETED' || w.status === 'CLOSED').length;
  const pendingCount = workOrders.filter(w => w.status === 'ASSIGNED' || w.status === 'IN_PROGRESS' || w.status === 'ON_HOLD').length;
  const overdueCount = workOrders.filter(w => new Date(w.slaDueAt) < new Date() && w.status !== 'CLOSED' && w.status !== 'COMPLETED').length;
  
  const newCount = workOrders.filter(w => w.status === 'NEW').length;
  const assignedCount = workOrders.filter(w => w.status === 'ASSIGNED').length;
  const inProgressCount = workOrders.filter(w => w.status === 'IN_PROGRESS').length;
  const onHoldCount = workOrders.filter(w => w.status === 'ON_HOLD').length;
  const closedCount = workOrders.filter(w => w.status === 'CLOSED').length;

  const slaPercentage = totalCount > 0 
    ? Math.round(((totalCount - overdueCount) / totalCount) * 100)
    : 92;
    
  const activeTechsCount = 24;

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Progress</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">Assigned</span>;
      case 'ON_HOLD':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">On Hold</span>;
      case 'NEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700">New</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Completed</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">Closed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Cancelled</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-600">High</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600">Medium</span>;
      case 'LOW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">Low</span>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your operations today.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer text-slate-700 font-semibold"
            >
              <option value={defaultRangeText}>{defaultRangeText}</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <button 
            onClick={() => addToast('info', 'Report summary exported as CSV file.')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 6 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Work Orders */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">Total Work Orders</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{totalCount}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>12%</span>
            <span className="text-slate-400 font-normal text-[11px] ml-1">vs last week</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">Completed</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{completedCount}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>18%</span>
            <span className="text-slate-400 font-normal text-[11px] ml-1">vs last week</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">Pending</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{pendingCount}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-rose-600">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>5%</span>
            <span className="text-slate-400 font-normal text-[11px] ml-1">vs last week</span>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">Overdue</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{overdueCount}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-rose-600">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>10%</span>
            <span className="text-slate-400 font-normal text-[11px] ml-1">vs last week</span>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">SLA Compliance</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{slaPercentage}%</h3>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>8%</span>
            <span className="text-slate-400 font-normal text-[11px] ml-1">vs last week</span>
          </div>
        </div>

        {/* Active Technicians */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-tight">Active Technicians</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{activeTechsCount}</h3>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400 font-medium">
            vs last week
          </div>
        </div>

      </div>

      {/* Middle Row Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Work Order Overview Multi-line Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Work Order Overview</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-1 bg-emerald-500 rounded-full inline-block" /> Completed
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-1 bg-amber-500 rounded-full inline-block" /> Pending
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-1 bg-rose-500 rounded-full inline-block" /> Overdue
              </span>
            </div>
          </div>

          {/* SVG Line Chart Representation */}
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Y Grid lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

              {/* Completed Line (Green) */}
              <path 
                d="M 0 110 L 83 65 L 166 78 L 249 84 L 332 50 L 415 56 L 500 25" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <circle cx="83" cy="65" r="4" fill="#10b981" />
              <circle cx="166" cy="78" r="4" fill="#10b981" />
              <circle cx="249" cy="84" r="4" fill="#10b981" />
              <circle cx="332" cy="50" r="4" fill="#10b981" />
              <circle cx="415" cy="56" r="4" fill="#10b981" />
              <circle cx="500" cy="25" r="4" fill="#10b981" />

              {/* Pending Line (Orange) */}
              <path 
                d="M 0 145 L 83 120 L 166 122 L 249 110 L 332 115 L 415 125 L 500 105" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <circle cx="83" cy="120" r="4" fill="#f59e0b" />
              <circle cx="166" cy="122" r="4" fill="#f59e0b" />
              <circle cx="249" cy="110" r="4" fill="#f59e0b" />
              <circle cx="332" cy="115" r="4" fill="#f59e0b" />
              <circle cx="415" cy="125" r="4" fill="#f59e0b" />
              <circle cx="500" cy="105" r="4" fill="#f59e0b" />

              {/* Overdue Line (Red) */}
              <path 
                d="M 0 185 L 83 175 L 166 180 L 249 172 L 332 175 L 415 178 L 500 160" 
                fill="none" 
                stroke="#ef4444" 
                strokeWidth="3" 
                strokeLinecap="round" 
              />
              <circle cx="83" cy="175" r="4" fill="#ef4444" />
              <circle cx="166" cy="180" r="4" fill="#ef4444" />
              <circle cx="249" cy="172" r="4" fill="#ef4444" />
              <circle cx="332" cy="175" r="4" fill="#ef4444" />
              <circle cx="415" cy="178" r="4" fill="#ef4444" />
              <circle cx="500" cy="160" r="4" fill="#ef4444" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2 px-1">
              <span>Day 1</span>
              <span>Day 2</span>
              <span>Day 3</span>
              <span>Day 4</span>
              <span>Day 5</span>
              <span>Day 6</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Right Column: Work Orders by Status Donut Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Work Orders by Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 my-auto">
            {/* SVG Donut Chart */}
            <div className="relative w-44 h-44 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="16 84" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#a855f7" strokeWidth="4.2" strokeDasharray="22 78" strokeDashoffset="-16" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4.2" strokeDasharray="27 73" strokeDashoffset="-38" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="8 92" strokeDashoffset="-65" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="-73" />
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0f766e" strokeWidth="4.2" strokeDasharray="8 92" strokeDashoffset="-93" />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Total</span>
              </div>
            </div>

            {/* Legend list matching team mockup */}
            <div className="space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-blue-500" /> New
                </span>
                <span className="font-semibold text-slate-800">{newCount} ({Math.round((newCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-purple-500" /> Assigned
                </span>
                <span className="font-semibold text-slate-800">{assignedCount} ({Math.round((assignedCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-cyan-500" /> In Progress
                </span>
                <span className="font-semibold text-slate-800">{inProgressCount} ({Math.round((inProgressCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-amber-500" /> On Hold
                </span>
                <span className="font-semibold text-slate-800">{onHoldCount} ({Math.round((onHoldCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-emerald-500" /> Completed
                </span>
                <span className="font-semibold text-slate-800">{completedCount} ({Math.round((completedCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded-md bg-teal-700" /> Closed
                </span>
                <span className="font-semibold text-slate-800">{closedCount} ({Math.round((closedCount / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row Operational Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Grid: Recent Work Orders Table */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Recent Work Orders</h3>
              <button 
                onClick={() => setActiveTab('work-orders')} 
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <span>View all work orders</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-2 font-semibold">ID</th>
                    <th className="py-2.5 px-2 font-semibold">Title</th>
                    <th className="py-2.5 px-2 font-semibold">Customer</th>
                    <th className="py-2.5 px-2 font-semibold">Status</th>
                    <th className="py-2.5 px-2 font-semibold">Priority</th>
                    <th className="py-2.5 px-2 font-semibold">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {workOrders.slice(0, 5).map((wo) => (
                    <tr key={wo.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2 font-bold text-blue-600">{wo.code}</td>
                      <td className="py-3 px-2 text-slate-900 font-semibold max-w-[150px] truncate">{wo.title}</td>
                      <td className="py-3 px-2 text-slate-600">{wo.customerName}</td>
                      <td className="py-3 px-2">{getStatusBadge(wo.status)}</td>
                      <td className="py-3 px-2">{getPriorityBadge(wo.priority)}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] text-white flex items-center justify-center font-bold">
                            {getInitials(wo.assignedToName || 'U')}
                          </div>
                          <span className="text-slate-700 font-medium text-xs truncate max-w-[90px]">{wo.assignedToName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Middle Grid: Technician Performance Progress List */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Technician Performance</h3>
              <button onClick={() => setActiveTab('technicians')} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {technicianPerformance.map((tech) => (
                <div key={tech.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {getInitials(tech.name)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{tech.name}</p>
                        <p className="text-[11px] text-slate-400">Completed: {tech.completedJobs} | SLA: {tech.slaPercentage}%</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">{tech.slaPercentage}%</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${tech.slaPercentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Grid: SLA Compliance Gauge Card */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">SLA Compliance</h3>
              <button onClick={() => setActiveTab('sla')} className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                View Report
              </button>
            </div>

            {/* Circular SLA Ring */}
            <div className="relative w-36 h-36 mx-auto my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3.5" />
                <circle 
                  cx="18" cy="18" r="15.915" 
                  fill="transparent" 
                  stroke="#10b981" 
                  strokeWidth="3.5" 
                  strokeDasharray={`${slaPercentage} ${100 - slaPercentage}`} 
                  strokeDashoffset="0" 
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900">{slaPercentage}%</span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Compliance</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <span className="text-xs font-semibold text-emerald-600 flex items-center justify-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> 8% vs last week
              </span>
            </div>

            {/* Metrics List */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between items-center text-slate-600">
                <span>Within SLA</span>
                <span className="font-bold text-slate-900">{totalCount - overdueCount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Breached SLA</span>
                <span className="font-bold text-rose-600">{overdueCount}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>At Risk</span>
                <span className="font-bold text-amber-600">{Math.round(pendingCount * 0.2)}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
