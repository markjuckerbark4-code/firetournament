import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  UserProfile, 
  TournamentMatch, 
  MatchResult, 
  Transaction, 
  AppSettings, 
  ActiveTab, 
  GatewayType,
  Participant,
  ScoreboardEntry
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_ADMIN_USER, 
  INITIAL_MATCHES, 
  INITIAL_RESULTS, 
  INITIAL_TRANSACTIONS 
} from '../data/initialData';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc 
} from 'firebase/firestore';
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth';

interface AppContextType {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  matches: TournamentMatch[];
  results: MatchResult[];
  transactions: Transaction[];
  settings: AppSettings;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isAdmin: boolean;
  isAdminRoute: boolean;
  setIsAdminRoute: (val: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  
  // Modals & UI States
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (val: boolean) => void;
  authModalMode: 'signin' | 'signup';
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (val: boolean) => void;
  walletDefaultTab: 'deposit' | 'withdraw' | 'history';
  setWalletDefaultTab: (tab: 'deposit' | 'withdraw' | 'history') => void;
  selectedMatchForJoin: TournamentMatch | null;
  setSelectedMatchForJoin: (match: TournamentMatch | null) => void;
  
  // Actions
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: { name: string; email: string; phone: string; ffUid: string; pass: string; referralCode?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickDemoLogin: (role: 'user' | 'admin') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Wallet
  submitDeposit: (params: { gateway: GatewayType; amount: number; senderNumber: string; trxId: string }) => Promise<{ success: boolean; message: string }>;
  submitWithdraw: (params: { gateway: GatewayType; amount: number; withdrawNumber: string }) => Promise<{ success: boolean; message: string }>;
  
  // Match
  joinMatch: (matchId: string, details: { ign: string; ffUid: string; slotNumber: number }) => Promise<{ success: boolean; message: string }>;
  
  // Admin Operations
  createMatch: (match: Omit<TournamentMatch, 'id' | 'createdAt' | 'bookedSlots' | 'participants'>) => Promise<void>;
  updateMatch: (matchId: string, updates: Partial<TournamentMatch>) => Promise<void>;
  deleteMatch: (matchId: string) => Promise<void>;
  publishRoomDetails: (matchId: string, roomId: string, pass: string) => Promise<void>;
  publishResults: (params: {
    matchId: string;
    winnerName: string;
    winnerIgn: string;
    winnerFfUid: string;
    winnerPrize: number;
    scoreboard: ScoreboardEntry[];
  }) => Promise<{ success: boolean; message: string }>;
  approveDeposit: (txId: string) => Promise<void>;
  rejectDeposit: (txId: string, reason?: string) => Promise<void>;
  approveWithdraw: (txId: string) => Promise<void>;
  rejectWithdraw: (txId: string, reason?: string) => Promise<void>;
  adjustUserBalance: (userId: string, params: { type: 'add' | 'remove' | 'set'; account: 'main' | 'game'; amount: number }) => Promise<void>;
  toggleBanUser: (userId: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'lg_user_profile',
  ALL_USERS: 'lg_all_users',
  MATCHES: 'lg_matches',
  RESULTS: 'lg_results',
  TRANSACTIONS: 'lg_transactions',
  SETTINGS: 'lg_settings',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation states
  const [activeTab, setActiveTab] = useState<ActiveTab>('play');
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    return window.location.pathname === '/admin' || window.location.hash === '#admin';
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletDefaultTab, setWalletDefaultTab] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [selectedMatchForJoin, setSelectedMatchForJoin] = useState<TournamentMatch | null>(null);

  // Primary state loaded from LocalStorage or Default initial data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed.email === 'demo@lgleader.com') {
        localStorage.removeItem(STORAGE_KEYS.USER);
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (!saved) return [INITIAL_ADMIN_USER];
    try {
      const parsed = JSON.parse(saved) as UserProfile[];
      return parsed.filter(u => u.email !== 'demo@lgleader.com');
    } catch {
      return [INITIAL_ADMIN_USER];
    }
  });

