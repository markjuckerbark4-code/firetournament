import React, { useState } from 'react';
import { X, Trophy, Check, AlertCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const JoinMatchModal: React.FC = () => {
  const { 
    currentUser, 
    selectedMatchForJoin, 
    setSelectedMatchForJoin, 
    joinMatch,
    setIsWalletModalOpen,
    setWalletDefaultTab
  } = useApp();

  const [ign, setIgn] = useState(currentUser?.ffIgn || '');
  const [ffUid, setFfUid] = useState(currentUser?.ffUid || '');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedMatchForJoin || !currentUser) return null;

  const totalBalance = currentUser.mainBalance + currentUser.gameBalance;
  const isBalanceEnough = totalBalance >= selectedMatchForJoin.entryFee;

  // Booked slots map
  const bookedSlotsSet = new Set(selectedMatchForJoin.participants.map((p) => p.slotNumber));

  const handleConfirmJoin = async () => {
    if (!ign.trim()) {
      setErrorMsg('Please enter your Free Fire In-Game Name (IGN).');
      return;
    }
    if (!ffUid.trim()) {
      setErrorMsg('Please enter your Free Fire Player UID.');
      return;
    }
    if (selectedSlot === null) {
      setErrorMsg('Please pick a slot number from the grid below.');
      return;
    }
    if (!isBalanceEnough) {
      setErrorMsg('Insufficient balance. Please add money.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await joinMatch(selectedMatchForJoin.id, {
      ign: ign.trim(),
      ffUid: ffUid.trim(),
      slotNumber: selectedSlot
    });

    setIsSubmitting(false);

    if (res.success) {
      setSelectedMatchForJoin(null);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              স্লট সিলেক্ট ও কনফার্ম
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {selectedMatchForJoin.title}
            </p>
          </div>
          <button
            onClick={() => setSelectedMatchForJoin(null)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Balance & Fee Comparison */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-3 rounded-2xl text-xs">
            <div>
              <span className="text-slate-500 font-medium block">আপনার মোট ব্যালেন্স:</span>
              <span className="text-base font-extrabold text-slate-900 tabular-nums">
                ৳{totalBalance.toFixed(0)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium block">ম্যাচ এন্ট্রি ফি:</span>
              <span className="text-base font-extrabold text-blue-600 tabular-nums">
                {selectedMatchForJoin.entryFee === 0 ? 'FREE' : `৳${selectedMatchForJoin.entryFee}`}
              </span>
            </div>
          </div>

          {!isBalanceEnough && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start justify-between gap-2">
              <div className="flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>ব্যালেন্স অপর্যাপ্ত! জয়েন করতে ডিপোজিট করুন।</span>
              </div>
              <button
                onClick={() => {
                  setSelectedMatchForJoin(null);
                  setIsWalletModalOpen(true);
                  setWalletDefaultTab('deposit');
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] shrink-0"
              >
                + টাকা যোগ
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Player Info Inputs */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Free Fire In-Game Name (IGN) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ign}
                onChange={(e) => setIgn(e.target.value)}
                placeholder="Ex: LG_TANVIR࿐"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                গেমের ভেতরে থাকা নাম হুবহু লিখুন যাতে কাস্টম রুমে কিক না হন।
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Free Fire UID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                placeholder="Ex: 2849102847"
                className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Slot Grid Picker */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-800">পছন্দের স্লট নম্বর বেছে নিন:</span>
              <div className="flex items-center gap-2 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" /> ফাঁকা
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> বুকড
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> সিলেক্টেড
                </span>
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 max-h-44 overflow-y-auto p-1 bg-slate-50 border border-slate-200 rounded-xl">
              {Array.from({ length: selectedMatchForJoin.totalSlots }, (_, i) => i + 1).map((slotNum) => {
                const isBooked = bookedSlotsSet.has(slotNum);
                const isSelected = selectedSlot === slotNum;

                return (
                  <button
                    key={slotNum}
                    type="button"
                    disabled={isBooked}
                    onClick={() => {
                      setSelectedSlot(slotNum);
                      setErrorMsg('');
                    }}
                    className={`h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      isBooked
                        ? 'bg-red-100 text-red-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300 scale-105'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    #{slotNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedMatchForJoin(null)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            বাতিল
          </button>
          
          <button
            type="button"
            disabled={isSubmitting || !isBalanceEnough}
            onClick={handleConfirmJoin}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wide text-white transition-all shadow-md ${
              isSubmitting || !isBalanceEnough
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isSubmitting ? 'প্রসেসিং...' : selectedSlot ? `স্লট #${selectedSlot} কনফার্ম করুন` : 'স্লট সিলেক্ট করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};
