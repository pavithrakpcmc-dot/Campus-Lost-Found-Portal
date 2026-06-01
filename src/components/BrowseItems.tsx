import React, { useState } from 'react';
import { Item, User, ClaimRequest, CATEGORIES, LOCATIONS } from '../types';
import { 
  Search, Filter, MapPin, Tag, Calendar, User as UserIcon, 
  HelpCircle, Eye, ChevronRight, CheckCircle2, AlertCircle, FileText,
  Smartphone, Key, CreditCard, BookOpen, Shirt, CupSoda, Briefcase, Box
} from 'lucide-react';

interface BrowseItemsProps {
  items: Item[];
  currentUser: User | null;
  onOpenAuth: () => void;
  onSubmitClaim: (itemId: string, message: string) => void;
  onResolveItem: (itemId: string) => void;
  claimRequests: ClaimRequest[];
}

export default function BrowseItems({
  items,
  currentUser,
  onOpenAuth,
  onSubmitClaim,
  onResolveItem,
  claimRequests,
}: BrowseItemsProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [lostOrFoundFilter, setLostOrFoundFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  
  // Selected Item for rich details expander model
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [claimMessage, setClaimMessage] = useState<string>('');
  const [claimSubmittedSuccessfully, setClaimSubmittedSuccessfully] = useState<boolean>(false);

  // Helper to map category names to appropriate Lucide Icons
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Electronics & Gadgets':
        return <Smartphone className="h-5 w-5" />;
      case 'Keys':
        return <Key className="h-5 w-5" />;
      case 'Wallets, Cards & Cush':
        return <CreditCard className="h-5 w-5" />;
      case 'Books & Stationery':
        return <BookOpen className="h-5 w-5" />;
      case 'Clothing & Accessories':
        return <Shirt className="h-5 w-5" />;
      case 'Water Bottles & Flasks':
        return <CupSoda className="h-5 w-5" />;
      case 'ID Cards & Documents':
        return <FileText className="h-5 w-5" />;
      case 'Bags & Backpacks':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Box className="h-5 w-5" />;
    }
  };

  // Filter logic
  const filteredItems = items.filter((item) => {
    const matchSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchLocation = selectedLocation === 'All' || item.location === selectedLocation;
    
    const matchLostFound = 
      lostOrFoundFilter === 'all' || item.lostOrFound === lostOrFoundFilter;
    
    const matchStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'open' && item.status === 'open') ||
      (statusFilter === 'resolved' && (item.status === 'resolved' || item.status === 'claimed'));

    return matchSearch && matchCategory && matchLocation && matchLostFound && matchStatus;
  });

  const handleOpenItemDetails = (item: Item) => {
    setSelectedItem(item);
    setClaimMessage('');
    setClaimSubmittedSuccessfully(false);
  };

  const handleCloseItemDetails = () => {
    setSelectedItem(null);
  };

  const handleClaimFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!selectedItem) return;
    if (!claimMessage.trim()) {
      alert('Please fill out a claim verification message first.');
      return;
    }

    onSubmitClaim(selectedItem.id, claimMessage.trim());
    setClaimSubmittedSuccessfully(true);
    setClaimMessage('');
  };

  // Check if current user has already claimed this item
  const hasAlreadyClaimed = currentUser && selectedItem && claimRequests.some(
    (req) => req.itemId === selectedItem.id && req.claimantId === currentUser.id
  );

  return (
    <div id="browse-items-panel" className="font-sans">
      {/* Search & Filtering Bars */}
      <div id="filter-controls-card" className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Keyword Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-3.5 text-slate-400 h-4 w-4" />
            <input
              type="text"
              id="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, tags, physical descriptors or locations..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 font-sans"
            />
          </div>

          {/* Quick Lost/Found Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg self-start lg:self-auto shrink-0">
            <button
              onClick={() => setLostOrFoundFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                lostOrFoundFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setLostOrFoundFilter('lost')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                lostOrFoundFilter === 'lost'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost
            </button>
            <button
              onClick={() => setLostOrFoundFilter('found')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                lostOrFoundFilter === 'found'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found
            </button>
          </div>
        </div>

        {/* Dropdowns Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Categories ({items.length})</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Filter by Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="All">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Posting Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white focus:outline-hidden focus:border-blue-500 cursor-pointer"
            >
              <option value="all">Active & Handled</option>
              <option value="open">Active Open Listings Only</option>
              <option value="resolved">Resolved Items Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of items */}
      {filteredItems.length === 0 ? (
        <div id="no-items-banner" className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <HelpCircle size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-md font-bold text-slate-800">No matching items found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try correcting spelling, choosing wider filters, resetting the search bar, or logging in to post a new report.
          </p>
        </div>
      ) : (
        <div id="items-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isLost = item.lostOrFound === 'lost';
            const isResolved = item.status === 'resolved' || item.status === 'claimed';
            
            return (
              <div
                key={item.id}
                id={`item-card-${item.id}`}
                className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all duration-200 relative group"
              >
                {/* Header ribbon for status */}
                <div className="absolute top-3 left-3 z-10">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${
                    isLost
                      ? 'bg-rose-500 text-white'
                      : 'bg-teal-600 text-white'
                  }`}>
                    {item.lostOrFound}
                  </span>
                </div>

                {isResolved && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="px-2 py-0.5 roundedbg-emerald-100 text-emerald-800 bg-emerald-50 border border-emerald-200 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <CheckCircle2 size={10} />
                      Resolved
                    </span>
                  </div>
                )}

                {/* Cover representation (Image or clean category gradient) */}
                <div className="h-44 w-full bg-slate-50 relative flex items-center justify-center border-b border-slate-100 select-none overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br flex flex-col items-center justify-center p-4 text-center ${
                      isLost 
                        ? 'from-rose-50/50 to-rose-105-tw/10 text-rose-500' 
                        : 'from-emerald-50/50 to-emerald-105-tw/10 text-emerald-600'
                    }`}>
                      <div className="p-3.5 bg-white rounded-full shadow-xs mb-2">
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="text-[10px] font-mono tracking-widest uppercase opacity-60 font-semibold">{item.category}</span>
                    </div>
                  )}
                </div>

                {/* Details info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-slate-400" />
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-slate-400" />
                      <span>{item.dateString}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <UserIcon size={12} className="text-slate-400" />
                      <span className="truncate">Reported by: <span className="font-medium text-slate-700">{item.postedByName}</span></span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      id={`view-details-${item.id}`}
                      onClick={() => handleOpenItemDetails(item)}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200/60 transition-all font-sans"
                    >
                      <Eye size={13} />
                      <span> {isResolved ? 'View Post Record' : 'View Details & Connect'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Item details and Claim Overlay Modal */}
      {selectedItem && (
        <div id="details-modal-overlay" className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div id="details-modal-card" className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]">
            
            {/* Close */}
            <button
              id="close-details-modal-btn"
              onClick={handleCloseItemDetails}
              className="absolute top-3 right-3 z-20 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1.5 transition-colors"
            >
              <FileText size={18} className="rotate-45" />
            </button>

            {/* Left side: Graphics/Image */}
            <div className="w-full md:w-1/2 bg-slate-950 relative select-none">
              {selectedItem.imageUrl ? (
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover min-h-[220px]"
                />
              ) : (
                <div className="h-full w-full min-h-[220px] bg-gradient-to-br from-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="p-4 bg-white/10 rounded-full mb-3 text-indigo-300">
                    {getCategoryIcon(selectedItem.category)}
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">{selectedItem.category}</h4>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono">No Image Uploaded</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <span className={`px-2.5 py-1 rounded text-xs font-extrabold uppercase tracking-widest shadow-md ${
                  selectedItem.lostOrFound === 'lost'
                    ? 'bg-rose-600 text-white'
                    : 'bg-teal-600 text-white'
                }`}>
                  {selectedItem.lostOrFound}
                </span>
              </div>
            </div>

            {/* Right side: item information & forms */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between max-h-[90vh] md:max-h-[600px] bg-white">
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest font-mono bg-blue-50 px-2 py-0.5 rounded-full">{selectedItem.category}</span>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight mt-1">
                    {selectedItem.title}
                  </h2>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <p className="leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-100 text-[11px] text-slate-700 italic">
                    "{selectedItem.description}"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-1.5 font-medium">
                    <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100">
                      <span className="text-slate-400 block font-normal uppercase text-[8px]">Location</span>
                      <span className="text-slate-800 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-rose-500" /> {selectedItem.location}
                      </span>
                    </div>
                    <div className="bg-slate-50/50 p-2 rounded-md border border-slate-100">
                      <span className="text-slate-400 block font-normal uppercase text-[8px]">Date Reported</span>
                      <span className="text-slate-800 font-bold flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {selectedItem.dateString}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reporter / Contact details */}
                <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-600 space-y-1">
                  <span className="block font-semibold uppercase text-slate-500 text-[8px] tracking-wider">Reporter Info</span>
                  <p>👤 <span className="font-semibold text-slate-800">{selectedItem.postedByName}</span> ({selectedItem.postedByEmail})</p>
                  <div>
                    <span className="font-semibold text-slate-800">☎️ Contact Instructions:</span>
                    <p className="bg-emerald-50 border border-emerald-100 text-emerald-950 font-mono text-[10px] px-2 py-1.5 rounded mt-1 select-all">
                      {selectedItem.contactInfo}
                    </p>
                  </div>
                </div>

                {/* Claim Flow Form Container (Module 4) */}
                {selectedItem.status !== 'resolved' && selectedItem.status !== 'claimed' ? (
                  <div className="border-t border-slate-100 pt-3">
                    {currentUser?.id === selectedItem.postedBy ? (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] p-2.5 rounded-lg">
                        <span className="font-bold flex items-center gap-1">
                          <AlertCircle size={12} /> This is your post
                        </span>
                        <p className="mt-1">
                          When this search is resolved or the items have been successfully returned to their owner, please close the request.
                        </p>
                        <button
                          id="resolve-item-direct-btn"
                          onClick={() => {
                            onResolveItem(selectedItem.id);
                            handleCloseItemDetails();
                          }}
                          className="mt-2 py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-[10px]"
                        >
                          Mark as Resolved
                        </button>
                      </div>
                    ) : hasAlreadyClaimed ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] p-2.5 rounded-lg text-center">
                        <CheckCircle2 size={16} className="text-emerald-500 mx-auto mb-1" />
                        <span className="font-bold">Claim Request Submitted</span>
                        <p className="mt-0.5">You have filed a claim. Wait for the owner to approve and view your contact coordinates.</p>
                      </div>
                    ) : claimSubmittedSuccessfully ? (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] p-3 rounded-lg text-center">
                        <span className="font-bold">Claim Sent!</span>
                        <p className="mt-0.5">Your contact details and message have been delivered to {selectedItem.postedByName}.</p>
                      </div>
                    ) : (
                      <form id="claim-submit-form" onSubmit={handleClaimFormSubmit} className="space-y-2 mt-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                        <span className="block text-[10px] font-bold text-blue-950 uppercase tracking-wide">
                          {selectedItem.lostOrFound === 'found' ? '🙋 Ready to claim this item?' : '🤝 Found this matching item?'}
                        </span>
                        <p className="text-[9px] text-blue-700 leading-snug">
                          {selectedItem.lostOrFound === 'found'
                            ? "Please specify unique identifiers (e.g. lockscreeen picture details, unique scuffs) so the finder can confirm your identity."
                            : "Write a short note explaining where you found it or where you left it."}
                        </p>
                        <textarea
                          placeholder={selectedItem.lostOrFound === 'found' ? "Explain proof of ownership..." : "Coordinates or location of found item..."}
                          rows={2}
                          required
                          id="claim-text-area"
                          value={claimMessage}
                          onChange={(e) => setClaimMessage(e.target.value)}
                          className="w-full px-2 py-1.5 border border-blue-200 rounded text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          id="claim-submit-btn"
                          className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-semibold transition-all cursor-pointer"
                        >
                          Submit Connecting Request & Unlock Contacts
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-100 border border-slate-200 text-slate-800 text-xs p-3 rounded-lg text-center font-bold">
                    🛡️ This record is closed and marked resolved.
                  </div>
                )}
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  id="cancel-details-modal-btn"
                  onClick={handleCloseItemDetails}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
