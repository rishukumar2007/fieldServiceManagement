import React, { useState } from 'react';
import { 
  Plus, Search, History, X 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { WorkOrder, WorkOrderStatus, Priority } from '../../types';

export const WorkOrdersPage: React.FC = () => {
  const { 
    workOrders, customers, sites, users, currentUser, 
    createWorkOrder, assignWorkOrder, transitionStatus, 
    getWorkOrderHistory,
    logPartUsage, logTimeSpent, parts
  } = useData();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWo, setSelectedWo] = useState<WorkOrder | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);

  // New Work Order Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>('MEDIUM');
  const [newCustomerId, setNewCustomerId] = useState(customers[0]?.id || '');
  const [newSiteId, setNewSiteId] = useState(sites[0]?.id || '');

  // Assignment & Log Form State
  const [selectedTechId, setSelectedTechId] = useState('');
  const [logPartId, setLogPartId] = useState(parts[0]?.id || '');
  const [logPartQty, setLogPartQty] = useState(1);
  const [logMinutes, setLogMinutes] = useState(30);
  const [logNote, setLogNote] = useState('');

  const statuses: WorkOrderStatus[] = [
    'NEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CLOSED', 'CANCELLED'
  ];

  const filteredOrders = workOrders.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          w.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createWorkOrder({
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      customerId: newCustomerId,
      siteId: newSiteId
    });

    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWo || !selectedTechId) return;

    assignWorkOrder(selectedWo.id, selectedTechId);
    setShowAssignModal(false);
    setSelectedWo(null);
  };

  const getStatusColor = (status: WorkOrderStatus) => {
    switch (status) {
      case 'NEW': return 'bg-sky-500';
      case 'ASSIGNED': return 'bg-purple-500';
      case 'IN_PROGRESS': return 'bg-blue-500';
      case 'ON_HOLD': return 'bg-amber-500';
      case 'COMPLETED': return 'bg-emerald-500';
      case 'CLOSED': return 'bg-teal-700';
      case 'CANCELLED': return 'bg-rose-500';
    }
  };

  const getInitials = (name: string) => {
    const partsName = name.split(' ');
    if (partsName.length >= 2) return `${partsName[0][0]}${partsName[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Orders Board</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage work-order lifecycles, dispatch technicians, and log labor.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Kanban
            </button>
            <button 
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Table View
            </button>
          </div>

          {(currentUser.role === 'DISPATCHER' || currentUser.role === 'MANAGER' || currentUser.role === 'CUSTOMER') && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Work Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, title, customer..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({workOrders.length})</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* View Display */}
      {viewMode === 'kanban' ? (
        /* Kanban Board Columns */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
          {statuses.map(status => {
            const columnOrders = filteredOrders.filter(w => w.status === status);
            return (
              <div key={status} className="w-72 bg-slate-100/70 p-3 rounded-2xl border border-slate-200/80 shrink-0 flex flex-col max-h-[750px]">
                
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)}`} />
                    <h4 className="text-xs font-bold text-slate-800 capitalize">{status.replace('_', ' ').toLowerCase()}</h4>
                  </div>
                  <span className="bg-slate-200 text-slate-700 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
                    {columnOrders.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 mt-3 overflow-y-auto pr-1 flex-1">
                  {columnOrders.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      No jobs
                    </div>
                  ) : (
                    columnOrders.map(wo => (
                      <div 
                        key={wo.id}
                        onClick={() => {
                          setSelectedWo(wo);
                          setShowDetailDrawer(true);
                        }}
                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-600">{wo.code}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            wo.priority === 'URGENT' || wo.priority === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {wo.priority}
                          </span>
                        </div>

                        <h5 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {wo.title}
                        </h5>

                        <div className="text-[11px] text-slate-500 space-y-0.5">
                          <p className="font-semibold text-slate-700">{wo.customerName}</p>
                          <p className="truncate">{wo.siteName}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-800 text-[9px] text-white flex items-center justify-center font-bold">
                              {getInitials(wo.assignedToName || 'U')}
                            </div>
                            <span className="text-[11px] text-slate-600 font-medium truncate max-w-[100px]">{wo.assignedToName}</span>
                          </div>

                          {(currentUser.role === 'DISPATCHER' || currentUser.role === 'MANAGER') && (wo.status === 'NEW' || wo.status === 'ASSIGNED') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWo(wo);
                                setShowAssignModal(true);
                              }}
                              className="text-[11px] font-semibold text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg"
                            >
                              Assign
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Customer & Site</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned To</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.map(wo => (
                <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-blue-600">{wo.code}</td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold max-w-xs">{wo.title}</td>
                  <td className="py-3.5 px-4">
                    <p className="text-slate-800 font-semibold">{wo.customerName}</p>
                    <p className="text-slate-400 text-[11px]">{wo.siteName}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(wo.status)} text-white`}>
                      {wo.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">{wo.priority}</td>
                  <td className="py-3.5 px-4">{wo.assignedToName}</td>
                  <td className="py-3.5 px-4">
                    <button 
                      onClick={() => {
                        setSelectedWo(wo);
                        setShowDetailDrawer(true);
                      }}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Details & Action
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE WORK ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Raise New Work Order</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Work Order Title *</label>
                <input 
                  type="text" 
                  required 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AC compressor tripping high pressure"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Problem Description</label>
                <textarea 
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Provide technical failure details..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select 
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                  >
                    <option value="LOW">LOW (72h SLA)</option>
                    <option value="MEDIUM">MEDIUM (48h SLA)</option>
                    <option value="HIGH">HIGH (24h SLA)</option>
                    <option value="URGENT">URGENT (4h SLA)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Customer</label>
                  <select 
                    value={newCustomerId}
                    onChange={(e) => setNewCustomerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Site Location</label>
                <select 
                  value={newSiteId}
                  onChange={(e) => setNewSiteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20"
                >
                  Raise Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TECHNICIAN MODAL */}
      {showAssignModal && selectedWo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Assign Technician</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <p className="text-slate-500 font-medium">Job: <span className="font-bold text-slate-900">{selectedWo.code} - {selectedWo.title}</span></p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Technician</label>
                <select 
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="">-- Choose Field Technician --</option>
                  {users.filter(u => u.role === 'TECHNICIAN').map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WORK ORDER DETAIL & GOVERNED TRANSITIONS DRAWER */}
      {showDetailDrawer && selectedWo && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-blue-600">{selectedWo.code}</span>
                <h2 className="text-lg font-bold text-slate-900">{selectedWo.title}</h2>
              </div>
              <button onClick={() => setShowDetailDrawer(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Governed State Machine Action Controls */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Governed State Machine Actions</h4>
              <p className="text-[11px] text-slate-500">Current Status: <span className="font-extrabold text-blue-700">{selectedWo.status}</span></p>

              <div className="flex flex-wrap gap-2">
                {selectedWo.status === 'ASSIGNED' && (
                  <button 
                    onClick={() => transitionStatus(selectedWo.id, 'IN_PROGRESS', 'Technician arrived on site')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                  >
                    Start Work (IN_PROGRESS)
                  </button>
                )}

                {selectedWo.status === 'IN_PROGRESS' && (
                  <>
                    <button 
                      onClick={() => transitionStatus(selectedWo.id, 'ON_HOLD', 'Waiting for spare part delivery')}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-semibold hover:bg-amber-700"
                    >
                      Put On Hold (ON_HOLD)
                    </button>
                    <button 
                      onClick={() => transitionStatus(selectedWo.id, 'COMPLETED', 'Work finished on site')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700"
                    >
                      Mark Completed (COMPLETED)
                    </button>
                  </>
                )}

                {selectedWo.status === 'ON_HOLD' && (
                  <button 
                    onClick={() => transitionStatus(selectedWo.id, 'IN_PROGRESS', 'Parts arrived, resuming work')}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                  >
                    Resume Work (IN_PROGRESS)
                  </button>
                )}

                {selectedWo.status === 'COMPLETED' && currentUser.role === 'MANAGER' && (
                  <button 
                    onClick={() => transitionStatus(selectedWo.id, 'CLOSED', 'Manager sign-off completed')}
                    className="px-3 py-1.5 bg-teal-800 text-white rounded-xl text-xs font-semibold hover:bg-teal-900"
                  >
                    Close Job (CLOSED)
                  </button>
                )}

                {selectedWo.status !== 'CLOSED' && selectedWo.status !== 'CANCELLED' && (
                  <button 
                    onClick={() => transitionStatus(selectedWo.id, 'CANCELLED', 'Job cancelled by dispatcher')}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {/* Parts & Time Logging Section (For Technicians) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Part Usage Logger */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Log Part Usage (Stock Inventory)</h4>
                <div className="space-y-2 text-xs">
                  <select 
                    value={logPartId} 
                    onChange={(e) => setLogPartId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  >
                    {parts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.unitCost} - Stock: {p.stockQty})</option>
                    ))}
                  </select>
                  
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      min="1" 
                      value={logPartQty} 
                      onChange={(e) => setLogPartQty(parseInt(e.target.value) || 1)}
                      className="w-20 bg-slate-50 border border-slate-200 p-2 rounded-lg"
                    />
                    <button 
                      onClick={() => {
                        logPartUsage(selectedWo.id, logPartId, logPartQty);
                      }}
                      className="flex-1 bg-slate-800 text-white font-semibold rounded-lg py-2"
                    >
                      Log Part
                    </button>
                  </div>
                </div>
              </div>

              {/* Time Spent Logger */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800">Log Labor Time</h4>
                <div className="space-y-2 text-xs">
                  <input 
                    type="number" 
                    placeholder="Minutes spent (e.g. 45)" 
                    value={logMinutes} 
                    onChange={(e) => setLogMinutes(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                  <input 
                    type="text" 
                    placeholder="Labor notes..." 
                    value={logNote} 
                    onChange={(e) => setLogNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg"
                  />
                  <button 
                    onClick={() => {
                      logTimeSpent(selectedWo.id, logMinutes, logNote);
                    }}
                    className="w-full bg-blue-600 text-white font-semibold rounded-lg py-2"
                  >
                    Log Time
                  </button>
                </div>
              </div>

            </div>

            {/* Audit History Log Trail */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <span>Audit Trail (Append-Only WorkOrderStatusHistory)</span>
              </h4>

              <div className="space-y-2">
                {getWorkOrderHistory(selectedWo.id).map(h => (
                  <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-slate-800">
                        {h.fromStatus ? `${h.fromStatus} → ${h.toStatus}` : `Created as ${h.toStatus}`}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(h.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{h.note}</p>
                    <p className="text-slate-400 text-[10px]">Updated by: {h.changedByUserName}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