  const [matches, setMatches] = useState<TournamentMatch[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as TournamentMatch[];
      // Purge any stale initial hardcoded matches
      return parsed.filter(m => !m.id.startsWith('match_ff_10'));
    } catch {
      return [];
    }
  });

  const [results, setResults] = useState<MatchResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as MatchResult[];
      return parsed.filter(r => !r.id.startsWith('result_9'));
    } catch {
      return [];
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved) as Transaction[];
      return parsed.filter(t => !t.id.startsWith('tx_10'));
    } catch {
      return [];
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Cross-tab real-time sync with BroadcastChannel
  useEffect(() => {
    const channel = new BroadcastChannel('lg_leader_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_ALL') {
        if (payload.matches !== undefined) setMatches(payload.matches);
        if (payload.results !== undefined) setResults(payload.results);
        if (payload.transactions !== undefined) setTransactions(payload.transactions);
        if (payload.settings) setSettings(payload.settings);
        if (payload.allUsers) setAllUsers(payload.allUsers);
        if (payload.currentUser !== undefined) setCurrentUser(payload.currentUser);
      }
    };
    return () => channel.close();
  }, []);

  const broadcastSync = (data: Record<string, unknown>) => {
    try {
      const channel = new BroadcastChannel('lg_leader_sync');
      channel.postMessage({ type: 'SYNC_ALL', payload: data });
      channel.close();
    } catch {
      // ignore
    }
  };

  // Sync state to local storage whenever changed
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Firestore real-time snapshot listeners - ALWAYS sync full state even when empty
  useEffect(() => {
    // 1. Matches Snapshot Listener
    const unsubMatches = onSnapshot(
      collection(db, 'matches'),
      (snapshot) => {
        const list: TournamentMatch[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<TournamentMatch, 'id'>) });
        });
        setMatches(list);
        localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(list));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'matches');
      }
    );

    // 2. Results Snapshot Listener
    const unsubResults = onSnapshot(
      collection(db, 'results'),
      (snapshot) => {
        const list: MatchResult[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<MatchResult, 'id'>) });
        });
        setResults(list);
        localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(list));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'results');
      }
    );

    // 3. Transactions Snapshot Listener
    const unsubTx = onSnapshot(
      collection(db, 'transactions'),
      (snapshot) => {
        const list: Transaction[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<Transaction, 'id'>) });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(list);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(list));
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'transactions');
      }
    );

    // 4. Settings Snapshot Listener
    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings(docSnap.data() as AppSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'settings/general');
      }
    );

    // 5. Auth State Changed
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        // Find existing user in allUsers or create
        setAllUsers((prev) => {
          let existing = prev.find((u) => u.email === user.email);
          if (!existing) {
            existing = {
              id: user.uid,
              email: user.email!,
              displayName: user.displayName || user.email!.split('@')[0],
              phone: '01700000000',
              ffUid: '123456789',
              ffIgn: 'LG_PLAYER',
              mainBalance: 100,
              gameBalance: 50,
              referralCode: `LGBD${Math.floor(1000 + Math.random() * 9000)}`,
              matchesJoined: 0,
              totalWon: 0,
              isBanned: false,
              role: user.email === 'markjuckerbark4@gmail.com' ? 'admin' : 'user',
              createdAt: new Date().toISOString()
            };
            return [...prev, existing];
          }
          return prev;
        });
      }
    });

    return () => {
      unsubMatches();
      unsubResults();
      unsubTx();
      unsubSettings();
      unsubAuth();
    };
  }, []);

  const isAdmin = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.email === 'markjuckerbark4@gmail.com';
  }, [currentUser]);

  // Auth Operations
  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const trimmed = email.trim().toLowerCase();
    const found = allUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (!found) {
      return { success: false, error: 'User with this email not found. Please Sign Up.' };
    }
    if (found.isBanned) {
      return { success: false, error: 'Your account has been banned due to policy violation. Contact support.' };
    }
    setCurrentUser(found);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const quickDemoLogin = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser(INITIAL_ADMIN_USER);
      setAllUsers((prev) => prev.some((u) => u.id === INITIAL_ADMIN_USER.id) ? prev : [...prev, INITIAL_ADMIN_USER]);
    }
    setIsAuthModalOpen(false);
  };

  const signUp = async (params: {
    name: string;
    email: string;
    phone: string;
    ffUid: string;
    pass: string;
    referralCode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const trimmed = params.email.trim().toLowerCase();
    const existing = allUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please Sign In.' };
    }

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: trimmed,
      displayName: params.name.trim(),
      phone: params.phone.trim(),
      ffUid: params.ffUid.trim(),
      ffIgn: params.name.trim(),
      mainBalance: 50, // Welcome bonus of 50 BDT
      gameBalance: 0,
      referralCode: `LGBD${Math.floor(1000 + Math.random() * 9000)}`,
      referredBy: params.referralCode?.trim() || undefined,
      matchesJoined: 0,
      totalWon: 0,
      isBanned: false,
      role: trimmed === 'markjuckerbark4@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString()
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    } catch {
      // offline fallback
    }

    return { success: true };
  };

  const logout = () => {
    fbSignOut(auth).catch(() => {});
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));

    try {
      await updateDoc(doc(db, 'users', currentUser.id), updates);
    } catch {
      // fallback
    }
  };

  // Dual-Wallet Operations: Deposit
  const submitDeposit = async (params: {
    gateway: GatewayType;
    amount: number;
    senderNumber: string;
    trxId: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please login to submit deposit.' };
    }

    if (params.amount < settings.minDeposit) {
      return { success: false, message: `Minimum deposit amount is ৳${settings.minDeposit}.` };
    }

    if (params.amount > settings.maxDeposit) {
      return { success: false, message: `Maximum deposit amount is ৳${settings.maxDeposit}.` };
    }

    const newTx: Transaction = {
      id: `dep_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      userPhone: currentUser.phone,
      type: 'deposit',
      gateway: params.gateway,
      amount: params.amount,
      senderNumber: params.senderNumber.trim(),
      trxId: params.trxId.trim().toUpperCase(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);
    broadcastSync({ transactions: [newTx, ...transactions] });

    // Save to Firestore
    try {
      await setDoc(doc(db, 'transactions', newTx.id), newTx);
    } catch {
      // offline fallback
    }

    return { 
      success: true, 
      message: 'Deposit request submitted successfully! Admin will review within 5-15 minutes.' 
    };
  };

  // Dual-Wallet Operations: Withdrawal
  const submitWithdraw = async (params: {
    gateway: GatewayType;
    amount: number;
    withdrawNumber: string;
  }): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please login to withdraw.' };
    }

    const totalAvailable = currentUser.mainBalance + currentUser.gameBalance;

    if (params.amount < settings.minWithdraw) {
      return { success: false, message: `Minimum withdrawal amount is ৳${settings.minWithdraw}.` };
    }

    if (params.amount > totalAvailable) {
      return { success: false, message: `Insufficient balance! Your available balance is ৳${totalAvailable}.` };
    }

    // Check daily withdrawal limit
    const today = new Date().toDateString();
    const userTodayWithdrawals = transactions
      .filter((t) => t.userId === currentUser.id && t.type === 'withdraw' && new Date(t.createdAt).toDateString() === today)
      .reduce((acc, t) => acc + t.amount, 0);

    if (userTodayWithdrawals + params.amount > settings.maxWithdrawPerDay) {
      const remainingLimit = Math.max(0, settings.maxWithdrawPerDay - userTodayWithdrawals);
      return { 
        success: false, 
        message: `Daily limit reached! You can withdraw at most ৳${remainingLimit} more today (Limit: ৳${settings.maxWithdrawPerDay}/day).` 
      };
    }

    // Immediate deduction as per requirement
    let newGameBal = currentUser.gameBalance;
    let newMainBal = currentUser.mainBalance;
    let remainingToDeduct = params.amount;

    if (newGameBal >= remainingToDeduct) {
      newGameBal -= remainingToDeduct;
    } else {
      remainingToDeduct -= newGameBal;
      newGameBal = 0;
      newMainBal = Math.max(0, newMainBal - remainingToDeduct);
    }

    const updatedUser = {
      ...currentUser,
      gameBalance: newGameBal,
      mainBalance: newMainBal
    };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    const newTx: Transaction = {
      id: `wth_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      userEmail: currentUser.email,
      userName: currentUser.displayName,
      userPhone: currentUser.phone,
      type: 'withdraw',
      gateway: params.gateway,
      amount: params.amount,
      withdrawNumber: params.withdrawNumber.trim(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setTransactions((prev) => [newTx, ...prev]);
    broadcastSync({ transactions: [newTx, ...transactions], currentUser: updatedUser });

    // Save to Firestore
    try {
      await setDoc(doc(db, 'transactions', newTx.id), newTx);
      await updateDoc(doc(db, 'users', currentUser.id), {
        gameBalance: newGameBal,
        mainBalance: newMainBal
      });
    } catch {
      // offline fallback
    }

    return { 
      success: true, 
      message: 'Withdrawal request submitted! ৳' + params.amount + ' has been held pending admin payout.' 
    };
  };

  // Match Operations: Join Match
  const joinMatch = async (matchId: string, details: {
    ign: string;
    ffUid: string;
    slotNumber: number;
  }): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Please sign in to join matches.' };
    }

    const targetMatch = matches.find((m) => m.id === matchId);
    if (!targetMatch) {
      return { success: false, message: 'Match not found.' };
    }

    if (targetMatch.status !== 'upcoming') {
      return { success: false, message: 'This match is no longer accepting new players.' };
    }

    // Check if slot is taken
    const slotTaken = targetMatch.participants.some((p) => p.slotNumber === details.slotNumber);
    if (slotTaken) {
      return { success: false, message: `Slot #${details.slotNumber} is already booked! Please select another slot.` };
    }

    // Check if user already joined
    const alreadyJoined = targetMatch.participants.some((p) => p.userId === currentUser.id);
    if (alreadyJoined) {
      return { success: false, message: 'You have already joined this match!' };
    }

    const totalBalance = currentUser.mainBalance + currentUser.gameBalance;
    if (totalBalance < targetMatch.entryFee) {
      setIsWalletModalOpen(true);
      setWalletDefaultTab('deposit');
      return { 
        success: false, 
        message: `Insufficient balance! Entry fee is ৳${targetMatch.entryFee}. Please add funds to your wallet.` 
      };
    }

    // Deduct entry fee
    let remaining = targetMatch.entryFee;
    let newMain = currentUser.mainBalance;
    let newGame = currentUser.gameBalance;

    if (newMain >= remaining) {
      newMain -= remaining;
    } else {
      remaining -= newMain;
      newMain = 0;
      newGame = Math.max(0, newGame - remaining);
    }

    const newParticipant: Participant = {
      userId: currentUser.id,
      userName: currentUser.displayName,
      ffIgn: details.ign.trim(),
      ffUid: details.ffUid.trim(),
      slotNumber: details.slotNumber,
      joinedAt: new Date().toISOString()
    };

    const updatedMatch: TournamentMatch = {
      ...targetMatch,
      bookedSlots: targetMatch.bookedSlots + 1,
      participants: [...targetMatch.participants, newParticipant]
    };

    const updatedUser: UserProfile = {
      ...currentUser,
      mainBalance: newMain,
      gameBalance: newGame,
      matchesJoined: currentUser.matchesJoined + 1,
      ffIgn: details.ign.trim(),
      ffUid: details.ffUid.trim()
    };

    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

    broadcastSync({ matches, currentUser: updatedUser });

    // Save to Firestore
    try {
      await updateDoc(doc(db, 'matches', matchId), {
        bookedSlots: updatedMatch.bookedSlots,
        participants: updatedMatch.participants
      });
      await updateDoc(doc(db, 'users', currentUser.id), {
        mainBalance: newMain,
        gameBalance: newGame,
        matchesJoined: updatedUser.matchesJoined,
        ffIgn: details.ign.trim(),
        ffUid: details.ffUid.trim()
      });
    } catch {
      // offline fallback
    }

    return { 
      success: true, 
      message: `Successfully booked Slot #${details.slotNumber}! Room details will be shown here before match start.` 
    };
  };

  // Admin Actions: Create Match
  const createMatch = async (matchData: Omit<TournamentMatch, 'id' | 'createdAt' | 'bookedSlots' | 'participants'>) => {
    const newMatch: TournamentMatch = {
      ...matchData,
      id: `match_ff_${Date.now()}`,
      bookedSlots: 0,
      participants: [],
      createdAt: new Date().toISOString()
    };

    setMatches((prev) => [newMatch, ...prev]);
    broadcastSync({ matches: [newMatch, ...matches] });

    try {
      await setDoc(doc(db, 'matches', newMatch.id), newMatch);
    } catch {
      // offline fallback
    }
  };

  const updateMatch = async (matchId: string, updates: Partial<TournamentMatch>) => {
    setMatches((prev) => prev.map((m) => (m.id === matchId ? { ...m, ...updates } : m)));
    try {
      await updateDoc(doc(db, 'matches', matchId), updates);
    } catch {
      // offline fallback
    }
  };

  const deleteMatch = async (matchId: string) => {
    setMatches((prev) => {
      const updated = prev.filter((m) => m.id !== matchId);
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(updated));
      broadcastSync({ matches: updated });
      return updated;
    });
    try {
      await deleteDoc(doc(db, 'matches', matchId));
    } catch {
      // offline fallback
    }
  };

  const publishRoomDetails = async (matchId: string, roomId: string, pass: string) => {
    await updateMatch(matchId, {
      roomId,
      roomPassword: pass,
      status: 'upcoming'
    });
  };

  // Result & Winner Declaration: Auto distributes money into Game Account
  const publishResults = async (params: {
    matchId: string;
    winnerName: string;
    winnerIgn: string;
    winnerFfUid: string;
    winnerPrize: number;
    scoreboard: ScoreboardEntry[];
  }): Promise<{ success: boolean; message: string }> => {
    const targetMatch = matches.find((m) => m.id === params.matchId);
    if (!targetMatch) {
      return { success: false, message: 'Match not found.' };
    }

    const newResult: MatchResult = {
      id: `result_${Date.now()}`,
      matchId: targetMatch.id,
      matchTitle: targetMatch.title,
      category: targetMatch.category.toUpperCase(),
      map: targetMatch.map,
      winPrize: targetMatch.winPrize,
      perKill: targetMatch.perKill,
      entryFee: targetMatch.entryFee,
      winnerName: params.winnerName,
      winnerIgn: params.winnerIgn,
      winnerFfUid: params.winnerFfUid,
      winnerPrize: params.winnerPrize,
      totalKills: params.scoreboard.reduce((acc, s) => acc + s.kills, 0),
      publishedAt: new Date().toISOString(),
      scoreboard: params.scoreboard
    };

    // Auto-distribute winnings to players' Game Balance!
    setAllUsers((prevUsers) => {
      const updatedList = prevUsers.map((user) => {
        // Find if this user is in the scoreboard
        const entry = params.scoreboard.find(
          (s) => s.ffUid === user.ffUid || s.ign.toLowerCase() === user.ffIgn.toLowerCase()
        );
        if (entry && entry.winningAmount > 0) {
          const newGameBal = user.gameBalance + entry.winningAmount;
          const newTotalWon = user.totalWon + entry.winningAmount;
          // Update Firestore for this user
          try {
            updateDoc(doc(db, 'users', user.id), {
              gameBalance: newGameBal,
              totalWon: newTotalWon
            });
          } catch {
            // fallback
          }
          return {
            ...user,
            gameBalance: newGameBal,
            totalWon: newTotalWon
          };
        }
        return user;
      });

      // Update current user if matches
      const currentUpdated = updatedList.find((u) => u.id === currentUser?.id);
      if (currentUpdated) {
        setCurrentUser(currentUpdated);
      }
      return updatedList;
    });

    // Mark match completed
    const updatedMatch: TournamentMatch = {
      ...targetMatch,
      status: 'completed'
    };
    setMatches((prev) => prev.map((m) => (m.id === targetMatch.id ? updatedMatch : m)));
    setResults((prev) => [newResult, ...prev]);

    try {
      await setDoc(doc(db, 'results', newResult.id), newResult);
      await updateDoc(doc(db, 'matches', targetMatch.id), { status: 'completed' });
    } catch {
      // offline fallback
    }

    return { 
      success: true, 
      message: `Results published! Winnings distributed directly to players' Game Accounts.` 
    };
  };

  // Transaction Manager: Approve Deposit (adds to Main Account)
  const approveDeposit = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.type !== 'deposit' || tx.status !== 'pending') return;

    // Credit to user's Main Account
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === tx.userId) {
          const updatedBal = u.mainBalance + tx.amount;
          try {
            updateDoc(doc(db, 'users', u.id), { mainBalance: updatedBal });
          } catch {
            // fallback
          }
          return { ...u, mainBalance: updatedBal };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === tx.userId) {
      setCurrentUser((prev) => (prev ? { ...prev, mainBalance: prev.mainBalance + tx.amount } : null));
    }

    const updatedTx: Transaction = { ...tx, status: 'approved' };
    setTransactions((prev) => prev.map((t) => (t.id === txId ? updatedTx : t)));

    try {
      await updateDoc(doc(db, 'transactions', txId), { status: 'approved' });
    } catch {
      // fallback
    }
  };

  // Transaction Manager: Reject Deposit
  const rejectDeposit = async (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.type !== 'deposit' || tx.status !== 'pending') return;

    const updatedTx: Transaction = { ...tx, status: 'rejected', rejectReason: reason || 'Invalid Transaction ID' };
    setTransactions((prev) => prev.map((t) => (t.id === txId ? updatedTx : t)));

    try {
      await updateDoc(doc(db, 'transactions', txId), { 
        status: 'rejected', 
        rejectReason: reason || 'Invalid Transaction ID' 
      });
    } catch {
      // fallback
    }
  };

  // Transaction Manager: Approve Withdraw
  const approveWithdraw = async (txId: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') return;

    const updatedTx: Transaction = { ...tx, status: 'approved' };
    setTransactions((prev) => prev.map((t) => (t.id === txId ? updatedTx : t)));

    try {
      await updateDoc(doc(db, 'transactions', txId), { status: 'approved' });
    } catch {
      // fallback
    }
  };

  // Transaction Manager: Reject Withdraw (Refunds balance back)
  const rejectWithdraw = async (txId: string, reason?: string) => {
    const tx = transactions.find((t) => t.id === txId);
    if (!tx || tx.type !== 'withdraw' || tx.status !== 'pending') return;

    // Refund back to user's gameBalance
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === tx.userId) {
          const refundedGameBal = u.gameBalance + tx.amount;
          try {
            updateDoc(doc(db, 'users', u.id), { gameBalance: refundedGameBal });
          } catch {
            // fallback
          }
          return { ...u, gameBalance: refundedGameBal };
        }
        return u;
      })
    );

    if (currentUser && currentUser.id === tx.userId) {
      setCurrentUser((prev) => (prev ? { ...prev, gameBalance: prev.gameBalance + tx.amount } : null));
    }

    const updatedTx: Transaction = { ...tx, status: 'rejected', rejectReason: reason || 'Rejected by Admin' };
    setTransactions((prev) => prev.map((t) => (t.id === txId ? updatedTx : t)));

    try {
      await updateDoc(doc(db, 'transactions', txId), { 
        status: 'rejected', 
        rejectReason: reason || 'Rejected by Admin' 
      });
    } catch {
      // fallback
    }
  };

  // User Management: 3-way Balance Adjust Modal
  const adjustUserBalance = async (
    userId: string,
    params: { type: 'add' | 'remove' | 'set'; account: 'main' | 'game'; amount: number }
  ) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          let updatedMain = u.mainBalance;
          let updatedGame = u.gameBalance;

          if (params.account === 'main') {
            if (params.type === 'add') updatedMain += params.amount;
            else if (params.type === 'remove') updatedMain = Math.max(0, updatedMain - params.amount);
            else updatedMain = Math.max(0, params.amount);
          } else {
            if (params.type === 'add') updatedGame += params.amount;
            else if (params.type === 'remove') updatedGame = Math.max(0, updatedGame - params.amount);
            else updatedGame = Math.max(0, params.amount);
          }

          try {
            updateDoc(doc(db, 'users', userId), {
              mainBalance: updatedMain,
              gameBalance: updatedGame
            });
          } catch {
            // fallback
          }

          const updatedUser = { ...u, mainBalance: updatedMain, gameBalance: updatedGame };
          if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
  };

  const toggleBanUser = async (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newBannedState = !u.isBanned;
          try {
            updateDoc(doc(db, 'users', userId), { isBanned: newBannedState });
          } catch {
            // fallback
          }
          return { ...u, isBanned: newBannedState };
        }
        return u;
      })
    );
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'general'), updated);
    } catch {
      // fallback
    }
  };

  const value = {
    currentUser,
    allUsers,
    matches,
    results,
    transactions,
    settings,
    activeTab,
    setActiveTab,
    isAdmin,
    isAdminRoute,
    setIsAdminRoute,
    selectedCategory,
    setSelectedCategory,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    isWalletModalOpen,
    setIsWalletModalOpen,
    walletDefaultTab,
    setWalletDefaultTab,
    selectedMatchForJoin,
    setSelectedMatchForJoin,
    login,
    signUp,
    logout,
    quickDemoLogin,
    updateUserProfile,
    submitDeposit,
    submitWithdraw,
    joinMatch,
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
    updateSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
