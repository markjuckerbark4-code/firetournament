import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowDownToLine, 
  Share2, 
  UserCheck, 
  FileText, 
  Code, 
  Edit3, 
  LogOut, 
  Copy, 
  Check, 
  ExternalLink,
  Shield,
  Smartphone,
  ChevronRight,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileScreen: React.FC = () => {
  const { 
    currentUser, 
    logout, 
    setIsAuthModalOpen, 
    setIsWalletModalOpen, 
    setWalletDefaultTab,
    updateUserProfile,
    settings,
    isAdminRoute,
    setIsAdminRoute,
    isAdmin
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);

  // Form states for profile edit
  const [editName, setEditName] = useState(currentUser?.displayName || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editFfUid, setEditFfUid] = useState(currentUser?.ffUid || '');
  const [editFfIgn, setEditFfIgn] = useState(currentUser?.ffIgn || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!currentUser) {
    return (
      <div className="p-6 text-center space-y-4 pt-12 pb-24">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-lg text-slate-800">লগইন করা নেই</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          টুর্নামেন্টে জয়েন করতে, ব্যালেন্স দেখতে ও পুরস্কার তুলতে লগইন করুন।
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
        >
          লগইন / সাইন আপ করুন
        </button>
      </div>
    );
  }

  const totalBalance = currentUser.mainBalance + currentUser.gameBalance;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(currentUser.ffUid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({
      displayName: editName.trim(),
      phone: editPhone.trim(),
      ffUid: editFfUid.trim(),
      ffIgn: editFfIgn.trim()
    });
    setIsSaving(false);
    setIsEditProfileOpen(false);
  };

  return (
    <div className="p-3.5 space-y-4 pb-28">
      {/* Cyan/Sky-blue gradient hero card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#38b6ff] via-[#1d8cf8] to-[#1264c5] p-5 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          {/* Avatar with status */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/80 p-0.5 shadow-md flex items-center justify-center font-extrabold text-xl text-white">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#1d8cf8] rounded-full" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base leading-tight">
                {currentUser.displayName}
              </h2>
              {currentUser.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-2xs">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[11px] text-blue-100 font-medium mt-0.5">
              IGN: {currentUser.ffIgn || 'LG_PLAYER'}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[10px] bg-black/25 px-2 py-0.5 rounded-md font-mono text-blue-100 flex items-center gap-1">
                UID: {currentUser.ffUid}
              </span>
              <button
                onClick={handleCopyUid}
                className="p-1 rounded bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Copy UID"
              >
                {copiedUid ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* 3 Stats Columns: (Matches Joined, BDT Balance, Total Won) */}
        <div className="grid grid-cols-3 divide-x divide-white/20 bg-black/20 rounded-xl mt-4 p-2.5 text-center relative z-10">
          <div className="px-1">
            <span className="text-[10px] text-blue-100 font-semibold uppercase block">
              MATCHES
            </span>
            <span className="text-sm font-extrabold text-white tabular-nums">
              {currentUser.matchesJoined}
            </span>
          </div>

          <div className="px-1">
            <span className="text-[10px] text-blue-100 font-semibold uppercase block">
              BALANCE
            </span>
            <span className="text-sm font-extrabold text-amber-300 tabular-nums">
              ৳{totalBalance.toFixed(0)}
            </span>
          </div>

          <div className="px-1">
            <span className="text-[10px] text-blue-100 font-semibold uppercase block">
              TOTAL WON
            </span>
            <span className="text-sm font-extrabold text-emerald-300 tabular-nums">
              ৳{currentUser.totalWon}
            </span>
          </div>
        </div>
      </div>

      {/* White Menu Buttons List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {/* 1. My Wallet */}
        <button
          onClick={() => {
            setIsWalletModalOpen(true);
            setWalletDefaultTab('deposit');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">মাই ওয়ালেট (My Wallet)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">ডিপোজিট, ব্যালেন্স স্টেটমেন্ট ও হিস্ট্রি</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 2. Withdraw */}
        <button
          onClick={() => {
            setIsWalletModalOpen(true);
            setWalletDefaultTab('withdraw');
          }}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowDownToLine className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">টাকা উত্তোলন (Withdraw)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">বিকাশ, নগদ, রকেটে ক্যাশ আউট</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 3. Refer and Earn with copyable code */}
        <button
          onClick={() => setIsReferModalOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">রেফার এবং আয় (Refer & Earn)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">বন্ধুদের ইনভাইট করে বোনাস ক্যাশ জিতুন</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {currentUser.referralCode}
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* 4. Edit Profile / My Profile */}
        <button
          onClick={() => setIsEditProfileOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">প্রোফাইল এডিট (Edit Profile)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">গেমের নাম ও UID আপডেট করুন</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 5. App Rules */}
        <button
          onClick={() => setIsRulesModalOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">অ্যাপের নিয়মাবলী (App Rules)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">ফেয়ার প্লে পলিসি ও ম্যাচ গাইডলাইন</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* 6. Developer Profile */}
        <button
          onClick={() => setIsDevModalOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">ডেভেলপার প্রোফাইল (Developer Info)</span>
              <span className="text-[10.5px] text-slate-400 font-medium">LG LEADER BD কারিগরি তথ্য ও সংস্করণ</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>


      </div>

      {/* Rounded blue Logout button */}
      <div className="pt-2">
        <button
          onClick={logout}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/15 flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট করুন (Logout)</span>
        </button>
      </div>

      {/* REFER & EARN MODAL */}
      {isReferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Share2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">রেফার এবং ক্যাশ বোনাস</h3>
              <p className="text-xs text-slate-500 mt-1">
                আপনার রেফার কোড দিয়ে বন্ধুকে সাইন আপ করান। বন্ধু প্রথম ডিপোজিট করলেই পাবেন নিশ্চিত ১০ টাকা বোনাস!
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
              <span className="font-mono text-base font-extrabold text-purple-900 tracking-wider">
                {currentUser.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'কপি হয়েছে' : 'কপি করুন'}</span>
              </button>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`LG LEADER BD তে ফ্রি ফায়ার টুর্নামেন্ট খেলুন এবং জিতে নিন নগদ টাকা! আমার রেফারেল কোড: ${currentUser.referralCode}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <span>হোয়াটসঅ্যাপে শেয়ার করুন</span>
            </a>

            <button
              onClick={() => setIsReferModalOpen(false)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveProfile}
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-150"
          >
            <h3 className="font-extrabold text-base text-slate-900 text-center">
              প্রোফাইল তথ্য আপডেট
            </h3>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">পূর্ণ নাম</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">মোবাইল নম্বর</label>
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Free Fire IGN (ইন-গেম নেম)</label>
              <input
                type="text"
                value={editFfIgn}
                onChange={(e) => setEditFfIgn(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Free Fire UID (প্লেয়ার আইডি)</label>
              <input
                type="text"
                value={editFfUid}
                onChange={(e) => setEditFfUid(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* APP RULES MODAL */}
      {isRulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-3.5 max-h-[80vh] overflow-y-auto">
            <h3 className="font-extrabold text-base text-slate-900 text-center">
              LG LEADER BD - নীতিমালা ও শর্তাবলী
            </h3>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <p>১. <strong>ফেয়ার প্লে:</strong> কোনো প্রকার হ্যাক, স্ক্রিপ্ট, এমুলেটর বা কনফিগ ব্যবহার সম্পূর্ণ নিষিদ্ধ। প্রমাণিত হলে স্থায়ী ব্যান ও ব্যালেন্স বাজেয়াপ্ত হবে।</p>
              <p>২. <strong>কাস্টম রুম জয়েন:</strong> রুম আইডি ও পাসওয়ার্ড ম্যাচ শুরুর ১৫ মিনিট পূর্বে অ্যাপের ম্যাচ কার্ডে প্রদান করা হবে। নির্ধারিত সময়ে নিজ স্লটে বসতে হবে।</p>
              <p>৩. <strong>পুরস্কার বিতরণ:</strong> ম্যাচ শেষ হওয়ার ৩০ মিনিটের মধ্যে ফলাফল প্রকাশ ও বিজয়ী প্লেয়ারদের অ্যাকাউন্টে স্বয়ংক্রিয়ভাবে প্রাইজমানি যুক্ত হবে।</p>
              <p>৪. <strong>উত্তোলন:</strong> সর্বনিম্ন ৫০ টাকা থেকে শুরু করে প্রতিদিন সর্বোচ্চ ১০০০ টাকা পর্যন্ত বিকাশ, নগদ বা রকেটে উত্তোলন করা যাবে।</p>
            </div>
            <button
              onClick={() => setIsRulesModalOpen(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}

      {/* DEVELOPER MODAL */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Code className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900">LG LEADER BD Esports System</h3>
            <p className="text-xs text-slate-500">
              High-performance Free Fire Esports platform with real-time Firebase Firestore synchronization, automated prize payouts, and multi-tier dual wallet security.
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl text-[11px] text-slate-600 font-mono text-left">
              <div>Version: v2.4.0 (Enterprise)</div>
              <div>Database: Cloud Firestore</div>
              <div>Engine: React 19 + TypeScript + Vite</div>
              <div>Region: Asia-Southeast1</div>
            </div>
            <button
              onClick={() => setIsDevModalOpen(false)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
