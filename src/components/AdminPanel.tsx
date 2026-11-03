import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Swords, 
  CreditCard, 
  Settings as SettingsIcon, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  ArrowLeft, 
  Lock, 
  Search, 
  DollarSign, 
  AlertTriangle,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Sliders,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TournamentMatch, GatewayType, ScoreboardEntry, MatchCategory } from '../types';

export const AdminPanel: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    matches, 
    transactions, 
    settings, 
    createMatch, 
    updateMatch, 
    deleteMatch, 
    publishRoomDetails,
    publishResults,
    approveDeposit, 
    rejectDeposit, 
    approveWithdraw, 
    rejectWithdraw,
    adjustUserBalance,
    toggleBanUser,
    updateSettings,
    setIsAdminRoute,
    quickDemoLogin
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'matches' | 'results' | 'transactions' | 'users' | 'settings'>('dashboard');

  // Match Create/Edit Form
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchTitle, setMatchTitle] = useState('');
  const [matchCategory, setMatchCategory] = useState<MatchCategory>('solo');
  const [matchMap, setMatchMap] = useState('Bermuda');
  const [matchType, setMatchType] = useState<'SOLO' | 'DUO' | 'SQUAD' | '4v4'>('SOLO');
  const [matchVersion, setMatchVersion] = useState<'TPP' | 'FPP'>('TPP');
  const [matchEntryFee, setMatchEntryFee] = useState<number>(30);
  const [matchPerKill, setMatchPerKill] = useState<number>(10);
  const [matchWinPrize, setMatchWinPrize] = useState<number>(450);
  const [matchTotalPrize, setMatchTotalPrize] = useState<number>(950);
  const [matchTotalSlots, setMatchTotalSlots] = useState<number>(48);
  const [matchScheduleTime, setMatchScheduleTime] = useState('Today at 08:30 PM');
  const [matchRules, setMatchRules] = useState('1. No emulators allowed.\n2. Level 35+ ID required.\n3. Teaming up will result in a permanent ban.');
  const [matchBanner, setMatchBanner] = useState('/src/assets/images/ff_alok_solo_1793678913693.jpg');

  // Room Credentials Release modal
  const [roomModalMatchId, setRoomModalMatchId] = useState<string | null>(null);
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomPassInput, setRoomPassInput] = useState('');

  // Result Declaration state
  const [selectedResultMatchId, setSelectedResultMatchId] = useState<string>('');
  const [winnerName, setWinnerName] = useState('');
  const [winnerIgn, setWinnerIgn] = useState('');
  const [winnerFfUid, setWinnerFfUid] = useState('');
  const [winnerPrize, setWinnerPrize] = useState<number>(500);
  const [scoreboardEntries, setScoreboardEntries] = useState<ScoreboardEntry[]>([
    { rank: 1, playerName: '', ign: '', ffUid: '', kills: 5, winningAmount: 500 },
    { rank: 2, playerName: '', ign: '', ffUid: '', kills: 4, winningAmount: 40 },
    { rank: 3, playerName: '', ign: '', ffUid: '', kills: 3, winningAmount: 30 }
  ]);
  const [publishFeedback, setPublishFeedback] = useState<string | null>(null);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustAccount, setAdjustAccount] = useState<'main' | 'game'>('main');
  const [adjustAmount, setAdjustAmount] = useState<number>(50);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Transactions Filter
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'deposit' | 'withdraw'>('pending');

  // Metrics
  const totalUsersCount = allUsers.length;
  const totalApprovedDeposits = transactions
    .filter((t) => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalApprovedWithdrawals = transactions
    .filter((t) => t.type === 'withdraw' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);
  const liveActiveMatchesCount = matches.filter((m) => m.status === 'upcoming' || m.status === 'ongoing').length;
  const pendingTransactionsCount = transactions.filter((t) => t.status === 'pending').length;

  const handleOpenCreateMatch = () => {
    setEditingMatchId(null);
    setMatchTitle(`MATCH #${matches.length + 101} - BERMUDA SOLO GRAND RUSH`);
    setMatchCategory('solo');
    setMatchMap('Bermuda');
    setMatchType('SOLO');
    setMatchVersion('TPP');
    setMatchEntryFee(30);
    setMatchPerKill(10);
    setMatchWinPrize(450);
    setMatchTotalPrize(950);
    setMatchTotalSlots(48);
    setMatchScheduleTime('Today at 09:00 PM');
    setIsMatchFormOpen(true);
  };

  const handleOpenEditMatch = (m: TournamentMatch) => {
    setEditingMatchId(m.id);
    setMatchTitle(m.title);
    setMatchCategory(m.category);
    setMatchMap(m.map);
    setMatchType(m.type);
    setMatchVersion(m.version);
    setMatchEntryFee(m.entryFee);
    setMatchPerKill(m.perKill);
    setMatchWinPrize(m.winPrize);
    setMatchTotalPrize(m.totalPrize);
    setMatchTotalSlots(m.totalSlots);
    setMatchScheduleTime(m.scheduleTime);
    setMatchRules(m.rules);
    setMatchBanner(m.bannerImage);
    setIsMatchFormOpen(true);
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMatchId) {
      await updateMatch(editingMatchId, {
        title: matchTitle,
        category: matchCategory,
        map: matchMap,
        type: matchType,
        version: matchVersion,
        entryFee: Number(matchEntryFee),
        perKill: Number(matchPerKill),
        winPrize: Number(matchWinPrize),
        totalPrize: Number(matchTotalPrize),
        totalSlots: Number(matchTotalSlots),
        scheduleTime: matchScheduleTime,
        rules: matchRules,
        bannerImage: matchBanner
      });
    } else {
      await createMatch({
        title: matchTitle,
        category: matchCategory,
        categorySection: matchCategory === 'ludo_free' || matchCategory === 'lonewolf' ? 'ludo_and_free' : 'free_fire',
        map: matchMap,
        type: matchType,
        version: matchVersion,
        entryFee: Number(matchEntryFee),
        perKill: Number(matchPerKill),
        winPrize: Number(matchWinPrize),
        totalPrize: Number(matchTotalPrize),
        totalSlots: Number(matchTotalSlots),
        scheduleTime: matchScheduleTime,
        status: 'upcoming',
        rules: matchRules,
        bannerImage: matchBanner
      });
    }
    setIsMatchFormOpen(false);
  };

  const handlePublishRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomModalMatchId && roomIdInput) {
      await publishRoomDetails(roomModalMatchId, roomIdInput.trim(), roomPassInput.trim());
      setRoomModalMatchId(null);
      setRoomIdInput('');
      setRoomPassInput('');
    }
  };

  const handlePublishResultsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResultMatchId) {
      setPublishFeedback('Please choose a match to declare results for.');
      return;
    }
    if (!winnerName.trim() && !winnerIgn.trim()) {
      setPublishFeedback('Please enter the winner details.');
      return;
    }

    const res = await publishResults({
      matchId: selectedResultMatchId,
      winnerName: winnerName.trim() || winnerIgn.trim(),
      winnerIgn: winnerIgn.trim() || winnerName.trim(),
      winnerFfUid: winnerFfUid.trim(),
      winnerPrize: Number(winnerPrize),
      scoreboard: scoreboardEntries.filter((s) => s.ign || s.playerName)
    });

    setPublishFeedback(res.message);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'pending') return t.status === 'pending';
    if (txFilter === 'deposit') return t.type === 'deposit';
    if (txFilter === 'withdraw') return t.type === 'withdraw';
    return true;
  });

  const filteredUsers = allUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase();
    return (
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.ffUid.includes(q) ||
      u.ffIgn.toLowerCase().includes(q)
    );
  });

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    window.history.pushState({}, '', '/');
  };

  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return currentUser?.role === 'admin' || currentUser?.email === 'markjuckerbark4@gmail.com';
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === 'ESA006##@@') {
      quickDemoLogin('admin');
      setIsAdminAuthenticated(true);
      setAdminAuthError('');
    } else {
      setAdminAuthError('ভুল পাসওয়ার্ড! সঠিক এডমিন পাসওয়ার্ড লিখুন।');
    }
  };

  // If not authenticated as admin, show dedicated Admin Security Gate
  if (!isAdminAuthenticated && currentUser?.role !== 'admin' && currentUser?.email !== 'markjuckerbark4@gmail.com') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-extrabold text-base text-white tracking-tight">
              LG LEADER BD · ADMIN PORTAL
            </h2>
            <p className="text-xs text-slate-400">
              এডমিন প্যানেলে প্রবেশ করতে পাসওয়ার্ড প্রদান করুন
            </p>
          </div>

          {adminAuthError && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800/60 text-red-300 text-xs text-center font-medium">
              {adminAuthError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                এডমিন পাসওয়ার্ড (Admin Password)
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => {
                    setAdminPasswordInput(e.target.value);
                    if (adminAuthError) setAdminAuthError('');
                  }}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl font-extrabold text-xs uppercase shadow-md active:scale-[0.98] transition-all"
            >
              এডমিন প্যানেলে প্রবেশ করুন
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleExitAdmin}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
            >
              ← সাধারণ ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col max-w-md mx-auto relative pb-20">
      {/* Top Admin Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-3.5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleExitAdmin}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
            title="Back to App"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <h1 className="font-extrabold text-sm text-white tracking-tight">
                ADMIN CONTROL PANEL
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              LG LEADER BD · Full Authority
            </p>
          </div>
        </div>

        <button
          onClick={handleExitAdmin}
          className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold"
        >
          View App
        </button>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex items-center overflow-x-auto bg-slate-950 border-b border-slate-800 p-1.5 scrollbar-none text-xs font-semibold gap-1">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
          { id: 'matches', label: 'Matches', icon: Swords },
          { id: 'results', label: 'Results', icon: Trophy },
          { id: 'transactions', label: `Transactions ${pendingTransactionsCount > 0 ? `(${pendingTransactionsCount})` : ''}`, icon: CreditCard },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'settings', label: 'Settings', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTENT AREA */}
      <div className="p-3.5 flex-1 space-y-4">
        {/* 1. DASHBOARD */}
        {activeAdminTab === 'dashboard' && (
          <div className="space-y-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>মোট ইউজার</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-extrabold text-white tabular-nums">
                  {totalUsersCount}
                </div>
                <span className="text-[10px] text-blue-400 font-semibold block">রেজিস্টার্ড প্লেয়ার</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>লাইভ ম্যাচ</span>
                  <Swords className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-white tabular-nums">
                  {liveActiveMatchesCount}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">চলমান টুর্নামেন্ট</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>মোট ডিপোজিট</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-extrabold text-emerald-400 tabular-nums">
                  ৳{totalApprovedDeposits}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block">সফল জমা</span>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>মোট উত্তোলন</span>
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-extrabold text-amber-400 tabular-nums">
                  ৳{totalApprovedWithdrawals}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold block">ক্যাশ আউট পরিশোধ</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2.5">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                কুইক এডমিন অ্যাকশন
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveAdminTab('matches');
                    handleOpenCreateMatch();
                  }}
                  className="py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ম্যাচ তৈরি</span>
                </button>

                <button
                  onClick={() => setActiveAdminTab('transactions')}
                  className="py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>পেন্ডিং ট্রানজেকশন ({pendingTransactionsCount})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. MATCH MANAGER */}
        {activeAdminTab === 'matches' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white">ম্যাচ পরিচালনা ({matches.length})</h2>
              <button
                onClick={handleOpenCreateMatch}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ম্যাচ যোগ করুন</span>
              </button>
            </div>

            <div className="space-y-3">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 p-3 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9.5px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                          {m.category.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{m.map}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-white mt-1 leading-tight">{m.title}</h4>
                      <p className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                        Fee: ৳{m.entryFee} · Win: ৳{m.winPrize} · Kill: ৳{m.perKill}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditMatch(m)}
                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                        title="Edit Match"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteMatch(m.id)}
                        className="p-1.5 rounded-lg bg-red-900/40 hover:bg-red-800/60 text-red-300"
                        title="Delete Match"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/60">
                    <span className="text-[11px] text-slate-400">
                      বুকিং: <strong className="text-white">{m.bookedSlots}/{m.totalSlots}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setRoomModalMatchId(m.id);
                        setRoomIdInput(m.roomId || '');
                        setRoomPassInput(m.roomPassword || '');
                      }}
                      className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[10.5px] font-bold flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>{m.roomId ? 'রুম আপডেট' : 'রুম কোড দিন'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RESULT & WINNER DECLARATION */}
        {activeAdminTab === 'results' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 space-y-4">
            <div>
              <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>ফলাফল ও বিজয়ী ঘোষণা (Auto Distribution)</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ফলাফল প্রকাশ করলে বিজয়ী ও স্কোরবোর্ডের প্লেয়ারদের গেম একাউন্টে সরাসরি ক্যাশ চলে যাবে!
              </p>
            </div>

            {publishFeedback && (
              <div className="p-3 rounded-xl bg-blue-900/50 border border-blue-500/40 text-blue-200 text-xs">
                {publishFeedback}
              </div>
            )}

            <form onSubmit={handlePublishResultsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">
                  ম্যাচ নির্বাচন করুন <span className="text-red-400">*</span>
                </label>
                <select
                  value={selectedResultMatchId}
                  onChange={(e) => {
                    setSelectedResultMatchId(e.target.value);
                    const selected = matches.find((m) => m.id === e.target.value);
                    if (selected) {
                      setWinnerPrize(selected.winPrize);
                      // Pre-fill participants into scoreboard if any
                      if (selected.participants.length > 0) {
                        const newBoard: ScoreboardEntry[] = selected.participants.map((p, idx) => ({
                          rank: idx + 1,
                          playerName: p.userName,
                          ign: p.ffIgn,
                          ffUid: p.ffUid,
                          kills: idx === 0 ? 5 : 2,
                          winningAmount: idx === 0 ? selected.winPrize : 20
                        }));
                        setScoreboardEntries(newBoard);
                        setWinnerName(selected.participants[0]?.userName || '');
                        setWinnerIgn(selected.participants[0]?.ffIgn || '');
                        setWinnerFfUid(selected.participants[0]?.ffUid || '');
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 rounded-xl border border-slate-700 text-white font-medium focus:outline-none"
                  required
                >
                  <option value="">ম্যাচ সিলেক্ট করুন...</option>
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Winner Fields */}
              <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700/80 space-y-2.5">
                <span className="font-bold text-amber-400 uppercase text-[10.5px] block">
                  #1 Booyah Champion (১ম স্থান অধিকারী)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Winner IGN</label>
                    <input
                      type="text"
                      value={winnerIgn}
                      onChange={(e) => setWinnerIgn(e.target.value)}
                      placeholder="LG_CHAMPION"
                      className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Player FF UID</label>
                    <input
                      type="text"
                      value={winnerFfUid}
                      onChange={(e) => setWinnerFfUid(e.target.value)}
                      placeholder="2849102847"
                      className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white font-semibold font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Win Prize Amount (BDT)</label>
                  <input
                    type="number"
                    value={winnerPrize}
                    onChange={(e) => setWinnerPrize(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400 font-extrabold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl font-extrabold text-xs uppercase shadow-md active:scale-[0.98] transition-all"
              >
                ফলাফল প্রকাশ ও ক্যাশ বিতরণ করুন
              </button>
            </form>
          </div>
        )}

        {/* 4. TRANSACTION MANAGER */}
        {activeAdminTab === 'transactions' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white">ট্রানজেকশন তালিকা</h2>
              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['pending', 'deposit', 'withdraw', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTxFilter(filter)}
                    className={`px-2 py-0.5 rounded-lg capitalize ${
                      txFilter === filter ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-800/40 rounded-2xl border border-slate-700/40">
                  কোনো ট্রানজেকশন পেন্ডিং নেই
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase ${
                            tx.type === 'deposit' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {tx.type === 'deposit' ? 'DEPOSIT' : 'WITHDRAW'}
                          </span>
                          <span className="font-bold text-white">{tx.userName}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {tx.userPhone} · {tx.gateway}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-white tabular-nums block">
                          ৳{tx.amount}
                        </span>
                        <span className={`text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-full inline-block ${
                          tx.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : tx.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>

                    {tx.trxId && (
                      <div className="p-1.5 bg-slate-900 rounded-lg text-[10.5px] font-mono text-slate-300 flex items-center justify-between">
                        <span>TrxID: {tx.trxId}</span>
                        <span className="text-slate-400 font-sans">Sender: {tx.senderNumber}</span>
                      </div>
                    )}

                    {tx.withdrawNumber && (
                      <div className="p-1.5 bg-slate-900 rounded-lg text-[10.5px] font-mono text-slate-300">
                        Payout To: {tx.withdrawNumber} ({tx.gateway})
                      </div>
                    )}

                    {/* Pending Action Buttons */}
                    {tx.status === 'pending' && (
                      <div className="flex gap-2 pt-1 border-t border-slate-700/60">
                        <button
                          onClick={() => {
                            if (tx.type === 'deposit') approveDeposit(tx.id);
                            else approveWithdraw(tx.id);
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>অনুমোদন (Approve)</span>
                        </button>

                        <button
                          onClick={() => {
                            if (tx.type === 'deposit') rejectDeposit(tx.id, 'Wrong TrxID');
                            else rejectWithdraw(tx.id, 'Number error / Insufficient details');
                          }}
                          className="flex-1 py-1.5 bg-red-900/60 hover:bg-red-800 text-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>বাতিল (Reject)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* 5. USER MANAGEMENT WITH 3-WAY BALANCE ADJUSTER */}
        {activeAdminTab === 'users' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white">ব্যবহারকারী ব্যবস্থাপনা ({allUsers.length})</h2>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search by name, email, phone, UID..."
                className="w-full pl-9 pr-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2.5">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="p-3 bg-slate-800 rounded-2xl border border-slate-700 text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-xs">{u.displayName}</span>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px]">
                            ADMIN
                          </span>
                        )}
                        {u.isBanned && (
                          <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold text-[9px]">
                            BANNED
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {u.email} · Phone: {u.phone}
                      </p>
                      <p className="text-[10px] font-mono text-blue-300">
                        IGN: {u.ffIgn} · UID: {u.ffUid}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">ডিপোজিট / উইনিং</span>
                      <span className="font-bold text-white tabular-nums">
                        ৳{u.mainBalance} / <span className="text-emerald-400">৳{u.gameBalance}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
                    <button
                      onClick={() => {
                        setAdjustingUserId(u.id);
                        setAdjustAmount(50);
                      }}
                      className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>ব্যালেন্স সমন্বয় (Adjust)</span>
                    </button>

                    <button
                      onClick={() => toggleBanUser(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold ${
                        u.isBanned
                          ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
                          : 'bg-red-900/40 text-red-300 hover:bg-red-800/60'
                      }`}
                    >
                      {u.isBanned ? 'Unban' : 'Ban'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. WEBSITE SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="bg-slate-800/90 rounded-2xl border border-slate-700 p-4 space-y-4">
            <h2 className="font-extrabold text-sm text-white">ওয়েবসাইট ও পেমেন্ট নম্বর সেটিংস</h2>

            {settingsSavedMessage && (
              <div className="p-3 bg-emerald-900/50 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">সাইটের নাম</label>
                <input
                  type="text"
                  value={settingsForm.siteName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">স্ক্রোলিং নোটিশ (Marquee)</label>
                <textarea
                  rows={2}
                  value={settingsForm.marqueeNotice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeNotice: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-700 text-white"
                  required
                />
              </div>

              {/* Payment Gateway Numbers */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                <span className="font-bold text-amber-400 uppercase text-[10px] block">
                  পেমেন্ট গেটওয়ে নম্বরসমূহ (Send Money Personal)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">বিকাশ নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">নগদ নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">রকেট নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.rocketNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, rocketNumber: e.target.value })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">উপায় নম্বর</label>
                    <input
                      type="text"
                      value={settingsForm.upayNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upayNumber: e.target.value })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Limits */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
                <span className="font-bold text-amber-400 uppercase text-[10px] block">
                  আর্থিক লেনদেন সীমা (Financial Limits)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সর্বনিম্ন ডিপোজিট (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.minDeposit}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minDeposit: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সর্বোচ্চ ডিপোজিট (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.maxDeposit}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxDeposit: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সর্বনিম্ন উত্তোলন (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.minWithdraw}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minWithdraw: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">দৈনিক সর্বোচ্চ উত্তোলন (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.maxWithdrawPerDay}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxWithdrawPerDay: Number(e.target.value) })}
                      className="w-full px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs uppercase"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: 3-WAY BALANCE ADJUSTMENT */}
      {adjustingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4">
            <h3 className="font-extrabold text-sm text-white text-center">
              ব্যালেন্স সমন্বয় (3 Distinct Adjustments)
            </h3>

            {/* Target Account */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">একাউন্ট নির্বাচন:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustAccount('main')}
                  className={`py-1.5 rounded-xl text-xs font-bold ${
                    adjustAccount === 'main' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ডিপোজিট ব্যালেন্স (Main)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustAccount('game')}
                  className={`py-1.5 rounded-xl text-xs font-bold ${
                    adjustAccount === 'game' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  উইনিং ব্যালেন্স (Game)
                </button>
              </div>
            </div>

            {/* 3 Distinct Actions: Add (+), Remove (-), or Edit/Set exact */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">অ্যাকশন নির্বাচন:</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAdjustType('add')}
                  className={`py-1.5 rounded-lg ${
                    adjustType === 'add' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ➕ Add (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('remove')}
                  className={`py-1.5 rounded-lg ${
                    adjustType === 'remove' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ➖ Remove (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('set')}
                  className={`py-1.5 rounded-lg ${
                    adjustType === 'set' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  ✏️ Edit (Set)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                টাকার পরিমাণ (BDT)
              </label>
              <input
                type="number"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white text-sm font-bold"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustingUserId(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  await adjustUserBalance(adjustingUserId, {
                    type: adjustType,
                    account: adjustAccount,
                    amount: adjustAmount
                  });
                  setAdjustingUserId(null);
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                সমন্বয় করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MATCH CREATE / EDIT FORM */}
      {isMatchFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveMatch}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs"
          >
            <h3 className="font-extrabold text-sm text-white text-center">
              {editingMatchId ? 'ম্যাচ সম্পাদনা করুন' : 'নতুন টুর্নামেন্ট তৈরি করুন'}
            </h3>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Match Title</label>
              <input
                type="text"
                value={matchTitle}
                onChange={(e) => setMatchTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Category</label>
                <select
                  value={matchCategory}
                  onChange={(e) => setMatchCategory(e.target.value as MatchCategory)}
                  className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white"
                >
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
                  <option value="cs4v4">CS 4v4</option>
                  <option value="lonewolf">Lone Wolf</option>
                  <option value="ludo_free">100% Free</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Map</label>
                <input
                  type="text"
                  value={matchMap}
                  onChange={(e) => setMatchMap(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Entry Fee (BDT)</label>
                <input
                  type="number"
                  value={matchEntryFee}
                  onChange={(e) => setMatchEntryFee(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Per Kill (BDT)</label>
                <input
                  type="number"
                  value={matchPerKill}
                  onChange={(e) => setMatchPerKill(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Win Prize</label>
                <input
                  type="number"
                  value={matchWinPrize}
                  onChange={(e) => setMatchWinPrize(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-emerald-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Total Slots</label>
                <input
                  type="number"
                  value={matchTotalSlots}
                  onChange={(e) => setMatchTotalSlots(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Schedule Time</label>
                <input
                  type="text"
                  value={matchScheduleTime}
                  onChange={(e) => setMatchScheduleTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Rules & Notice</label>
              <textarea
                rows={2}
                value={matchRules}
                onChange={(e) => setMatchRules(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-800 rounded-lg border border-slate-700 text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsMatchFormOpen(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: PUBLISH ROOM ID & PASSWORD */}
      {roomModalMatchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handlePublishRoom}
            className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-3.5 text-xs"
          >
            <h3 className="font-extrabold text-sm text-white text-center">
              কাস্টম রুম আইডি ও পাসওয়ার্ড প্রকাশ
            </h3>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Room ID *</label>
              <input
                type="text"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                placeholder="Ex: 8934201"
                className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Room Password *</label>
              <input
                type="text"
                value={roomPassInput}
                onChange={(e) => setRoomPassInput(e.target.value)}
                placeholder="Ex: 123"
                className="w-full px-3 py-2 bg-slate-800 rounded-xl border border-slate-700 text-white font-mono text-sm font-bold"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRoomModalMatchId(null)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold"
              >
                পাবলিশ করুন
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
