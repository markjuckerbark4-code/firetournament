export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  phone: string;
  ffUid: string;
  ffIgn: string;
  mainBalance: number; // Deposit balance (ডিপোজিট ব্যালেন্স)
  gameBalance: number; // Winning balance (উইনিং ব্যালেন্স)
  referralCode: string;
  referredBy?: string;
  matchesJoined: number;
  totalWon: number;
  isBanned: boolean;
  role: UserRole;
  createdAt: string;
}

export type MatchCategory = 'solo' | 'duo' | 'squad' | 'cs4v4' | 'lonewolf' | 'ludo_free';
export type CategorySection = 'free_fire' | 'ludo_and_free';
export type MatchStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Participant {
  userId: string;
  userName: string;
  ffIgn: string;
  ffUid: string;
  slotNumber: number;
  joinedAt: string;
  kills?: number;
  rank?: number;
  prizeWon?: number;
}

export interface TournamentMatch {
  id: string;
  title: string;
  category: MatchCategory;
  categorySection: CategorySection;
  map: string; // Bermuda, Purgatory, Kalahari, NexTerra
  type: 'SOLO' | 'DUO' | 'SQUAD' | '4v4';
  version: 'TPP' | 'FPP';
  entryFee: number;
  perKill: number;
  winPrize: number;
  totalPrize: number;
  totalSlots: number;
  bookedSlots: number;
  scheduleTime: string; // e.g. "Today at 08:30 PM"
  status: MatchStatus;
  roomId?: string;
  roomPassword?: string;
  rules: string;
  bannerImage: string;
  participants: Participant[];
  createdAt: string;
}

export interface ScoreboardEntry {
  rank: number;
  playerName: string;
  ign: string;
  ffUid: string;
  kills: number;
  winningAmount: number;
}

export interface MatchResult {
  id: string;
  matchId: string;
  matchTitle: string;
  category: string;
  map: string;
  winPrize: number;
  perKill: number;
  entryFee: number;
  winnerName: string;
  winnerIgn: string;
  winnerFfUid: string;
  winnerPrize: number;
  totalKills: number;
  publishedAt: string;
  scoreboard: ScoreboardEntry[];
}

export type GatewayType = 'bKash' | 'Nagad' | 'Rocket' | 'Upay';
export type TransactionType = 'deposit' | 'withdraw';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  type: TransactionType;
  gateway: GatewayType;
  amount: number;
  senderNumber?: string;
  trxId?: string;
  withdrawNumber?: string;
  status: TransactionStatus;
  rejectReason?: string;
  createdAt: string;
}

export interface AppSettings {
  siteName: string;
  logoText: string;
  marqueeNotice: string;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  upayNumber: string;
  minDeposit: number;
  maxDeposit: number;
  minWithdraw: number;
  maxWithdrawPerDay: number;
  supportWhatsapp: string;
  supportTelegram: string;
  youtubeTutorialUrl: string;
}

export type ActiveTab = 'shop' | 'play' | 'my_matches' | 'results' | 'profile';
