import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  CreditCard, 
  Settings as SettingsIcon, 
  Trophy, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Lock, 
  Key,
  Search, 
  Eye,
  EyeOff,
  Mail,
  CheckCircle2,
  Sliders,
  ExternalLink,
  LogOut,
  Ban,
  Slash,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TournamentMatch, ScoreboardEntry, MatchCategory } from '../types';

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

  // Navigation tab based on 6-grid tiles
  type AdminTab = 'tournaments' | 'players' | 'payments' | 'room' | 'results' | 'settings';
  const [activeTile, setActiveTile] = useState<AdminTab>('tournaments');

  // Tournament list search & filter
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [tournamentFilter, setTournamentFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  // Match Create/Edit Form
  const [isMatchFormOpen, setIsMatchFormOpen] = useState(false);
  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [matchTitle, setMatchTitle] = useState('');
  const [matchCategory, setMatchCategory] = useState<MatchCategory>('cs4v4');
  const [matchMap, setMatchMap] = useState('Bermuda');
  const [matchType, setMatchType] = useState<'SOLO' | 'DUO' | 'SQUAD' | '4v4'>('4v4');
  const [matchVersion, setMatchVersion] = useState<'TPP' | 'FPP'>('TPP');
  const [matchEntryFee, setMatchEntryFee] = useState<number>(30);
  const [matchPerKill, setMatchPerKill] = useState<number>(10);
  const [matchWinPrize, setMatchWinPrize] = useState<number>(100);
  const [matchTotalPrize, setMatchTotalPrize] = useState<number>(100);
  const [matchTotalSlots, setMatchTotalSlots] = useState<number>(8);
  const [matchScheduleTime, setMatchScheduleTime] = useState('Today at 03:40 PM');
  const [matchRules, setMatchRules] = useState('1. No emulators allowed.\n2. Level 35+ ID required.\n3. Teaming up will result in a permanent ban.');
  const [matchBanner, setMatchBanner] = useState('/assets/images/ff_alok_solo_1793678913693.jpg');

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
  const [showUserPasswords, setShowUserPasswords] = useState<Record<string, boolean>>({});
  const [adjustingUserId, setAdjustingUserId] = useState<string | null>(null);
  const [adjustType, setAdjustType] = useState<'add' | 'remove' | 'set'>('add');
  const [adjustAccount, setAdjustAccount] = useState<'main' | 'game'>('main');
  const [adjustAmount, setAdjustAmount] = useState<number>(50);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  React.useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // Transactions Filter
  const [txFilter, setTxFilter] = useState<'all' | 'pending' | 'deposit' | 'withdraw'>('pending');

  // Password Authentication State
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_session_auth') === 'true') {
      return true;
    }
    return currentUser?.role === 'admin' && (currentUser?.email === 'esakhan5479@gmail.com' || currentUser?.email === 'markjuckerbark4@gmail.com');
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordInput.trim() === 'ESA006##@@') {
      sessionStorage.setItem('admin_session_auth', 'true');
      quickDemoLogin('admin');
      setIsAdminAuthenticated(true);
      setAdminAuthError('');
    } else {
      setAdminAuthError('ভুল পাসওয়ার্ড! সঠিক এডমিন পাসওয়ার্ড লিখুন।');
    }
  };

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem('admin_session_auth');
    setIsAdminAuthenticated(false);
    setAdminPasswordInput('');
  };

  const handleExitAdmin = () => {
    setIsAdminRoute(false);
    window.history.pushState({}, '', '/');
  };

  const handleOpenCreateMatch = () => {
    setEditingMatchId(null);
    setMatchTitle(`CS 4V4`);
    setMatchCategory('cs4v4');
    setMatchMap('Bermuda');
    setMatchType('4v4');
    setMatchVersion('TPP');
    setMatchEntryFee(30);
    setMatchPerKill(10);
    setMatchWinPrize(100);
    setMatchTotalPrize(100);
    setMatchTotalSlots(8);
    setMatchScheduleTime('Today at 03:40 PM');
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

  const handleCancelMatch = async (matchId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই টুর্নামেন্টটি বাতিল (Cancel) করতে চান?')) {
      await updateMatch(matchId, { status: 'cancelled' });
    }
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

  // Filtered Tournaments
  const filteredMatches = matches.filter((m) => {
    const q = tournamentSearch.toLowerCase().trim();
    const matchesQuery = 
      !q || 
      m.title.toLowerCase().includes(q) || 
      m.category.toLowerCase().includes(q) || 
      m.map.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q);

    if (!matchesQuery) return false;
    if (tournamentFilter === 'upcoming') return m.status === 'upcoming';
    if (tournamentFilter === 'ongoing') return m.status === 'ongoing';
    if (tournamentFilter === 'completed') return m.status === 'completed';
    return true;
  });

  const pendingTransactionsCount = transactions.filter((t) => t.status === 'pending').length;

  const filteredTransactions = transactions.filter((t) => {
    if (txFilter === 'pending') return t.status === 'pending';
    if (txFilter === 'deposit') return t.type === 'deposit';
    if (txFilter === 'withdraw') return t.type === 'withdraw';
    return true;
  });

  const filteredUsers = allUsers.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    return (
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.ffUid.includes(q) ||
      u.ffIgn.toLowerCase().includes(q)
    );
  });

  // Dedicated Password Gate (Single Password option ESA006##@@)
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050a17] text-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#091122] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Shield className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h2 className="font-extrabold text-base text-white tracking-tight uppercase">
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
                  className="w-full pl-3.5 pr-10 py-3 bg-[#0d162a] rounded-xl border border-slate-700 text-white font-mono text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                  tabIndex={-1}
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl font-black text-xs uppercase shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all"
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
    <div className="min-h-screen bg-[#050a17] text-slate-100 flex flex-col max-w-md mx-auto relative pb-16 font-sans">
      {/* 1. TOP HEADER (Exact Screenshot Layout) */}
      <div className="sticky top-0 z-30 bg-[#060b17]/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Orange/Amber Shield Squircle */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-md shadow-amber-500/20 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#091122] rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-amber-400 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-extrabold text-[12.5px] tracking-tight text-white uppercase leading-none">
                  LG LEADER BD ADMIN PANEL
                </h1>
                <span className="bg-red-950/90 border border-red-800/80 text-red-400 font-mono text-[9px] px-1 py-0.2 rounded font-bold">
                  /admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                মাস্টার টুর্নামেন্ট ও ওয়েবসাইট নিয়ন্ত্রণ কেন্দ্র
              </p>
            </div>
          </div>

          {/* Right Top Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Sky Blue Website Button */}
            <button
              onClick={handleExitAdmin}
              className="px-2.5 py-1.5 bg-[#0088ff] hover:bg-sky-500 text-white rounded-xl text-[11px] font-extrabold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
              title="ওয়েবসাইটে যান"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>ওয়েবসাইট</span>
            </button>
            
            {/* Dark Red Logout Button */}
            <button
              onClick={handleLogoutAdmin}
              className="px-2 py-1.5 bg-[#2a0e14] hover:bg-red-950 text-red-400 border border-red-900/60 rounded-xl text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all"
              title="লগআউট"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-4 flex-1">
        {/* 2. TOP 6-TILE CONTROL GRID (2 cols x 3 rows) */}
        <div className="bg-[#091122] border border-slate-800/80 rounded-3xl p-3 shadow-xl">
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'tournaments', label: 'Tournament Control', icon: Trophy },
              { 
                id: 'players', 
                label: 'User Management', 
                icon: Users,
                badge: allUsers.length > 0 ? allUsers.length : undefined
              },
              { 
                id: 'payments', 
                label: 'bKash/Nagad Payment', 
                icon: CreditCard,
                badge: pendingTransactionsCount > 0 ? pendingTransactionsCount : undefined 
              },
              { id: 'room', label: 'Room ID ও Pass', icon: Key },
              { id: 'results', label: 'Result Management', icon: Trophy },
              { id: 'settings', label: 'Website Settings', icon: SettingsIcon },
            ].map((tile) => {
              const Icon = tile.icon;
              const isActive = activeTile === tile.id;
              return (
                <button
                  key={tile.id}
                  onClick={() => setActiveTile(tile.id as AdminTab)}
                  className={`relative rounded-2xl py-3 px-2 flex flex-col items-center justify-center gap-1.5 text-xs transition-all active:scale-[0.98] ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-1 ring-amber-400'
                      : 'bg-[#0c162d]/60 hover:bg-[#0c162d] text-slate-400 hover:text-slate-200 border border-slate-800/70 font-semibold'
                  }`}
                >
                  {tile.badge && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[9px] font-black animate-pulse shadow-md">
                      {tile.badge}
                    </span>
                  )}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400'}`} />
                  <span className="text-[11px] leading-tight text-center">{tile.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. TILE CONTENT VIEW */}

        {/* --- TILE 1: TOURNAMENT CONTROL (Matches Screenshot) --- */}
        {activeTile === 'tournaments' && (
          <div className="space-y-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
                placeholder="টুর্নামেন্টের নাম বা ক্যাটাগরি সার্চ করুন..."
                className="w-full pl-10 pr-4 py-3 bg-[#091122] rounded-2xl border border-slate-800/90 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500/80"
              />
            </div>

            {/* Big Yellow/Orange CTA Button */}
            <button
              onClick={handleOpenCreateMatch}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>নতুন টুর্নামেন্ট তৈরি করুন</span>
            </button>

            {/* Filter Pills Tab Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800/70 pb-2.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'সব টুর্নামেন্ট' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'ongoing', label: 'Ongoing' },
                { id: 'completed', label: 'Completed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTournamentFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                    tournamentFilter === f.id
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 font-semibold'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Match Cards List */}
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <div className="py-10 text-center bg-[#091122] rounded-2xl border border-slate-800/80 p-5 space-y-2">
                  <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 font-medium">কোনো টুর্নামেন্ট পাওয়া যায়নি</p>
                  <p className="text-[11px] text-slate-500">
                    উপরের <strong className="text-amber-400">"+ নতুন টুর্নামেন্ট তৈরি করুন"</strong> বাটনে ক্লিক করে নতুন টুর্নামেন্ট যোগ করুন।
                  </p>
                </div>
              ) : (
                filteredMatches.map((m) => {
                  const matchNumber = m.id.replace('match_', '').replace(/[^0-9]/g, '') || '101';
                  const isUpcoming = m.status === 'upcoming';
                  const isOngoing = m.status === 'ongoing';
                  const isCancelled = m.status === 'cancelled';

                  return (
                    <div
                      key={m.id}
                      className="bg-[#091122] border border-slate-800/90 rounded-2xl p-3.5 space-y-2.5 shadow-md"
                    >
                      {/* Top Badges Row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                            {m.category === 'cs4v4' ? 'CS 4 VS 4' : m.category.toUpperCase()}
                          </span>
                          <span className="text-slate-300 font-bold text-xs font-mono">
                            Match #{matchNumber}
                          </span>
                        </div>

                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          isCancelled
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : isOngoing
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : m.status === 'completed'
                            ? 'bg-slate-700/40 text-slate-400 border border-slate-600'
                            : 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-extrabold text-sm text-white">
                        {m.title}
                      </h3>

                      {/* Details Row 1 */}
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span>
                          সময়: <strong className="text-slate-200">{m.scheduleTime}</strong>
                        </span>
                        <span>
                          ম্যাপ: <strong className="text-slate-200">{m.map}</strong>
                        </span>
                        <span>
                          এন্ট্রি ফি: <strong className="text-amber-400 font-bold">৳{m.entryFee}</strong>
                        </span>
                      </div>

                      {/* Stats Row 2 */}
                      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                        <span>
                          টোটাল প্রাইজ: <strong className="text-sky-400 font-bold">৳{m.totalPrize || m.winPrize}</strong>
                        </span>
                        <span>
                          স্লট বুকিং: <strong className="text-white font-bold">{m.bookedSlots}/{m.totalSlots}</strong>
                        </span>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-2 pt-1.5 border-t border-slate-800/80">
                        {/* Edit Button (Sky Blue) */}
                        <button
                          onClick={() => handleOpenEditMatch(m)}
                          className="flex-1 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Room Credentials Shortcut */}
                        {(isUpcoming || isOngoing) && (
                          <button
                            onClick={() => {
                              setRoomModalMatchId(m.id);
                              setRoomIdInput(m.roomId || '');
                              setRoomPassInput(m.roomPassword || '');
                            }}
                            className="px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center gap-1"
                            title="রুম আইডি ও পাসওয়ার্ড"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>Room</span>
                          </button>
                        )}

                        {/* Cancel Button (Dark Red) */}
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancelMatch(m.id)}
                            className="flex-1 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-400 border border-red-800/60 rounded-xl font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                          >
                            <Slash className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}

                        {/* Trash Button */}
                        <button
                          onClick={() => {
                            if (window.confirm('টুর্নামেন্টটি পার্মানেন্টলি ডিলিট করতে চান?')) {
                              deleteMatch(m.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700/80 transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* --- TILE 2: USER MANAGEMENT --- */}
        {activeTile === 'players' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-sm text-white">ইউজার ম্যানেজমেন্ট (User Management)</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  মোট নিবন্ধিত অ্যাকাউন্ট: <strong className="text-amber-400 font-mono font-bold">{allUsers.length} জন</strong> (নতুন তৈরি হওয়া সব ডাটা এখানে সেভ থাকে)
                </p>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="জিমেইল, নাম, ফোন নম্বর বা FF UID দিয়ে সার্চ করুন..."
                className="w-full pl-10 pr-4 py-3 bg-[#091122] rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-2.5">
              {filteredUsers.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-[#091122] rounded-2xl border border-slate-800">
                  কোনো ইউজার পাওয়া যায়নি
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-3.5 bg-[#091122] rounded-2xl border border-slate-800 text-xs space-y-2.5 shadow-md"
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-black text-white text-xs">{u.displayName}</span>
                          {u.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold text-[9px] border border-amber-500/30">
                              ADMIN
                            </span>
                          )}
                          {u.isBanned ? (
                            <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold text-[9px] border border-red-500/30">
                              BANNED
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[9px]">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Email / Gmail address */}
                        <div className="flex items-center gap-1 text-[11px] text-sky-400 font-mono mt-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span className="font-semibold break-all">{u.email}</span>
                        </div>

                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Phone: <strong className="text-slate-300 font-mono">{u.phone}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          IGN: <span className="text-white font-bold">{u.ffIgn}</span> · UID: <span className="text-amber-400 font-bold">{u.ffUid}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-medium">মেইন / গেম ব্যালেন্স</span>
                        <span className="font-extrabold text-white text-xs tabular-nums">
                          ৳{u.mainBalance} / <span className="text-emerald-400">৳{u.gameBalance}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          রেফার কোড: <strong className="text-slate-300 font-mono">{u.referralCode}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Password Row with Show/Hide toggle */}
                    <div className="flex items-center justify-between bg-[#060c18] border border-slate-800/90 rounded-xl px-2.5 py-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-slate-400 text-[10px] font-bold">পাসওয়ার্ড:</span>
                        <span className="font-mono font-black text-amber-300 text-xs">
                          {showUserPasswords[u.id] ? (u.password || 'পাসওয়ার্ড সেট নেই') : '••••••••'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowUserPasswords((prev) => ({ ...prev, [u.id]: !prev[u.id] }))}
                        className="text-[10px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-lg active:scale-95 transition-all"
                      >
                        {showUserPasswords[u.id] ? (
                          <>
                            <EyeOff className="w-3 h-3 text-red-400" />
                            <span>লুকান</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 text-sky-400" />
                            <span>দেখুন</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Registration Date */}
                    {u.createdAt && (
                      <div className="text-[9.5px] text-slate-400 flex items-center justify-between">
                        <span>নিবন্ধনের তারিখ:</span>
                        <span className="text-slate-400 font-mono">
                          {new Date(u.createdAt).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => {
                          setAdjustingUserId(u.id);
                          setAdjustAmount(50);
                        }}
                        className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>ব্যালেন্স সমন্বয় (Adjust)</span>
                      </button>

                      <button
                        onClick={() => toggleBanUser(u.id)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-all ${
                          u.isBanned
                            ? 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-700/50'
                            : 'bg-red-900/40 text-red-300 hover:bg-red-800/60 border border-red-700/50'
                        }`}
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>{u.isBanned ? 'Unban' : 'Ban'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* --- TILE 3: BKASH/NAGAD PAYMENT --- */}
        {activeTile === 'payments' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-white">পেমেন্ট রিকুয়েস্টসমূহ</h2>
              {/* Filter Pills */}
              <div className="flex items-center gap-1 text-[11px] bg-[#0c162d] p-1 rounded-xl border border-slate-800">
                {(['pending', 'deposit', 'withdraw', 'all'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTxFilter(filter)}
                    className={`px-2 py-0.5 rounded-lg capitalize ${
                      txFilter === filter ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filteredTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-[#091122] rounded-2xl border border-slate-800">
                  কোনো ট্রানজেকশন পেন্ডিং নেই
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-[#091122] rounded-2xl border border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-extrabold uppercase ${
                            tx.type === 'deposit' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {tx.type === 'deposit' ? 'DEPOSIT' : 'WITHDRAW'}
                          </span>
                          <span className="font-bold text-white">{tx.userName}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {tx.userPhone} · {tx.gateway.toUpperCase()}
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
                      <div className="p-2 bg-[#0c162d] rounded-xl text-[10.5px] font-mono text-slate-300 flex items-center justify-between border border-slate-800/60">
                        <span>TrxID: <strong className="text-amber-400">{tx.trxId}</strong></span>
                        <span className="text-slate-400 font-sans">Sender: {tx.senderNumber}</span>
                      </div>
                    )}

                    {tx.withdrawNumber && (
                      <div className="p-2 bg-[#0c162d] rounded-xl text-[10.5px] font-mono text-slate-300 border border-slate-800/60">
                        Payout To: <strong className="text-emerald-400">{tx.withdrawNumber}</strong> ({tx.gateway})
                      </div>
                    )}

                    {/* Pending Action Buttons */}
                    {tx.status === 'pending' && (
                      <div className="flex gap-2 pt-1 border-t border-slate-800/80">
                        <button
                          onClick={() => {
                            if (tx.type === 'deposit') approveDeposit(tx.id);
                            else approveWithdraw(tx.id);
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>অনুমোদন (Approve)</span>
                        </button>

                        <button
                          onClick={() => {
                            if (tx.type === 'deposit') rejectDeposit(tx.id, 'Wrong TrxID');
                            else rejectWithdraw(tx.id, 'Number error / Insufficient details');
                          }}
                          className="flex-1 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
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

        {/* --- TILE 4: ROOM ID ও PASS --- */}
        {activeTile === 'room' && (
          <div className="space-y-3.5">
            <div>
              <h2 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>কাস্টম রুম আইডি ও পাসওয়ার্ড প্রকাশ কেন্দ্র</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ম্যাচ শুরুর আগে প্লেয়ারদের জন্য রুম আইডি ও পাসওয়ার্ড দিন।
              </p>
            </div>

            <div className="space-y-3">
              {matches.filter(m => m.status === 'upcoming' || m.status === 'ongoing').length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-[#091122] rounded-2xl border border-slate-800">
                  বর্তমানে কোনো আসন্ন বা চলমান ম্যাচ নেই
                </div>
              ) : (
                matches
                  .filter(m => m.status === 'upcoming' || m.status === 'ongoing')
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-3.5 bg-[#091122] rounded-2xl border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-extrabold text-white text-xs">{m.title}</h4>
                          <span className="text-[10px] text-slate-400">{m.scheduleTime} · {m.map}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold uppercase ${
                          m.roomId ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {m.roomId ? 'রুম প্রকাশিত' : 'রুম পেন্ডিং'}
                        </span>
                      </div>

                      {m.roomId ? (
                        <div className="p-2.5 bg-[#0c162d] rounded-xl border border-slate-800 font-mono text-xs flex items-center justify-between">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Room ID:</span>
                            <span className="text-amber-400 font-black text-sm">{m.roomId}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Password:</span>
                            <span className="text-sky-400 font-black text-sm">{m.roomPassword}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic">এখনো রুম তথ্য দেওয়া হয়নি</p>
                      )}

                      <button
                        onClick={() => {
                          setRoomModalMatchId(m.id);
                          setRoomIdInput(m.roomId || '');
                          setRoomPassInput(m.roomPassword || '');
                        }}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>{m.roomId ? 'রুম তথ্য আপডেট করুন' : 'রুম আইডি ও পাসওয়ার্ড দিন'}</span>
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* --- TILE 5: RESULT MANAGEMENT --- */}
        {activeTile === 'results' && (
          <div className="bg-[#091122] rounded-2xl border border-slate-800 p-4 space-y-4">
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
              <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-200 text-xs">
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
                      if (selected.participants && selected.participants.length > 0) {
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
                  className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-white font-medium focus:outline-none"
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
              <div className="p-3 bg-[#0c162d] rounded-xl border border-slate-800 space-y-2.5">
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
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white font-semibold"
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
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white font-semibold font-mono"
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
                    className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-emerald-400 font-extrabold"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 rounded-xl font-black text-xs uppercase shadow-md active:scale-[0.98] transition-all"
              >
                ফলাফল প্রকাশ ও ক্যাশ বিতরণ করুন
              </button>
            </form>
          </div>
        )}

        {/* --- TILE 6: WEBSITE SETTINGS --- */}
        {activeTile === 'settings' && (
          <div className="bg-[#091122] rounded-2xl border border-slate-800 p-4 space-y-4">
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
                  className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-white"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">স্ক্রোলিং নোটিশ (Marquee)</label>
                <textarea
                  rows={2}
                  value={settingsForm.marqueeNotice}
                  onChange={(e) => setSettingsForm({ ...settingsForm, marqueeNotice: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-white"
                  required
                />
              </div>

              {/* Payment Gateway Numbers */}
              <div className="p-3 bg-[#0c162d] rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 uppercase text-[10px] block">
                  পেমেন্ট গেটওয়ে নম্বরসমূহ (Send Money Personal)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">বিকাশ পার্সোনাল নম্বর (bKash)</label>
                    <input
                      type="text"
                      value={settingsForm.bkashNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, bkashNumber: e.target.value })}
                      className="w-full px-2.5 py-2 bg-[#091122] rounded-lg border border-slate-700 text-white font-mono text-xs"
                      placeholder="01878-901234"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">নগদ পার্সোনাল নম্বর (Nagad)</label>
                    <input
                      type="text"
                      value={settingsForm.nagadNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, nagadNumber: e.target.value })}
                      className="w-full px-2.5 py-2 bg-[#091122] rounded-lg border border-slate-700 text-white font-mono text-xs"
                      placeholder="01789-012345"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Limits */}
              <div className="p-3 bg-[#0c162d] rounded-xl border border-slate-800 space-y-2">
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
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সর্বোচ্চ ডিপোজিট (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.maxDeposit}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxDeposit: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">সর্বনিম্ন উত্তোলন (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.minWithdraw}
                      onChange={(e) => setSettingsForm({ ...settingsForm, minWithdraw: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">দৈনিক সর্বোচ্চ উত্তোলন (BDT)</label>
                    <input
                      type="number"
                      value={settingsForm.maxWithdrawPerDay}
                      onChange={(e) => setSettingsForm({ ...settingsForm, maxWithdrawPerDay: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-[#091122] rounded-lg border border-slate-700 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-black text-xs uppercase shadow-md"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </form>
          </div>
        )}
      </div>

      {/* --- MODAL 1: 3-WAY BALANCE ADJUSTMENT --- */}
      {adjustingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#091122] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
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
                    adjustAccount === 'main' ? 'bg-sky-500 text-white' : 'bg-[#0c162d] text-slate-400'
                  }`}
                >
                  ডিপোজিট ব্যালেন্স (Main)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustAccount('game')}
                  className={`py-1.5 rounded-xl text-xs font-bold ${
                    adjustAccount === 'game' ? 'bg-emerald-600 text-white' : 'bg-[#0c162d] text-slate-400'
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
                    adjustType === 'add' ? 'bg-emerald-600 text-white' : 'bg-[#0c162d] text-slate-400'
                  }`}
                >
                  ➕ Add (+)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('remove')}
                  className={`py-1.5 rounded-lg ${
                    adjustType === 'remove' ? 'bg-amber-600 text-white' : 'bg-[#0c162d] text-slate-400'
                  }`}
                >
                  ➖ Remove (-)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustType('set')}
                  className={`py-1.5 rounded-lg ${
                    adjustType === 'set' ? 'bg-sky-500 text-white' : 'bg-[#0c162d] text-slate-400'
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
                className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-white text-sm font-bold"
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
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md"
              >
                সমন্বয় করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: MATCH CREATE / EDIT FORM --- */}
      {isMatchFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveMatch}
            className="w-full max-w-sm bg-[#091122] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto text-xs"
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
                className="w-full px-2.5 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white font-bold"
                placeholder="Ex: CS 4V4 or BERMUDA SOLO"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Category</label>
                <select
                  value={matchCategory}
                  onChange={(e) => setMatchCategory(e.target.value as MatchCategory)}
                  className="w-full px-2 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white font-bold"
                >
                  <option value="cs4v4">CS 4v4</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
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
                  className="w-full px-2.5 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white"
                  placeholder="Bermuda / Kalahari / Purgatory"
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
                  className="w-full px-2 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Per Kill (BDT)</label>
                <input
                  type="number"
                  value={matchPerKill}
                  onChange={(e) => setMatchPerKill(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Win Prize</label>
                <input
                  type="number"
                  value={matchWinPrize}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMatchWinPrize(val);
                    setMatchTotalPrize(val);
                  }}
                  className="w-full px-2 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-emerald-400 font-bold"
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
                  className="w-full px-2.5 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Schedule Time</label>
                <input
                  type="text"
                  value={matchScheduleTime}
                  onChange={(e) => setMatchScheduleTime(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white"
                  placeholder="Today at 03:40 PM"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Rules & Notice</label>
              <textarea
                rows={2}
                value={matchRules}
                onChange={(e) => setMatchRules(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#0c162d] rounded-lg border border-slate-700 text-white"
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
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-black shadow-md"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- MODAL 3: PUBLISH ROOM ID & PASSWORD --- */}
      {roomModalMatchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handlePublishRoom}
            className="w-full max-w-sm bg-[#091122] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3.5 text-xs"
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
                className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-amber-400 font-mono text-sm font-bold"
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
                className="w-full px-3 py-2 bg-[#0c162d] rounded-xl border border-slate-700 text-sky-400 font-mono text-sm font-bold"
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
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl font-black shadow-md"
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
