import React, { useState } from 'react';
import { 
  Menu, Search, Bell, HelpCircle, ShieldAlert, 
  CheckCircle2, AlertCircle, Package, Clock, X, CheckCheck, Trash2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Role } from '../types';

interface HeaderProps {
  toggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { 
    currentUser, users, setCurrentUser, 
    notifications, markNotificationAsRead, clearNotifications 
  } = useData();

  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleSwitch = (role: Role) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) setCurrentUser(targetUser);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'sla_breach':
        return <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />;
      case 'assignment':
        return <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-500 shrink-0" />;
      default:
        return <Clock className="w-4 h-4 text-purple-500 shrink-0" />;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      
      {/* Left Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search work orders, customers, technicians..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Account Role Switcher */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium mr-4">
        <span className="text-slate-500 text-[11px] px-2 font-semibold uppercase flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Account Context:
        </span>
        {(['MANAGER', 'DISPATCHER', 'TECHNICIAN', 'CUSTOMER'] as Role[]).map((r) => {
          const isSelected = currentUser.role === r;
          return (
            <button
              key={r}
              onClick={() => handleRoleSwitch(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {r.toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Right Tool Icons */}
      <div className="flex items-center gap-3 relative">
        
        {/* Real Interactive Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Real Notification Center Dropdown Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
              
              {/* Popover Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      title="Clear All Notifications"
                      className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <CheckCheck className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-medium text-xs">All clear! No notifications right now.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-blue-50/40 border-l-4 border-l-blue-600' : ''
                      }`}
                    >
                      {getNotifIcon(n.type)}
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Popover Footer */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  SLA Breach Engine & Inventory Monitors Active
                </span>
              </div>

            </div>
          )}
        </div>

        {/* Help Tooltip Icon */}
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors hidden sm:block">
          <HelpCircle className="w-5 h-5" />
        </button>

      </div>
    </header>
  );
};
