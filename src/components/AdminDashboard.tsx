import React from 'react';
import { Item, User, ClaimRequest } from '../types';
import { 
  Trash2, ShieldAlert, Users, Layers, CheckCircle, Clock,
  MapPin, RefreshCw, BarChart2, MessageSquare, AlertTriangle, ShieldCheck
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User | null;
  items: Item[];
  users: User[];
  claimRequests: ClaimRequest[];
  onDeleteItem: (itemId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function AdminDashboard({
  currentUser,
  items,
  users,
  claimRequests,
  onDeleteItem,
  onDeleteUser,
}: AdminDashboardProps) {

  // Safeguard
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div id="admin-safety-blocker" className="bg-rose-50 border border-rose-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs font-sans">
        <ShieldAlert size={48} className="text-rose-600 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-rose-900 mb-2">Access Denied & Security Alert</h3>
        <p className="text-sm text-rose-700 mb-6">
          This panel is restricted of access. Only campus staff registered with "System Admin" credentials may log in to manage posts or remove duplicate/inappropriate entries.
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Hint: Use the "Simulation Workspace Controls" ribbon at the top to switch your role to "Professor Vance (Admin)".
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalItems = items.length;
  const lostCount = items.filter((i) => i.lostOrFound === 'lost').length;
  const foundCount = items.filter((i) => i.lostOrFound === 'found').length;
  const resolvedCount = items.filter((i) => i.status === 'resolved' || i.status === 'claimed').length;
  const pendingClaimsCount = claimRequests.filter((c) => c.status === 'pending').length;

  return (
    <div id="admin-panel-container" className="space-y-6 font-sans">
      
      {/* Admin stats widgets */}
      <div id="admin-analytics-grid" className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Total Reports</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-white">{totalItems}</span>
            <Layers className="text-slate-505 shrink-0 text-slate-500" size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] text-rose-600 font-bold uppercase tracking-widest font-mono">Lost Items</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-rose-600">{lostCount}</span>
            <AlertTriangle className="text-rose-500 shrink-0" size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest font-mono">Found Items</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-teal-600">{foundCount}</span>
            <ShieldCheck className="text-teal-500 shrink-0" size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest font-mono">Resolved</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-600">{resolvedCount}</span>
            <CheckCircle className="text-emerald-500 shrink-0" size={18} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs col-span-2 md:col-span-1 flex flex-col justify-between">
          <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest font-mono">Pending Claims</span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600">{pendingClaimsCount}</span>
            <Clock className="text-amber-500 shrink-0" size={18} />
          </div>
        </div>

      </div>

      {/* Main split manager panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Manage Posts / Inappropriate duplicates Section (Modules 5) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-md font-bold text-slate-900">Manage Campus Reports & Postings</h2>
              <p className="text-[11px] text-slate-500">Remove duplicate postings, outdated reports, or inappropriate text entries instantly.</p>
            </div>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
              {items.length} Active Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="py-2.5">Item Info / Category</th>
                  <th className="py-2.5">Campus Location</th>
                  <th className="py-2.5">Owner / Contact</th>
                  <th className="py-2.5 text-center">Status</th>
                  <th className="py-2.5 text-right">Delete Operations</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3">
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.lostOrFound === 'lost' ? 'bg-rose-500' : 'bg-teal-500'}`}></span>
                          <span>{item.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{item.category}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-slate-400" />
                        <span>{item.location}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 font-serif whitespace-nowrap">
                      <div>
                        <span className="font-semibold block font-sans text-slate-700">{item.postedByName}</span>
                        <span className="text-[10px] font-mono text-slate-400">{item.postedByEmail}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        item.status === 'open' 
                          ? 'bg-amber-50 border border-amber-200 text-amber-700' 
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        id={`delete-item-${item.id}`}
                        onClick={() => {
                          if (confirm(`Remove this post: "${item.title}"? This cannot be undone.`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1 px-2 text-rose-600 hover:bg-rose-50 hover:text-rose-800 rounded transition-colors text-[11px] font-bold inline-flex items-center gap-1"
                        title="Remove duplicate or inappropriate post"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Users section */}
        <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-slate-600" />
              <h2 className="text-sm font-bold text-slate-900">Registered Student Accounts</h2>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded font-mono">
              {users.length} Total
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {users.map((user) => {
              const isAdmin = user.role === 'admin';
              return (
                <div 
                  key={user.id} 
                  id={`admin-user-${user.id}`}
                  className="flex items-center justify-between p-2.5 border border-slate-100 rounded-lg hover:bg-slate-50/50 transition-colors text-xs"
                >
                  <div className="truncate">
                    <p className="font-bold text-slate-800 truncate flex items-center gap-1">
                      {user.name}
                      {isAdmin && (
                        <span className="text-[8px] bg-red-100 text-red-800 font-bold uppercase px-1 rounded">Admin</span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5 font-mono">
                      {user.department} • {user.contact}
                    </p>
                  </div>
                  
                  {!isAdmin && (
                    <button
                      id={`delete-user-${user.id}`}
                      onClick={() => {
                        if (confirm(`Revoke and purge profile for ${user.name}? This will remove all their items too.`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="p-1 hover:bg-rose-50 text-rose-600 rounded transition-colors ml-4 shrink-0"
                      title="Deactivate account"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-2.5 rounded-lg text-xs leading-relaxed">
            <span className="font-bold flex items-center gap-1">
              <BarChart2 size={12} /> Compliance Notice
            </span>
            <p className="mt-1 text-[10px] text-blue-900">
              Admins are responsible for verifying that contact data holds genuine campus addresses and handling potential disputes regarding misattributed claims.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
