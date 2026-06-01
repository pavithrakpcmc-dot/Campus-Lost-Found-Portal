import React, { useState } from 'react';
import { User, LOCATIONS } from '../types';
import { X, UserPlus, LogIn, Mail, Phone, BookOpen, ShieldAlert } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: User) => void;
  existingUsers: User[];
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthenticate,
  existingUsers,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email address is required.');
      return;
    }

    const matchedUser = existingUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      onAuthenticate(matchedUser);
      onClose();
    } else {
      setError('No student found with this email. Please sign up to create a profile.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !contact.trim() || !department.trim()) {
      setError('All fields are required.');
      return;
    }

    // Check if user already exists
    const matchedUser = existingUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matchedUser) {
      setError('A user with this email already exists. Try logging in instead.');
      return;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      contact: contact.trim(),
      department: department.trim(),
      role: role,
      joinedAt: new Date().toISOString(),
    };

    onAuthenticate(newUser);
    onClose();
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in transition-all">
      <div id="auth-modal-card" className="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-blue-600 to-[#0F172A] p-6 text-white relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              {isSignUp ? <UserPlus size={24} className="text-white" /> : <LogIn size={24} className="text-white" />}
            </div>
            <h2 className="text-xl font-bold font-sans tracking-tight">
              {isSignUp ? 'Create Student Profile' : 'Student & Staff Login'}
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            {isSignUp
              ? 'Sign up once to post items, view claim requests, and receive contact updates.'
              : 'Sign in with your campus email to manage existing records and file claim forms.'}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div id="auth-error-banner" className="bg-rose-50 border-l-4 border-rose-500 text-rose-800 p-3 text-xs rounded mb-4 flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isSignUp ? (
            <form id="signup-form" onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  id="auth-signup-name"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    id="auth-signup-email"
                    placeholder="student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      id="auth-signup-contact"
                      placeholder="+1 (555) 012-3456"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Department / Office
                  </label>
                  <div className="relative">
                    <BookOpen size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      id="auth-signup-dept"
                      placeholder="e.g. Computer Science"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-3 rounded text-xs font-semibold border ${
                      role === 'student'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Student / Staff
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 px-3 rounded text-xs font-semibold border ${
                      role === 'admin'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    System Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="auth-signup-submit-btn"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Create Account & Sign In
              </button>
            </form>
          ) : (
            <form id="login-form" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Campus Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    id="auth-login-email"
                    placeholder="student@campus.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="auth-login-submit-btn"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md cursor-pointer"
              >
                Sign In
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              {isSignUp ? 'Already registered on campus?' : 'Forgot to register?'}
            </span>
            <button
              id="auth-toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In Instead' : 'Create Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
