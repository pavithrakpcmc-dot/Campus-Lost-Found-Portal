/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Item, ClaimRequest } from './types';
import { INITIAL_USERS, INITIAL_ITEMS, INITIAL_CLAIMS } from './data';
import UserSwitcher from './components/UserSwitcher';
import AuthModal from './components/AuthModal';
import BrowseItems from './components/BrowseItems';
import PostItemForm from './components/PostItemForm';
import ClaimManager from './components/ClaimManager';
import AdminDashboard from './components/AdminDashboard';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Building2, Search, PlusCircle, CheckCircle, Shield,
  FileText, ShieldCheck, HelpCircle, GraduationCap, MapPin, Sparkles, UserCheck
} from 'lucide-react';

export default function App() {
  // Sync state with localStorage
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('camp_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem('camp_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [claimRequests, setClaimRequests] = useState<ClaimRequest[]>(() => {
    const saved = localStorage.getItem('camp_claims');
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  // Default currentUser to Sarah (Student) initially so testing is plug-and-play!
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('camp_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[1]; // Sarah
      }
    }
    return INITIAL_USERS[1]; // Sarah Jenkins
  });

  const [activeTab, setActiveTab] = useState<'browse' | 'post' | 'claims' | 'admin'>('browse');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('camp_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('camp_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('camp_claims', JSON.stringify(claimRequests));
  }, [claimRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('camp_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('camp_current_user');
    }
  }, [currentUser]);

  // Auth handler
  const handleAuthenticate = (user: User) => {
    if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
      setUsers((prev) => [...prev, user]);
    }
    setCurrentUser(user);
  };

  // Registering item post (Module 2)
  const handlePostItem = (newItemData: Omit<Item, 'id' | 'postedBy' | 'postedByName' | 'postedByEmail' | 'createdAt'>) => {
    if (!currentUser) return;

    const newItem: Item = {
      ...newItemData,
      id: `item-${Date.now()}`,
      postedBy: currentUser.id,
      postedByName: currentUser.name,
      postedByEmail: currentUser.email,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    setActiveTab('browse');
  };

  // Submit claim on an item (Module 4)
  const handleSubmitClaim = (itemId: string, message: string) => {
    if (!currentUser) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newClaim: ClaimRequest = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemLostOrFound: item.lostOrFound,
      ownerId: item.postedBy,
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      claimantContact: currentUser.contact,
      claimantDept: currentUser.department,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setClaimRequests((prev) => [newClaim, ...prev]);
  };

  // Resolve item direct closure
  const handleResolveItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: 'resolved' as const } : item
      )
    );
  };

  // Approve claim (Module 4)
  const handleApproveClaim = (claimId: string) => {
    const claim = claimRequests.find((c) => c.id === claimId);
    if (!claim) return;

    // Approve selected claim
    setClaimRequests((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'approved' as const } : c))
    );

    // Resolve corresponding item
    setItems((prev) =>
      prev.map((item) =>
        item.id === claim.itemId ? { ...item, status: 'resolved' as const } : item
      )
    );
  };

  // Reject claim (Module 4)
  const handleRejectClaim = (claimId: string) => {
    setClaimRequests((prev) =>
      prev.map((c) => (c.id === claimId ? { ...c, status: 'rejected' as const } : c))
    );
  };

  // Admin deletion operations (Module 5)
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setClaimRequests((prev) => prev.filter((claim) => claim.itemId !== itemId));
  };

  const handleDeleteUser = (userId: string) => {
    // Purge user
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    // Purge user's items
    setItems((prev) => prev.filter((item) => item.postedBy !== userId));
    // Purge user's claim forms
    setClaimRequests((prev) =>
      prev.filter((claim) => claim.claimantId !== userId && claim.ownerId !== userId)
    );
    // Logout if current user deleted
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  // Count pending received claims for notifications badge on claims tab
  const receivedPendingCount = currentUser
    ? claimRequests.filter((c) => c.ownerId === currentUser.id && c.status === 'pending').length
    : 0;

  return (
    <div id="app-root-wrapper" className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans antialiased flex flex-col justify-between selection:bg-blue-100">
      
      {/* 1. Simulation Top Control Ribbon */}
      <UserSwitcher
        currentUser={currentUser}
        users={users}
        onUserChange={setCurrentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Structural Layout: Flex container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full mx-auto">
        
        {/* Left Sidebar block */}
        <aside className="w-full lg:w-72 bg-[#0F172A] flex flex-col border-r border-slate-800 lg:min-h-[calc(100vh-45px)] shrink-0 font-sans z-10 shadow-lg">
          <div className="p-6 flex flex-col h-full justify-between gap-8">
            <div>
              {/* Logo / Branding */}
              <div className="flex items-center gap-3 mb-10">
                <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-400 tracking-widest uppercase font-display block">University Portal</span>
                  <span className="text-white font-extrabold text-xl tracking-tight font-display">CampLost</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1.5">
                <button
                  id="tab-browse"
                  onClick={() => setActiveTab('browse')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 border text-[13px] font-bold text-left cursor-pointer ${
                    activeTab === 'browse'
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30'
                  }`}
                >
                  <Search size={16} />
                  <span>Browse Campus Registry</span>
                </button>

                <button
                  id="tab-post"
                  onClick={() => setActiveTab('post')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 border text-[13px] font-bold text-left cursor-pointer ${
                    activeTab === 'post'
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30'
                  }`}
                >
                  <PlusCircle size={16} />
                  <span>Report Lost / Found</span>
                </button>

                <button
                  id="tab-claims"
                  onClick={() => setActiveTab('claims')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-150 border text-[13px] font-bold text-left cursor-pointer ${
                    activeTab === 'claims'
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <CheckCircle size={16} />
                    <span>Claim Verification</span>
                  </div>
                  {receivedPendingCount > 0 && (
                    <span className="bg-blue-500 text-white rounded-full text-[10px] h-5 w-5 flex items-center justify-center font-bold tracking-tight">
                      {receivedPendingCount}
                    </span>
                  )}
                </button>

                <button
                  id="tab-admin"
                  onClick={() => setActiveTab('admin')}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 border text-[13px] font-bold text-left cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-rose-600/15 text-rose-400 border-rose-500/25 font-bold'
                      : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 border-transparent'
                  }`}
                >
                  <Shield size={16} />
                  <span>Administrative Control</span>
                </button>
              </nav>
            </div>

            {/* Storage/Analytics Widget matching Vantage layout perfectly! */}
            <div className="mt-auto pt-6 border-t border-slate-800/60">
              <div className="bg-slate-800/30 rounded-2xl p-4 border border-slate-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">RECOVERY RATE</span>
                  <span className="text-[11px] text-slate-200 font-extrabold">{Math.round((items.filter(i => i.status === 'resolved').length / Math.max(1, items.length)) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500 rounded-full" 
                    style={{ width: `${Math.round((items.filter(i => i.status === 'resolved').length / Math.max(1, items.length)) * 100)}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-[9px] text-slate-500 leading-relaxed font-medium italic">
                  {items.filter(i => i.status === 'resolved').length} of {items.length} total posts resolved.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right main-view layout */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
          
          {/* Header block with elegant title and subtitle pairings */}
          <header className="min-h-24 bg-white border-b border-slate-200/85 flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 sm:px-10 py-5 gap-4 shadow-2xs">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E293B] font-display">
                {activeTab === 'browse' && 'Browse Visual Directory'}
                {activeTab === 'post' && 'Submit Platform Report'}
                {activeTab === 'claims' && 'Team Verification & Handover'}
                {activeTab === 'admin' && 'Secure Oversight Terminal'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                {activeTab === 'browse' && 'Manage and review active creative assets reported around college.'}
                {activeTab === 'post' && 'Upload proof details, category stamps, and location coordinates.'}
                {activeTab === 'claims' && 'Inspect student connecting requests, check proofs and shared contacts.'}
                {activeTab === 'admin' && 'Manage inappropriate text logs, duplicates, or student registers.'}
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
              {currentUser ? (
                <div id="current-user-header-card" className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 p-2 pr-4 rounded-xl text-xs shadow-3xs">
                  <div className="h-8.5 w-8.5 rounded-full bg-blue-50/50 flex items-center justify-center text-blue-600 font-extrabold border border-blue-200 shadow-2xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="truncate text-left max-w-[130px]">
                    <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[9px] text-[#2563EB] font-bold tracking-wide uppercase">{currentUser.role === 'admin' ? 'SEC STAFF' : currentUser.department}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 inline-block" title="Valid student union authorization"></span>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>
          </header>

          {/* Active component block */}
          <section className="p-6 sm:p-10 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="w-full"
              >
                {activeTab === 'browse' && (
                  <BrowseItems
                    items={items}
                    currentUser={currentUser}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                    onSubmitClaim={handleSubmitClaim}
                    onResolveItem={handleResolveItem}
                    claimRequests={claimRequests}
                  />
                )}

                {activeTab === 'post' && (
                  <PostItemForm
                    currentUser={currentUser}
                    onPostItem={handlePostItem}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                  />
                )}

                {activeTab === 'claims' && (
                  <ClaimManager
                    currentUser={currentUser}
                    items={items}
                    claimRequests={claimRequests}
                    onApproveClaim={handleApproveClaim}
                    onRejectClaim={handleRejectClaim}
                    onOpenAuth={() => setIsAuthModalOpen(true)}
                  />
                )}

                {activeTab === 'admin' && (
                  <AdminDashboard
                    currentUser={currentUser}
                    items={items}
                    users={users}
                    claimRequests={claimRequests}
                    onDeleteItem={handleDeleteItem}
                    onDeleteUser={handleDeleteUser}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>

      </div>

      {/* Form Auth modal and registration overlay */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthenticate}
        existingUsers={users}
      />

      {/* Institutional Academic Footer */}
      <footer id="main-footer" className="bg-white border-t border-slate-200 py-6 px-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-600">© 2026 Campus Lost & Found Portal</p>
            <p className="mt-1">Under strict compliance with university student union charter - Security Department Division.</p>
          </div>
          <div className="flex gap-4 font-medium text-slate-500">
            <a href="#browse" onClick={(e) => { e.preventDefault(); setActiveTab('browse'); }} className="hover:text-blue-600 transition-colors">Browse Posts</a>
            <a href="#post" onClick={(e) => { e.preventDefault(); setActiveTab('post'); }} className="hover:text-blue-600 transition-colors">Report Items</a>
            <a href="#claims" onClick={(e) => { e.preventDefault(); setActiveTab('claims'); }} className="hover:text-blue-600 transition-colors">Claim Hub</a>
            <a href="#admin" onClick={(e) => { e.preventDefault(); setActiveTab('admin'); }} className="hover:text-rose-600 transition-colors">Admin Panel</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
