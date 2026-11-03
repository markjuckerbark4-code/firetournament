import { AppSettings, TournamentMatch, MatchResult, UserProfile, Transaction } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  siteName: "LG LEADER BD",
  logoText: "LG LEADER BD (FREE FIRE ESPORTS)",
  marqueeNotice: "🔥 LG LEADER BD তে স্বাগতম! প্রতিদিন লাইভ কাস্টম রুম টুর্নামেন্ট খেলুন এবং জিতে নিন নগদ পুরস্কার। টাকা যোগ করতে উপরের ব্যানারটিতে ক্লিক করুন। ২৪/৭ হেল্পলাইন চালু আছে।",
  bkashNumber: "01878-901234",
  nagadNumber: "01789-012345",
  rocketNumber: "01987-654321",
  upayNumber: "01678-901234",
  minDeposit: 50,
  maxDeposit: 5000,
  minWithdraw: 50,
  maxWithdrawPerDay: 1000,
  supportWhatsapp: "8801878901234",
  supportTelegram: "https://t.me/lgleaderbd",
  youtubeTutorialUrl: "https://www.youtube.com"
};

export const INITIAL_ADMIN_USER: UserProfile = {
  id: "admin_user_01",
  email: "markjuckerbark4@gmail.com",
  password: "ESA006##@@",
  displayName: "LG Leader Super Admin",
  phone: "01878901234",
  ffUid: "1000000001",
  ffIgn: "LG_OWNER👑",
  mainBalance: 0,
  gameBalance: 0,
  referralCode: "LGADMIN01",
  matchesJoined: 0,
  totalWon: 0,
  isBanned: false,
  role: "admin",
  createdAt: "2026-01-01T00:00:00Z"
};

// No demo matches, results, or transactions
export const INITIAL_MATCHES: TournamentMatch[] = [];
export const INITIAL_RESULTS: MatchResult[] = [];
export const INITIAL_TRANSACTIONS: Transaction[] = [];
