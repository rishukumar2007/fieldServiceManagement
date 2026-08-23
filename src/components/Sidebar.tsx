import React from 'react';
import { 
  LayoutDashboard, ClipboardList, Building2, MapPin, 
  UserCheck, Package, BarChart3, Users, ShieldCheck, 
  Settings, Hexagon, LogOut
} from 'lucide-react';
import { useData } from '../context/DataContext';

interface SidebarProps {
  sidebarOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen }) => {
  const { activeTab, setActiveTab, currentUser, users, setCurrentUser, logout } = useData();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'work-orders', label: 'Work Orders', icon: ClipboardList },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'sites', label: 'Sites', icon: MapPin },
    { id: 'technicians', label: 'Technicians', icon: UserCheck },
    { id: 'parts', label: 'Parts', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sla', label: 'SLA & Compliance', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <aside className={`fixed top-0 bottom-0 left-0 h-screen max-h-screen z-40 w-64 bg-[#0F172A] text-slate-300 transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      {/* Top Logo Header */}
      <div>
        <div className="flex items-center gap-3 px-5 py-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Hexagon className="w-6 h-6 fill-current text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-wider text-base">KEYSTONE</h1>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">Field Service Management</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase block mb-1 px-1">
              Active Account:
            </label>
            <select 
              value={currentUser.id}
              onChange={(e) => {
                const u = users.find(x => x.id === e.target.value);
                if (u) setCurrentUser(u);
              }}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                {currentUser.avatarUrl ? (
                  <img 
                    src={currentUser.avatarUrl} 
                    alt={currentUser.name} 
                    className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 border-2 border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                    {getInitials(currentUser.name)}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0F172A] rounded-full" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[100px]">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser.role.toLowerCase()}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
