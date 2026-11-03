import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCw, 
  Trophy, 
  Coins, 
  Crosshair, 
  MapPin, 
  Users, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Key, 
  Copy, 
  Check, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TournamentMatch } from '../types';

interface MatchScreenProps {
  category: string;
  onBack: () => void;
}

export const MatchScreen: React.FC<MatchScreenProps> = ({ category, onBack }) => {
  const { matches, currentUser, setSelectedMatchForJoin } = useApp();
  const [expandedRulesId, setExpandedRulesId] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter matches for this category
  const categoryMatches = matches.filter(
    (m) => m.category === category && m.status !== 'completed' && m.status !== 'cancelled'
  );

  const getCategoryTitle = () => {
    switch (category) {
      case 'solo': return 'Free Fire Solo';
      case 'duo': return 'Free Fire Duo';
      case 'squad': return 'Free Fire Squad';
      case 'cs4v4': return 'CS 4v4 Clash';
      case 'lonewolf': return 'Lone Wolf 1v1';
      case 'ludo_free': return '100% Free Match';
      default: return 'Tournament';
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleReload = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Sticky Header: < {Category} Matches with reload button */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors active:scale-95"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div>
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight">
              {getCategoryTitle()} Matches
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              {categoryMatches.length} টি লাইভ ম্যাচ উপলব্ধ
            </p>
          </div>
        </div>

        <button
          onClick={handleReload}
          className={`w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95 ${
            isRefreshing ? 'animate-spin text-blue-600' : ''
          }`}
          title="Reload Matches"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Match Cards List */}
      <div className="p-3.5 space-y-4">
        {categoryMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">কোনো ম্যাচ পাওয়া যায়নি</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                এই ক্যাটাগরিতে বর্তমানে কোনো লাইভ ম্যাচ নেই। খুব শীঘ্রই নতুন ম্যাচ শুরু হবে।
              </p>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
            >
              অন্যান্য ম্যাচ দেখুন
            </button>
          </div>
        ) : (
          categoryMatches.map((match) => {
            const isUserJoined = currentUser && match.participants.some((p) => p.userId === currentUser.id);
            const userParticipant = currentUser && match.participants.find((p) => p.userId === currentUser.id);
            const isRulesExpanded = expandedRulesId === match.id;
            const isFull = match.bookedSlots >= match.totalSlots;
            const progressPercent = Math.min(100, Math.round((match.bookedSlots / match.totalSlots) * 100));

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
              >
                {/* Match Header with Thumbnail & Title */}
                <div className="relative aspect-16/7 w-full overflow-hidden bg-slate-900">
                  <img
                    src={match.bannerImage}
                    alt={match.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent" />
                  
                  <div className="absolute top-2.5 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-600/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wide">
                      {match.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
                    <div>
                      <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight drop-shadow-xs">
                        {match.title}
                      </h2>
                      <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {match.map}
                        </span>
                        <span>·</span>
                        <span className="text-amber-300 font-bold">
                          {match.type}
                        </span>
                        <span>·</span>
                        <span className="text-blue-300 font-bold">
                          {match.version}
                        </span>
                      </div>
                    </div>

                    {isUserJoined && (
                      <span className="px-2.5 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs">
                        JOINED (Slot #{userParticipant?.slotNumber})
                      </span>
                    )}
                  </div>
                </div>

                {/* 3-Column Stats Table (WIN PRIZE, ENTRY FEE, PER KILL, MAP, TYPE, VERSION) */}
                <div className="grid grid-cols-3 divide-x divide-y divide-slate-100 border-b border-slate-100 bg-slate-50/50 text-center">
                  <div className="p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      WIN PRIZE
                    </span>
                    <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
                      ৳{match.winPrize}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      ENTRY FEE
                    </span>
                    <span className="text-sm font-extrabold text-blue-600 tabular-nums">
                      {match.entryFee === 0 ? 'FREE' : `৳${match.entryFee}`}
                    </span>
                  </div>

                  <div className="p-2.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      PER KILL
                    </span>
                    <span className="text-sm font-extrabold text-amber-600 tabular-nums">
                      ৳{match.perKill}
                    </span>
                  </div>

                  <div className="p-2">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      MAP
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {match.map}
                    </span>
                  </div>

                  <div className="p-2">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      TYPE
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {match.type}
                    </span>
                  </div>

                  <div className="p-2">
                    <span className="text-[9.5px] uppercase font-bold text-slate-400 block">
                      VERSION
                    </span>
                    <span className="text-xs font-bold text-slate-800">
                      {match.version}
                    </span>
                  </div>
                </div>

                {/* Slot Booking Progress Bar & Join Button */}
                <div className="p-3.5 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-600">
                        স্পট বুকিং: <strong className="text-slate-900">{match.bookedSlots}/{match.totalSlots}</strong>
                      </span>
                      <span className="text-blue-600 font-bold">
                        {match.totalSlots - match.bookedSlots} Spots Left
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Join / Status Action Button */}
                  {isUserJoined ? (
                    <div className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>আপনি অলরেডি স্লট #{userParticipant?.slotNumber} বুক করেছেন</span>
                    </div>
                  ) : isFull ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed"
                    >
                      MATCH FULL (স্লট পূর্ণ)
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedMatchForJoin(match)}
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>JOIN NOW (৳{match.entryFee})</span>
                    </button>
                  )}

                  {/* Room ID & Password Release Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>কাস্টম রুম তথ্য</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {match.roomId ? 'রুম ওপেন আছে' : 'ম্যাচের ১৫ মি. আগে আসবে'}
                      </span>
                    </div>

                    {isUserJoined ? (
                      match.roomId ? (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="text-[9.5px] text-slate-400 font-semibold block">ROOM ID</span>
                              <span className="font-mono font-bold text-slate-900 text-sm">{match.roomId}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(match.roomId!, `room_${match.id}`)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Copy Room ID"
                            >
                              {copiedField === `room_${match.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="text-[9.5px] text-slate-400 font-semibold block">PASSWORD</span>
                              <span className="font-mono font-bold text-slate-900 text-sm">{match.roomPassword || '123'}</span>
                            </div>
                            <button
                              onClick={() => handleCopy(match.roomPassword || '123', `pass_${match.id}`)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                              title="Copy Password"
                            >
                              {copiedField === `pass_${match.id}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50/80 text-blue-800 p-2 rounded-lg text-[11px] font-medium flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>রুম আইডি ও পাসওয়ার্ড ম্যাচ শুরুর ১৫ মিনিট আগে এই বক্সে শো করবে।</span>
                        </div>
                      )
                    ) : (
                      <p className="text-[11px] text-slate-500 font-normal">
                        রুম আইডি ও পাসওয়ার্ড দেখতে ম্যাচে জয়েন করুন।
                      </p>
                    )}
                  </div>

                  {/* Expandable Rules Accordion */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedRulesId(isRulesExpanded ? null : match.id)}
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>টুর্নামেন্টের নিয়মাবলী ও শর্তসমূহ</span>
                      </div>
                      {isRulesExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {isRulesExpanded && (
                      <div className="p-3 bg-white text-[11.5px] text-slate-600 whitespace-pre-line leading-relaxed border-t border-slate-200 font-sans">
                        {match.rules}
                      </div>
                    )}
                  </div>
                </div>

                {/* Full-width green status bar showing Starts at {time} */}
                <div className="bg-[#2e7d32] text-white py-2 px-3.5 text-xs font-bold flex items-center justify-between tracking-wide">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Starts at {match.scheduleTime}</span>
                  </div>
                  <span className="text-[10.5px] bg-emerald-900/40 text-emerald-100 px-2 py-0.5 rounded-full uppercase font-extrabold">
                    {match.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
