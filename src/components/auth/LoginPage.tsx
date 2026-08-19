import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Hexagon, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Wrench, Building2, CheckCircle2 } from 'lucide-react';
import type { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { login } = useData();
  const [email, setEmail] = useState('john.m@meridian.com');
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(email, password);
    if (!success) {
      setErrorMsg('Invalid email or password. Use seed account credentials below.');
    }
  };

  const handleQuickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('password123');
    login(userEmail, 'password123');
  };

  const seedProfiles = [
    {
      role: 'MANAGER' as Role,
      title: 'Manager / Admin',
      email: 'john.m@meridian.com',
      name: 'John Miller',
      icon: ShieldCheck,
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200/60'
    },
    {
      role: 'DISPATCHER' as Role,
      title: 'Dispatcher',
      email: 'sarah.v@meridian.com',
      name: 'Sarah Vance',
      icon: UserCheck,
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200/60'
    },
    {
      role: 'TECHNICIAN' as Role,
      title: 'Field Technician',
      email: 'mike.smith@meridian.com',
      name: 'Mike Smith',
      icon: Wrench,
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200/60'
    },
    {
      role: 'CUSTOMER' as Role,
      title: 'Customer Client',
      email: 'alice@acmecorp.com',
      name: 'Alice Acme',
      icon: Building2,
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200/60'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      
      {/* Central Split Container Matching Dashboard Design System */}
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        
        {/* Left Dark Navy Brand Sidebar matching Dashboard Sidebar (#0F172A) */}
        <div className="md:col-span-5 bg-[#0F172A] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Hexagon className="w-6 h-6 fill-current text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-white tracking-wider text-lg">KEYSTONE</h1>
                <p className="text-xs text-slate-400 font-medium">Field Service Management</p>
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-slate-800">
              <h2 className="text-xl font-bold text-white leading-snug">
                Enterprise Field Service & SLA Resolution Platform
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Streamline work orders, dispatch field technicians, monitor real-time SLAs, and manage inventory seamlessly.
              </p>
            </div>
          </div>

          {/* Left Footer Features List */}
          <div className="space-y-2.5 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stateless JWT Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Guarded Work Order State Machine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Transactional Stock Inventory Logging</span>
            </div>
          </div>

        </div>

        {/* Right Form & Seed Account Panel */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
          
          <div>
            <h2 className="text-xl font-bold text-slate-900">Sign In to KEYSTONE</h2>
            <p className="text-xs text-slate-500 mt-1">Enter your credentials or click a seed profile below to sign in.</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@meridian.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all group text-xs"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick One-Click Seed Account Logins */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Quick Seed Account Logins:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {seedProfiles.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.role}
                    type="button"
                    onClick={() => handleQuickLogin(p.email)}
                    className={`p-3 rounded-xl border text-left transition-all space-y-1 ${p.badgeColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase">{p.role}</span>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <p className="font-bold text-xs text-slate-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{p.email}</p>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
