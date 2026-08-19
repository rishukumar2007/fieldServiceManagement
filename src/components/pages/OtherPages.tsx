import React from 'react';
import { useData } from '../../context/DataContext';
import { Building2, MapPin, BarChart3, ShieldCheck, AlertTriangle } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers } = useData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500 mt-0.5">Commercial client organizations managed by Meridian.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{c.name}</h3>
                <p className="text-xs text-slate-500">{c.contactEmail} • {c.contactPhone}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600 font-semibold">
              <span>Owned Sites:</span>
              <span className="text-blue-600 font-extrabold">{c.sitesCount} Sites</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SitesPage: React.FC = () => {
  const { sites } = useData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sites & Locations</h1>
        <p className="text-sm text-slate-500 mt-0.5">Building sites where field maintenance takes place.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sites.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">{s.customerName}</span>
                <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{s.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TechniciansPage: React.FC = () => {
  const { technicianPerformance } = useData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Field Technicians</h1>
        <p className="text-sm text-slate-500 mt-0.5">Active field service engineers and performance metrics.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {technicianPerformance.map(t => (
          <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <img src={t.avatarUrl} alt={t.name} className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-200" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
              <p className="text-xs text-slate-500 font-medium">Completed Jobs: {t.completedJobs}</p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-emerald-600">SLA Rating: {t.slaPercentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PartsPage: React.FC = () => {
  const { parts } = useData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Parts Inventory</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track stock levels and unit costs. Decremented transactionally when used.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Part Name</th>
              <th className="py-3 px-4">Unit Cost ($)</th>
              <th className="py-3 px-4">Stock Quantity</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {parts.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold text-blue-600">{p.sku}</td>
                <td className="py-3.5 px-4 text-slate-900 font-semibold">{p.name}</td>
                <td className="py-3.5 px-4 text-slate-800">${p.unitCost.toFixed(2)}</td>
                <td className="py-3.5 px-4 font-extrabold text-slate-900">{p.stockQty}</td>
                <td className="py-3.5 px-4">
                  {p.stockQty < 10 ? (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-600 flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Low Stock
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600">
                      In Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const ReportsPage: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Operational Reports</h1>
      <p className="text-sm text-slate-500 mt-0.5">SLA resolution analysis, technician labor breakdown, and part consumption.</p>
    </div>
    <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-3">
      <BarChart3 className="w-12 h-12 text-blue-600 mx-auto" />
      <h3 className="font-bold text-slate-900 text-base">All Operational Metrics Operational</h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto">
        Report summaries roll up all work orders, SLA resolution lead times, and inventory consumption across Meridian Facilities.
      </p>
    </div>
  </div>
);

export const UsersPage: React.FC = () => {
  const { users } = useData();
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Platform Users & RBAC</h1>
        <p className="text-sm text-slate-500 mt-0.5">Roles: DISPATCHER, TECHNICIAN, MANAGER, CUSTOMER.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-bold text-slate-900">{u.name}</span>
                </td>
                <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                <td className="py-3.5 px-4 font-bold text-blue-600">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const SlaPage: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">SLA & Compliance Engine</h1>
      <p className="text-sm text-slate-500 mt-0.5">Priority SLA matrix: URGENT (4h), HIGH (24h), MEDIUM (48h), LOW (72h).</p>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <div className="flex items-center gap-3 text-emerald-600 font-bold text-sm">
        <ShieldCheck className="w-6 h-6" />
        <span>Overall 30-Day SLA Compliance: 92%</span>
      </div>
      <p className="text-xs text-slate-600">
        Overdue jobs and at-risk SLA breaches trigger automated alerts for dispatchers and managers on the main dashboard.
      </p>
    </div>
  </div>
);

export const SettingsPage: React.FC = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
      <p className="text-sm text-slate-500 mt-0.5">Platform configuration, Spring Boot REST endpoint URLs, and Flyway migrations.</p>
    </div>
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 text-xs">
      <div className="flex justify-between py-2 border-b border-slate-100">
        <span className="font-semibold text-slate-700">Spring Boot REST API Endpoint:</span>
        <span className="font-mono text-blue-600">http://localhost:8080/api</span>
      </div>
      <div className="flex justify-between py-2 border-b border-slate-100">
        <span className="font-semibold text-slate-700">Database Engine:</span>
        <span className="font-mono text-slate-800">PostgreSQL (Flyway Versioned Migrations)</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="font-semibold text-slate-700">Authentication:</span>
        <span className="font-mono text-slate-800">Stateless JWT + BCrypt Password Hashing</span>
      </div>
    </div>
  </div>
);
