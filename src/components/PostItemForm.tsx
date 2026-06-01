import React, { useState, useRef } from 'react';
import { User, Item, CATEGORIES, LOCATIONS } from '../types';
import { Upload, HelpCircle, MapPin, CheckCircle, Smartphone, Key, CreditCard, BookOpen, UserCheck, ShieldAlert } from 'lucide-react';

interface PostItemFormProps {
  currentUser: User | null;
  onPostItem: (item: Omit<Item, 'id' | 'postedBy' | 'postedByName' | 'postedByEmail' | 'createdAt'>) => void;
  onOpenAuth: () => void;
}

export default function PostItemForm({
  currentUser,
  onPostItem,
  onOpenAuth,
}: PostItemFormProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [location, setLocation] = useState<string>(LOCATIONS[0]);
  const [lostOrFound, setLostOrFound] = useState<'lost' | 'found'>('found');
  const [contactInfo, setContactInfo] = useState<string>(currentUser?.contact || '');
  const [imageString, setImageString] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [dateString, setDateString] = useState<string>(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (currentUser) {
      setContactInfo(currentUser.contact || currentUser.email);
    }
  }, [currentUser]);

  const handleFileReader = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('The file size shouldn\'t exceed 2MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageString(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileReader(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileReader(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (!title.trim() || !description.trim() || !contactInfo.trim()) {
      alert('Must fill out title, description, and contact info.');
      return;
    }

    onPostItem({
      title: title.trim(),
      description: description.trim(),
      category,
      location,
      lostOrFound,
      imageUrl: imageString || undefined,
      contactInfo: contactInfo.trim(),
      status: 'open',
      dateString,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setLocation(LOCATIONS[0]);
    setImageString('');
    setSuccessMsg(`Your ${lostOrFound} item has been successfully reported!`);
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };

  if (!currentUser) {
    return (
      <div id="guest-post-blocker" className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center max-w-xl mx-auto shadow-xs font-sans">
        <ShieldAlert size={48} className="text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">Login Required to Report Items</h3>
        <p className="text-sm text-slate-600 mb-6">
          To maintain security, track claim ownerships, and protect campus privacy, you must be logged in as a registered student or staff member of the campus to submit a new lost or found post.
        </p>
        <button
          id="post-login-trigger"
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow-md active:scale-98"
        >
          Sign Up / Log In
        </button>
      </div>
    );
  }

  return (
    <div id="post-item-form-container" className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 font-sans">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 tracking-tight">Report Lost / Found Item</h2>
          <p className="text-xs text-slate-500 mt-0.5">Please provide accurate details so your peers can quickly spot or verify their items.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            id="mark-lost-btn"
            onClick={() => setLostOrFound('lost')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
              lostOrFound === 'lost'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            id="mark-found-btn"
            onClick={() => setLostOrFound('found')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              lostOrFound === 'found'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            I Found Something
          </button>
        </div>
      </div>

      {successMsg && (
        <div id="success-banner" className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg text-xs font-medium mb-6 flex items-start gap-2.5">
          <CheckCircle size={16} className="shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      <form id="post-item-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
              Item Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              id="post-item-title"
              placeholder="e.g. Blue Jansport Backpack, Matte Black Water Bottle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
              Date {lostOrFound === 'lost' ? 'Lost' : 'Found'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              id="post-item-date"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="post-item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer font-sans"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
              Campus Location <span className="text-rose-500">*</span>
            </label>
            <select
              id="post-item-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white transition-all cursor-pointer font-sans"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Detailed Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            id="post-item-desc"
            rows={4}
            placeholder={
              lostOrFound === 'lost'
                ? "Describe distinctive marks, stickers, color, model number, screen status, unique keychains, or contents. State exactly where you think you lost it."
                : "Describe key characteristics without revealing too many secret features (which can serve as claim verification, like lock screen pictures). Avoid stating internal secret compartment items."
            }
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-1.5">
            Claim / Retrieval Directions Contact <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            id="post-item-contact"
            placeholder="e.g. Email me / call +1 555-0100 / left with library administrator"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-950 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-sans"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-widest mb-2">
            Upload Item Photo <span className="text-slate-400 font-normal">(Optional, under 2MB)</span>
          </label>
          <div
            id="drag-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-150 ${
              isDragOver
                ? 'border-blue-600 bg-blue-50/70 shadow-inner'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              id="file-upload-input"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imageString ? (
              <div className="space-y-2 relative group inline-block max-w-[200px]">
                <img
                  src={imageString}
                  alt="Item preview"
                  className="mx-auto max-h-[140px] rounded-lg shadow-xs border border-slate-200"
                />
                <button
                  type="button"
                  id="remove-photo-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageString('');
                  }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 block underline mx-auto mt-1"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Upload className="text-slate-400 mb-2.5 h-8 w-8" />
                <p className="text-xs font-semibold text-slate-700">Drag & drop item photo here, or click to browse</p>
                <p className="text-[10px] text-slate-500 mt-1">Supports PNG, JPG, or WEBP. Max. file size 2MB.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            id="submit-post-btn"
            className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98] ${
              lostOrFound === 'lost'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            Publish {lostOrFound === 'lost' ? 'Lost Post' : 'Found Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
