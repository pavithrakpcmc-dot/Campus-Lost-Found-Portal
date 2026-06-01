import React from 'react';
import { ClaimRequest, User, Item } from '../types';
import { 
  CheckCircle, XCircle, FileClock, Phone, FolderDown,
  UserCheck, Bell, MessageSquare, ShieldAlert, BadgeInfo
} from 'lucide-react';

interface ClaimManagerProps {
  currentUser: User | null;
  items: Item[];
  claimRequests: ClaimRequest[];
  onApproveClaim: (claimId: string) => void;
  onRejectClaim: (claimId: string) => void;
  onOpenAuth: () => void;
}

export default function ClaimManager({
  currentUser,
  items,
  claimRequests,
  onApproveClaim,
  onRejectClaim,
  onOpenAuth,
}: ClaimManagerProps) {

  if (!currentUser) {
    return (
      <div id="claim-manager-guest-blocker" className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs font-sans">
        <ShieldAlert size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Login Required to Manage Claims</h3>
        <p className="text-sm text-slate-600 mb-6">
          To manage claim verifications, approve ownership handovers, or track your submitted claims, please authenticate using a student profile.
        </p>
        <button
          id="claim-login-trigger"
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md active:scale-98 cursor-pointer"
        >
          Sign Up / Log In
        </button>
      </div>
    );
  }

  // Filter requests
  // Received claims: items posted by currentUser
  const receivedClaims = claimRequests.filter((req) => req.ownerId === currentUser.id);
  // Sent claims: requests filed by currentUser
  const sentClaims = claimRequests.filter((req) => req.claimantId === currentUser.id);

  return (
    <div id="claim-manager-container" className="space-y-8 font-sans">
      
      {/* Received claims section */}
      <div id="received-claims-section" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Bell className="text-blue-600 h-5 w-5" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Claims Received ({receivedClaims.length})</h2>
            <p className="text-xs text-slate-500">Other students claiming ownership or verifying objects you reported.</p>
          </div>
        </div>

        {receivedClaims.length === 0 ? (
          <div id="no-received-claims" className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-lg text-xs">
            No claim requests received on your postings yet.
          </div>
        ) : (
          <div className="space-y-4">
            {receivedClaims.map((claim) => (
              <div 
                key={claim.id} 
                id={`received-claim-card-${claim.id}`}
                className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/20 hover:bg-slate-50/80 transition-all text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3 mb-3">
                  <div>
                    <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      Request on post
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{claim.itemTitle}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 self-start">
                    <span className="text-slate-400">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      claim.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : claim.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Claimant credentials */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Claimant Identity</span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200/60 space-y-1 text-slate-700">
                      <p>👤 <span className="font-semibold text-slate-900">{claim.claimantName}</span></p>
                      <p>🏫 <span className="font-medium text-slate-600">Department:</span> {claim.claimantDept}</p>
                      <p className="flex items-center gap-1 font-mono text-[11px] mt-1 pt-1 border-t border-slate-100 bg-slate-50/60 p-1 rounded">
                        <Phone size={12} className="text-blue-600 shrink-0" />
                        <span>{claim.claimantContact}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Claim Message / Proof details */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Verification Proof & Message</span>
                    <div className="bg-white p-3 rounded-lg border border-slate-200/60 text-slate-700 h-full relative">
                      <p className="italic text-[11px] leading-relaxed">
                        "{claim.message}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {claim.status === 'pending' && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end gap-2">
                    <button
                      id={`reject-claim-btn-${claim.id}`}
                      onClick={() => onRejectClaim(claim.id)}
                      className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 text-slate-700 rounded-lg bg-white font-semibold transition-colors flex items-center gap-1"
                    >
                      <XCircle size={14} className="text-rose-500" />
                      <span>Reject & Deny</span>
                    </button>
                    <button
                      id={`approve-claim-btn-${claim.id}`}
                      onClick={() => onApproveClaim(claim.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition-colors flex items-center gap-1 active:scale-[0.98]"
                    >
                      <CheckCircle size={14} />
                      <span>Approve & Shared Contact</span>
                    </button>
                  </div>
                )}

                {claim.status === 'approved' && (
                  <div className="mt-3 pt-2 border-t border-slate-100 text-emerald-800 bg-emerald-50/50 p-2 rounded flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                    <span>You approved this claim. Platform unlocked contact details for exchange.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sent claims section */}
      <div id="sent-claims-section" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <FolderDown className="text-slate-600 h-5 w-5" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Claims Submitted ({sentClaims.length})</h2>
            <p className="text-xs text-slate-500">Track claim forms you have launched regarding items reported by other people.</p>
          </div>
        </div>

        {sentClaims.length === 0 ? (
          <div id="no-sent-claims" className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-lg text-xs">
            You haven't made any claim requests yet. Click "View Details" on found items to request ownership.
          </div>
        ) : (
          <div className="space-y-4">
            {sentClaims.map((claim) => (
              <div 
                key={claim.id} 
                id={`sent-claim-card-${claim.id}`}
                className="border border-slate-200 rounded-xl p-4 bg-slate-50/30 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{claim.itemTitle}</h3>
                    <span className="text-[10px] text-slate-400">Filed on: {new Date(claim.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium font-mono text-[10px]">Status:</span>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                      claim.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : claim.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-white border border-slate-200/80 rounded-lg space-y-2 text-slate-700">
                  <p className="font-medium text-slate-400 text-[10px] tracking-wide uppercase">Your Verification Message:</p>
                  <p className="italic text-[11px] leading-relaxed">
                    "{claim.message}"
                  </p>
                </div>

                <div className="mt-3 text-[10px] text-slate-500">
                  {claim.status === 'pending' && (
                    <p className="flex items-center gap-1">
                      <FileClock size={12} className="text-amber-500" />
                      <span>Pending finder confirmation. Keep your notification or email open.</span>
                    </p>
                  )}
                  {claim.status === 'approved' && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-2 rounded-lg flex flex-col gap-1 mt-1 text-[11px]">
                      <span className="font-semibold flex items-center gap-1 text-emerald-900">
                        🎉 Claim Approved by Finder!
                      </span>
                      <span>The finder verified your details. Contact them to complete pickup or retrieval.</span>
                    </div>
                  )}
                  {claim.status === 'rejected' && (
                    <p className="flex items-center gap-1 text-rose-700">
                      <XCircle size={12} className="text-rose-500" />
                      <span>Claim rejected. Finder indicated details did not match.</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
