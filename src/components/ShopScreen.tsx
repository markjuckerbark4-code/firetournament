import React, { useState } from 'react';
import { ShoppingBag, Gem, ShieldCheck, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopScreen: React.FC = () => {
  const { currentUser, updateUserProfile, setIsWalletModalOpen, setWalletDefaultTab, setIsAuthModalOpen } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [playerUid, setPlayerUid] = useState(currentUser?.ffUid || '');
  const [purchaseStatus, setPurchaseStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = [
    { id: 1, title: '115 Diamonds', diamonds: 115, bonus: '+10 Bonus', price: 85, tag: 'POPULAR' },
    { id: 2, title: '240 Diamonds', diamonds: 240, bonus: '+25 Bonus', price: 170, tag: 'HOT' },
    { id: 3, title: '610 Diamonds', diamonds: 610, bonus: '+60 Bonus', price: 420, tag: 'BEST VALUE' },
    { id: 4, title: '1240 Diamonds', diamonds: 1240, bonus: '+150 Bonus', price: 840, tag: 'PRO' },
    { id: 5, title: 'Weekly Membership', diamonds: 450, bonus: '7 Days Special', price: 165, tag: 'SPECIAL' },
    { id: 6, title: 'Monthly Membership', diamonds: 2600, bonus: '30 Days VIP', price: 800, tag: 'VIP' },
  ];

  const totalBalance = currentUser ? currentUser.mainBalance + currentUser.gameBalance : 0;

  const handleBuy = async (pkg: typeof packages[0]) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!playerUid.trim()) {
      setPurchaseStatus({ success: false, message: 'Please enter your Free Fire Player UID.' });
      return;
    }
    if (totalBalance < pkg.price) {
      setPurchaseStatus({ success: false, message: `Insufficient balance! You need ৳${pkg.price}.` });
      setIsWalletModalOpen(true);
      setWalletDefaultTab('deposit');
      return;
    }

    setIsProcessing(true);
    setPurchaseStatus(null);

    // Deduct
    let remaining = pkg.price;
    let newMain = currentUser.mainBalance;
    let newGame = currentUser.gameBalance;

    if (newMain >= remaining) {
      newMain -= remaining;
    } else {
      remaining -= newMain;
      newMain = 0;
      newGame = Math.max(0, newGame - remaining);
    }

    await updateUserProfile({
      mainBalance: newMain,
      gameBalance: newGame,
      ffUid: playerUid.trim()
    });

    setIsProcessing(false);
    setPurchaseStatus({
      success: true,
      message: `Top-Up successful! ${pkg.title} sent to Free Fire UID: ${playerUid}.`
    });
  };

  return (
    <div className="p-3.5 space-y-4 pb-28">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 rounded-2xl p-4 text-white shadow-md">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INSTANT FREE FIRE TOP-UP</span>
        </div>
        <h2 className="text-base font-extrabold text-white mt-1">
          ডায়মন্ড টপ-আপ ও মেম্বারশিপ শপ
        </h2>
        <p className="text-xs text-blue-100 mt-0.5">
          সরাসরি ইউআইডি দিয়ে ১ মিনিটে ডায়মন্ড কিনুন আপনার ওয়ালেট ব্যালেন্স থেকে।
        </p>
      </div>

      {/* Player UID Input */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-2">
        <label className="text-xs font-bold text-slate-800 block">
          আপনার Free Fire Player UID লিখুন:
        </label>
        <input
          type="text"
          value={playerUid}
          onChange={(e) => setPlayerUid(e.target.value)}
          placeholder="Ex: 2849102847"
          className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {purchaseStatus && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          purchaseStatus.success 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {purchaseStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{purchaseStatus.message}</span>
        </div>
      )}

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-2 right-2">
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                {pkg.tag}
              </span>
            </div>

            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                <Gem className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                {pkg.title}
              </h4>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                {pkg.bonus}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                ৳{pkg.price}
              </span>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleBuy(pkg)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                কিনুন
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
