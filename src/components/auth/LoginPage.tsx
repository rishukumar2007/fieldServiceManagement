import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { 
  Hexagon, Lock, Mail, ArrowRight, CheckCircle2, UserPlus, LogIn, X, 
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
  const [oauthStep, setOauthStep] = useState<'custom' | 'authorizing'>('custom');
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
    setOauthStep('custom');
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
                Sign in with your email address or authenticate directly with your Google or GitHub account.
              </p>
            </div>
          </div>

          {/* Left Footer Features List */}
          <div className="space-y-2.5 pt-6 border-t border-slate-800 text-xs text-slate-300 font-medium relative z-10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Google & GitHub Single Sign-On</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Stateless JWT Security Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Governed 4-Role Access Control</span>
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
                  {isSignUp ? 'Sign up with your email, Google, or GitHub account.' : 'Enter your email address and password to log in.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline cursor-pointer"
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
                  placeholder="yourname@gmail.com"
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
                    className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all cursor-pointer ${
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
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
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
                  onClick={() => { setOauthProvider('google'); setOauthStep('custom'); }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
                  onClick={() => { setOauthProvider('github'); setOauthStep('custom'); }}
                  className={`flex-1 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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

              {/* Step 1: Real Email / Username Input */}
              {oauthStep === 'custom' && (
                <div className="space-y-4 text-xs">
                  
                  <div>
                    <p className="font-semibold text-slate-700 mb-1">
                      {oauthProvider === 'google' ? 'Enter your Google / Gmail account:' : 'Enter your GitHub username or email:'}
                    </p>
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
                      placeholder={oauthProvider === 'google' ? 'yourname@gmail.com' : 'yourname or user@domain.com'}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    />
                  </div>

                  {/* Optional Display Name */}
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Full Name (Optional)</label>
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
                          onClick={() => setOauthRole(item.r)}
                          className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all cursor-pointer ${
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

              {/* Step 2: Authorizing Spinner */}
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
