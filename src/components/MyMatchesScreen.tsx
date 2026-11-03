import React, { useState } from 'react';
import { Swords, Lock, Copy, Check, Clock, MapPin, Trophy, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MyMatchesScreen: React.FC = () => {
  const { matches, currentUser, setIsAuthModalOpen, setActiveTab } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentUser) {
    return (
      <div className="p-6 text-center space-y-4 pt-12 pb-24">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Swords className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-base text-slate-800">লগইন প্রয়োজন</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          আপনার বুকিং করা ম্যাচসমূহ এবং কাস্টম রুম আইডি ও পাসওয়ার্ড দেখতে লগইন করুন।
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20"
        >
          লগইন করুন
        </button>
      </div>
    );
  }

  // Find matches where user is a participant
  const userMatches = matches.filter((m) =>
    m.participants.some((p) => p.userId === currentUser.id)
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-3.5 space-y-4 pb-28">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Swords className="w-5 h-5 text-blue-600" />
          <span>আমার ম্যাচসমূহ (My Matches)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          আপনার বুক করা ম্যাচ ও কাস্টম রুম অ্যাক্সেস ডিটেইলস
        </p>
      </div>

      {userMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Swords className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-700">আপনি এখনও কোনো ম্যাচে জয়েন করেননি</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            উপরে প্লে ট্যাবে গিয়ে আপনার পছন্দের ফ্রি ফায়ার মোড সিলেক্ট করে ম্যাচে জয়েন করুন।
          </p>
          <button
            onClick={() => setActiveTab('play')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
          >
            ম্যাচগুলো দেখুন
          </button>
        </div>
      ) : (
        userMatches.map((match) => {
          const participant = match.participants.find((p) => p.userId === currentUser.id);

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col space-y-3 p-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                    {match.category.toUpperCase()}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-1">
                    {match.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {match.scheduleTime}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {match.map}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 block">
                    Slot #{participant?.slotNumber}
                  </span>
                </div>
              </div>

              {/* Room ID & Pass Display */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>কাস্টম রুম তথ্য:</span>
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {match.roomId ? 'রুম আইডি প্রকাশিত' : 'ম্যাচের ১৫ মি. আগে আসবে'}
                  </span>
                </div>

                {match.roomId ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold block">ROOM ID</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{match.roomId}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(match.roomId!, `room_${match.id}`)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Copy Room ID"
                      >
                        {copiedId === `room_${match.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-semibold block">PASSWORD</span>
                        <span className="font-mono font-bold text-slate-900 text-sm">{match.roomPassword || '123'}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(match.roomPassword || '123', `pass_${match.id}`)}
                        className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600"
                        title="Copy Password"
                      >
                        {copiedId === `pass_${match.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-blue-50/80 text-blue-800 p-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>রুম আইডি ও পাসওয়ার্ড ম্যাচ শুরুর ১৫ মিনিট আগে এই কার্ডে শো করবে।</span>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
