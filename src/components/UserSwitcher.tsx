import React from 'react';
import { User } from '../types';
import { Shield, User as UserIcon, LogOut } from 'lucide-react';

interface UserSwitcherProps {
  currentUser: User | null;
  users: User[];
  onUserChange: (user: User | null) => void;
  onOpenAuth: () => void;
}

export default function UserSwitcher({
  currentUser,
  users,
  onUserChange,
  onOpenAuth,
}: UserSwitcherProps) {
  return (
    <div id="user-switcher-container" className="bg-[#0F172A] text-slate-100 py-2.5 px-6 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs font-sans gap-3">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
        <span className="text-slate-400 font-bold font-display text-[10px] tracking-widest uppercase">Workspace Sandbox:</span>
        <span className="text-slate-300 font-medium">Switch profiles to evaluate claims & admin features instantly</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {users.map((user) => {
          const isSelected = currentUser?.id === user.id;
          const isAdmin = user.role === 'admin';
          return (
            <button
              key={user.id}
              id={`switch-user-btn-${user.id}`}
              onClick={() => onUserChange(user)}
              className={`px-3 py-1.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 text-[11px] font-semibold tracking-tight ${
                isSelected
                  ? isAdmin
                    ? 'bg-rose-600 text-white shadow-xs font-bold ring-2 ring-rose-500/30'
                    : 'bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100 border border-slate-700/60'
              }`}
            >
              {isAdmin ? <Shield size={12} className="text-rose-100" /> : <UserIcon size={12} className="text-blue-200" />}
              <span>{user.name} ({isAdmin ? 'Admin' : 'Student'})</span>
            </button>
          );
        })}
        
        {currentUser ? (
          <button
            id="simulation-logout-btn"
            onClick={() => onUserChange(null)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white flex items-center gap-1 border border-slate-700/40 transition-colors text-[11px]"
            title="Switch to Guest reader view"
          >
            <LogOut size={12} />
            <span>Logout</span>
          </button>
        ) : (
          <button
            id="simulation-login-btn"
            onClick={onOpenAuth}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center gap-1 transition-colors text-[11px]"
          >
            <UserIcon size={12} />
            <span>Sign Up / Log In</span>
          </button>
        )}
      </div>
    </div>
  );
}
