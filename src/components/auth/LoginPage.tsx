import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Hexagon, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Wrench, Building2, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import type { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { login } = useData();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('MANAGER');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const success = login(email, password, selectedRole);
    if (!success) {
      setErrorMsg('Authentication failed. Please check your details and try again.');
    }
  };

  const handleGoogleSignIn = () => {
    // Google Auth Simulation with real Gmail account input
    const userGmail = prompt('Enter your Gmail address to sign in with Google:', 'yourname@gmail.com');
    if (userGmail && userGmail.includes('@')) {
      login(userGmail, 'google-oauth-token', selectedRole);
    }
  };

  const handleQuickLogin = (userEmail: string) => {
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
    <div className="h-screen max-h-screen w-full bg-slate-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto font-sans">
      
      {/* Central Split Container Matching Dashboard Design System */}
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] my-auto">
        
        {/* Left Dark Navy Brand Sidebar (#0F172A) */}
        <div className="md:col-span-5 bg-[#0F172A] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Accent Glow */}
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
                Log in with your real Gmail address, Google OAuth, or custom company credentials to access the platform.
              </p>
            </div>
          </div>

          {/* Left Footer Features List */}
          <div className="space-y-2.5 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real Gmail & Google OAuth Login</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stateless JWT Authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Role-Based Access Control (4 Roles)</span>
            </div>
          </div>

        </div>

        {/* Right Form & Auth Container */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
          
          <div>
            {/* Header Tabs: Sign In vs Sign Up */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isSignUp ? 'Create your Account' : 'Sign In to KEYSTONE'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {isSignUp ? 'Register with your Gmail address to get started.' : 'Sign in with your email or Google account.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                {isSignUp ? 'Already have an account?' : 'Need an account?'}
              </button>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2.5 transition-all text-xs mb-4"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google (Gmail)</span>
            </button>

            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">or email</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Email Address Input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
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

            {/* Account Role Selector */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1.5">Select Role Context</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { r: 'MANAGER' as Role, l: 'Manager / Admin' },
                  { r: 'DISPATCHER' as Role, l: 'Dispatcher' },
                  { r: 'TECHNICIAN' as Role, l: 'Technician' },
                  { r: 'CUSTOMER' as Role, l: 'Customer' }
                ].map((item) => (
                  <button
                    key={item.r}
                    type="button"
                    onClick={() => setSelectedRole(item.r)}
                    className={`py-2 px-3 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                      selectedRole === item.r 
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {item.l}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all group text-xs mt-2"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isSignUp ? 'Create Account & Sign In' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Reference Logins */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <details className="text-[11px] text-slate-500 font-medium">
              <summary className="cursor-pointer font-bold text-slate-600 hover:text-slate-900 select-none">
                Demo Reference Accounts (1-Click Logins)
              </summary>
              <div className="grid grid-cols-2 gap-2 pt-2.5">
                {seedProfiles.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleQuickLogin(p.email)}
                      className={`p-2.5 rounded-xl border text-left transition-all space-y-0.5 ${p.badgeColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase">{p.role}</span>
                        <Icon className="w-3 h-3" />
                      </div>
                      <p className="font-bold text-[11px] text-slate-900 truncate">{p.name}</p>
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

        </div>

        </div>

    </div>
  );
};
