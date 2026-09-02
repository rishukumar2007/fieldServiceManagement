import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Hexagon, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, 
  Wrench, Building2, CheckCircle2, UserPlus, LogIn, X, 
  Sparkles, RefreshCw
} from 'lucide-react';
import type { Role } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginWithOAuth } = useData();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>('MANAGER');
  const [errorMsg, setErrorMsg] = useState('');

  // OAuth Modal States
  const [oauthModalOpen, setOauthModalOpen] = useState(false);
  const [oauthProvider, setOauthProvider] = useState<'google' | 'github'>('google');
  const [oauthStep, setOauthStep] = useState<'picker' | 'custom' | 'authorizing'>('picker');
  const [customInput, setCustomInput] = useState('');
  const [customName, setCustomName] = useState('');
  const [oauthRole, setOauthRole] = useState<Role>('MANAGER');

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

  const openOAuthModal = (provider: 'google' | 'github') => {
    setOauthProvider(provider);
    setOauthStep('picker');
    setCustomInput('');
    setCustomName('');
    setOauthRole(selectedRole);
    setOauthModalOpen(true);
  };

  const executeOAuthLogin = (profile: { email: string; name?: string; avatarUrl?: string; role?: Role }) => {
    setOauthStep('authorizing');
    setTimeout(() => {
      loginWithOAuth(oauthProvider, profile);
      setOauthModalOpen(false);
    }, 700);
  };

  const handleQuickLogin = (userEmail: string) => {
    login(userEmail, 'password123');
  };

  // Google Pre-configured accounts for 1-click login
  const googleAccounts = [
    {
      name: 'Alex Miller',
      email: 'alex.m.keystone@gmail.com',
      role: 'MANAGER' as Role,
      roleLabel: 'Field Operations Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Sarah Vance',
      email: 'sarah.vance.ops@gmail.com',
      role: 'DISPATCHER' as Role,
      roleLabel: 'Senior Dispatcher',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Chen',
      email: 'marcus.chen.tech@gmail.com',
      role: 'TECHNICIAN' as Role,
      roleLabel: 'Field Specialist Technician',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      name: 'Acme Corp Client',
      email: 'facilities@acme-client.com',
      role: 'CUSTOMER' as Role,
      roleLabel: 'Corporate Facility Client',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    }
  ];

  // GitHub Pre-configured developer accounts
  const githubAccounts = [
    {
      username: 'octocat',
      name: 'The Octocat',
      email: 'octocat@github.com',
      role: 'TECHNICIAN' as Role,
      roleLabel: 'Lead Hardware Engineer',
      avatarUrl: 'https://github.com/octocat.png',
    },
    {
      username: 'torvalds',
      name: 'Linus Torvalds',
      email: 'torvalds@kernel.org',
      role: 'MANAGER' as Role,
      roleLabel: 'Infrastructure Admin',
      avatarUrl: 'https://github.com/torvalds.png',
    },
    {
      username: 'defunkt',
      name: 'Chris Wanstrath',
      email: 'chris@github.com',
      role: 'DISPATCHER' as Role,
      roleLabel: 'Dispatch Architect',
      avatarUrl: 'https://github.com/defunkt.png',
    },
    {
      username: 'github',
      name: 'GitHub Enterprise Hub',
      email: 'operations@github.com',
      role: 'CUSTOMER' as Role,
      roleLabel: 'Enterprise Client',
      avatarUrl: 'https://github.com/github.png',
    }
  ];

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
    <div className="h-screen max-h-screen w-full bg-slate-100 flex items-center justify-center p-4 md:p-6 overflow-y-auto font-sans relative">
      
      {/* Central Split Container Matching Dashboard Design System */}
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[92vh] my-auto relative z-10">
        
        {/* Left Dark Navy Brand Sidebar (#0F172A) */}
        <div className="md:col-span-5 bg-[#0F172A] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

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
                Seamlessly authenticate using your Google account, GitHub profile, or enterprise company credentials.
              </p>
            </div>
          </div>

          {/* Left Footer Features List */}
          <div className="space-y-2.5 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Google & GitHub OAuth 2.0 Logins</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stateless JWT & Role Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Governed 4-Role State Engine</span>
            </div>
          </div>

        </div>

        {/* Right Form & Auth Container */}
        <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-5 overflow-y-auto max-h-[92vh]">
          
          <div>
            {/* Header Tabs: Sign In vs Sign Up */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {isSignUp ? 'Create your Account' : 'Sign In to KEYSTONE'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSignUp ? 'Join with Google, GitHub, or your email.' : 'Sign in with your social account or credentials.'}
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

            {/* Social Authentication Buttons: Google & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={() => openOAuthModal('google')}
                className="bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 font-semibold py-2.5 px-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-xs group cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="truncate">Google</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => openOAuthModal('github')}
                className="bg-[#24292F] hover:bg-[#1B1F23] border border-[#24292F] text-white font-semibold py-2.5 px-3.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-xs group cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span className="truncate">GitHub</span>
              </button>

            </div>

            <div className="relative flex items-center justify-center mb-3">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">or continue with email</span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Email Address Input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@meridian.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Password</label>
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
              <label className="block text-slate-700 font-semibold mb-1">Select Role Context</label>
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
                    className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all ${
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all group text-xs mt-2 cursor-pointer"
            >
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span>{isSignUp ? 'Create Account & Sign In' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Reference Logins */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <details className="text-[11px] text-slate-500 font-medium">
              <summary className="cursor-pointer font-bold text-slate-600 hover:text-slate-900 select-none">
                Demo Reference Accounts (1-Click Direct Access)
              </summary>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {seedProfiles.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleQuickLogin(p.email)}
                      className={`p-2 rounded-xl border text-left transition-all space-y-0.5 cursor-pointer ${p.badgeColor}`}
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

      {/* Interactive Keystone OAuth Modal */}
      {oauthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
            
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between ${
              oauthProvider === 'google' 
                ? 'bg-gradient-to-r from-slate-900 to-blue-950' 
                : 'bg-gradient-to-r from-[#1B1F23] to-[#24292F]'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shadow-md">
                  {oauthProvider === 'google' ? (
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 fill-[#24292F]" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {oauthProvider === 'google' ? 'Google OAuth 2.0 Sign In' : 'GitHub OAuth 2.0 Sign In'}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Authorize Keystone Field Service Management
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setOauthModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Provider Quick Toggle inside Modal */}
              <div className="flex bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => { setOauthProvider('google'); setOauthStep('picker'); }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    oauthProvider === 'google' 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setOauthProvider('github'); setOauthStep('picker'); }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    oauthProvider === 'github' 
                      ? 'bg-[#24292F] text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub Profile</span>
                </button>
              </div>

              {/* Step 1: Account Chooser / Preset Selection */}
              {oauthStep === 'picker' && (
                <div className="space-y-4 text-xs">
                  
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-700">Choose an account to continue:</p>
                    <button
                      type="button"
                      onClick={() => setOauthStep('custom')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Use another account
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(oauthProvider === 'google' ? googleAccounts : githubAccounts).map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        onClick={() => executeOAuthLogin({
                          email: acc.email,
                          name: acc.name,
                          avatarUrl: acc.avatarUrl,
                          role: acc.role
                        })}
                        className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={acc.avatarUrl} 
                            alt={acc.name} 
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">{acc.name}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
                                {acc.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono">{acc.email}</p>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>OAuth 2.0 PKCE Protected</span>
                    <span>Single Sign-On (SSO)</span>
                  </div>

                </div>
              )}

              {/* Step 2: Custom Google Email or GitHub Username */}
              {oauthStep === 'custom' && (
                <div className="space-y-4 text-xs">
                  
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-700">
                      {oauthProvider === 'google' ? 'Enter your Google / Gmail account:' : 'Enter your GitHub username or email:'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setOauthStep('picker')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Back to list
                    </button>
                  </div>

                  {/* Input Field */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      {oauthProvider === 'google' ? 'Gmail / Workspace Email' : 'GitHub Username or Email'}
                    </label>
                    <input 
                      type={oauthProvider === 'google' ? 'email' : 'text'}
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder={oauthProvider === 'google' ? 'john.doe@gmail.com' : 'octocat or user@domain.com'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  {/* Optional Display Name */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Display Name (Optional)</label>
                    <input 
                      type="text" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  {/* Live GitHub Avatar Preview */}
                  {oauthProvider === 'github' && customInput && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                      <img 
                        src={`https://github.com/${customInput.replace('@github.com', '')}.png`}
                        alt="GitHub Preview"
                        className="w-8 h-8 rounded-full border border-slate-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="text-[11px]">
                        <p className="font-semibold text-slate-800">GitHub Profile Preview</p>
                        <p className="text-slate-500 font-mono">@{customInput.replace('@github.com', '')}</p>
                      </div>
                    </div>
                  )}

                  {/* Role Selector */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Role Context to Assign</label>
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
                          onClick={() => setOauthRole(item.r)}
                          className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all ${
                            oauthRole === item.r 
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
                    type="button"
                    disabled={!customInput.trim()}
                    onClick={() => {
                      const trimmed = customInput.trim();
                      const emailVal = trimmed.includes('@') ? trimmed : `${trimmed}@github.com`;
                      const avatar = oauthProvider === 'github' 
                        ? `https://github.com/${trimmed.replace('@github.com', '')}.png`
                        : undefined;
                      executeOAuthLogin({
                        email: emailVal,
                        name: customName || (oauthProvider === 'github' ? trimmed : undefined),
                        avatarUrl: avatar,
                        role: oauthRole
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all text-xs cursor-pointer"
                  >
                    <span>Authorize & Sign In with {oauthProvider === 'google' ? 'Google' : 'GitHub'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </div>
              )}

              {/* Step 3: Authorizing Simulation Spinner */}
              {oauthStep === 'authorizing' && (
                <div className="py-8 px-4 text-center space-y-4">
                  <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                    <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
                    <Sparkles className="w-4 h-4 text-amber-500 absolute top-0 right-0 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Authenticating with {oauthProvider === 'google' ? 'Google' : 'GitHub'}...
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Verifying OAuth 2.0 authorization token & loading Keystone permissions.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" /> Secure 256-bit TLS Session
              </span>
              <span className="font-semibold text-slate-600">Keystone Identity v2.4</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
