import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles,
  History,
  CheckCircle2,
  XCircle,
  Clock4,
  ShieldCheck,
  Smartphone,
  KeyRound,
  HelpCircle,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GatewayType } from '../types';

export const WalletModal: React.FC = () => {
  const { 
    currentUser, 
    isWalletModalOpen, 
    setIsWalletModalOpen, 
    walletDefaultTab, 
    setWalletDefaultTab,
    settings,
    submitDeposit,
    submitWithdraw,
    transactions,
    setIsAuthModalOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>(walletDefaultTab || 'deposit');
  const [selectedGateway, setSelectedGateway] = useState<GatewayType>('bKash');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState<number | ''>(100);
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [depositStatus, setDepositStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isDepositSubmitting, setIsDepositSubmitting] = useState(false);

  // Withdraw Form
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>(100);
  const [withdrawNumber, setWithdrawNumber] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [isWithdrawSubmitting, setIsWithdrawSubmitting] = useState(false);

  if (!isWalletModalOpen) return null;

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Wallet className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-slate-900">লগইন প্রয়োজন</h3>
          <p className="text-xs text-slate-500">
            ওয়ালেটে টাকা যোগ করতে বা ব্যালেন্স উত্তোলন করতে প্রথমে লগইন করুন।
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWalletModalOpen(false)}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              বন্ধ করুন
            </button>
            <button
              onClick={() => {
                setIsWalletModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
            >
              লগইন করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = currentUser.mainBalance + currentUser.gameBalance;

  const getGatewayNumber = (gw: GatewayType) => {
    switch (gw) {
      case 'bKash': return settings.bkashNumber || '01878-901234';
      case 'Nagad': return settings.nagadNumber || '01789-012345';
      default: return settings.bkashNumber || '01878-901234';
    }
  };

  const handleCopyGatewayNumber = () => {
    const num = getGatewayNumber(selectedGateway);
    navigator.clipboard.writeText(num.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || Number(depositAmount) <= 0) {
      setDepositStatus({ success: false, message: 'Please enter a valid deposit amount.' });
      return;
    }
    if (!senderNumber.trim()) {
      setDepositStatus({ success: false, message: 'Please enter your sender mobile number.' });
      return;
    }
    if (!trxId.trim()) {
      setDepositStatus({ success: false, message: 'Please enter the Transaction ID (TrxID).' });
      return;
    }

    setIsDepositSubmitting(true);
    setDepositStatus(null);

    const res = await submitDeposit({
      gateway: selectedGateway,
      amount: Number(depositAmount),
      senderNumber: senderNumber.trim(),
      trxId: trxId.trim()
    });

    setIsDepositSubmitting(false);
    setDepositStatus(res);

    if (res.success) {
      setSenderNumber('');
      setTrxId('');
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setWithdrawStatus({ success: false, message: 'সঠিক টাকার পরিমাণ দিন।' });
      return;
    }
    const minW = Math.max(50, settings.minWithdraw || 50);
    const amt = Number(withdrawAmount);
    if (amt < minW) {
      setWithdrawStatus({ success: false, message: `সর্বনিম্ন উত্তোলনের পরিমাণ ৳${minW}।` });
      return;
    }
    if (amt > currentUser.gameBalance) {
      setWithdrawStatus({ 
        success: false, 
        message: `উত্তোলন শুধুমাত্র উইনিং ব্যালেন্স থেকে করা যাবে। আপনার বর্তমান উইনিং ব্যালেন্স ৳${currentUser.gameBalance.toFixed(2)}।` 
      });
      return;
    }
    if (!withdrawNumber.trim()) {
      setWithdrawStatus({ success: false, message: 'টাকা পাওয়ার নম্বরটি দিন।' });
      return;
    }

    setIsWithdrawSubmitting(true);
    setWithdrawStatus(null);

    const res = await submitWithdraw({
      gateway: selectedGateway,
      amount: amt,
      withdrawNumber: withdrawNumber.trim()
    });

    setIsWithdrawSubmitting(false);
    setWithdrawStatus(res);

    if (res.success) {
      setWithdrawNumber('');
      setWithdrawAmount('');
    }
  };

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                মাই ওয়ালেট (My Wallet)
              </h3>
              <p className="text-[10.5px] text-slate-500 font-medium">
                ডিপোজিট ও ক্যাশআউট ম্যানেজমেন্ট
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWalletModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Available Balance Card with Account Breakdown */}
        <div className="p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider block">
                TOTAL UNIFIED BALANCE
              </span>
              <div className="text-2xl font-extrabold text-white mt-0.5 tabular-nums flex items-center gap-1">
                <span>৳</span>
                <span>{totalBalance.toFixed(2)}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10.5px] font-bold text-blue-200">
              Active Wallet
            </span>
          </div>

          {/* Dual Accounts Breakdown */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-blue-200 block">১. ডিপোজিট ব্যালেন্স (Main)</span>
              <span className="text-sm font-extrabold text-white tabular-nums">৳{currentUser.mainBalance.toFixed(1)}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="text-[10px] text-emerald-300 block">২. উইনিং ব্যালেন্স (Game)</span>
              <span className="text-sm font-extrabold text-emerald-400 tabular-nums">৳{currentUser.gameBalance.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('deposit')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>টাকা যোগ (Deposit)</span>
          </button>

          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'withdraw'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>উত্তোলন (Withdraw)</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>হিস্ট্রি (History)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DEPOSIT */}
          {activeTab === 'deposit' && (
            <div className="space-y-4">
              {/* Professional Gateway Selector (bKash & Nagad only) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
                    <span>পেমেন্ট গেটওয়ে নির্বাচন করুন:</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">ব্যক্তিগত সেন্ড মানি</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* bKash Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('bKash')}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] flex items-center gap-3 ${
                      selectedGateway === 'bKash'
                        ? 'border-[#DF146E] bg-gradient-to-br from-[#DF146E]/10 via-[#DF146E]/5 to-white shadow-md shadow-[#DF146E]/15 ring-2 ring-[#DF146E]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#DF146E] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      <span className="tracking-tighter">bK</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                          bKash
                        </span>
                        {selectedGateway === 'bKash' && (
                          <span className="w-4 h-4 rounded-full bg-[#DF146E] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] font-bold text-[#DF146E] block mt-0.5">
                        বিকাশ পার্সোনাল
                      </span>
                      <span className="text-[9.5px] text-slate-400 block">
                        সেন্ড মানি · ইনস্ট্যান্ট
                      </span>
                    </div>
                  </button>

                  {/* Nagad Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('Nagad')}
                    className={`relative p-3 rounded-2xl border-2 text-left transition-all active:scale-[0.98] flex items-center gap-3 ${
                      selectedGateway === 'Nagad'
                        ? 'border-[#F6921E] bg-gradient-to-br from-[#F6921E]/10 via-[#F6921E]/5 to-white shadow-md shadow-[#F6921E]/15 ring-2 ring-[#F6921E]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F6921E] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                      <span className="tracking-tighter">NG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 block leading-tight">
                          Nagad
                        </span>
                        {selectedGateway === 'Nagad' && (
                          <span className="w-4 h-4 rounded-full bg-[#F6921E] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] font-bold text-[#F6921E] block mt-0.5">
                        নগদ পার্সোনাল
                      </span>
                      <span className="text-[9.5px] text-slate-400 block">
                        সেন্ড মানি · ইনস্ট্যান্ট
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Step 1: Official Number & Copy Card */}
              <div className={`rounded-2xl border p-3.5 space-y-3 transition-colors ${
                selectedGateway === 'bKash' 
                  ? 'bg-gradient-to-b from-[#DF146E]/5 to-slate-50/80 border-[#DF146E]/30' 
                  : 'bg-gradient-to-b from-[#F6921E]/5 to-slate-50/80 border-[#F6921E]/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                      selectedGateway === 'bKash' ? 'bg-[#DF146E]' : 'bg-[#F6921E]'
                    }`}>
                      ১
                    </span>
                    <span className="font-black text-xs text-slate-800">
                      টাকা পাঠানোর {selectedGateway === 'bKash' ? 'বিকাশ' : 'নগদ'} নম্বর:
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedGateway === 'bKash' ? 'bg-[#DF146E]/15 text-[#DF146E]' : 'bg-[#F6921E]/15 text-[#F6921E]'
                  }`}>
                    Send Money
                  </span>
                </div>

                {/* Big Copyable Number Box */}
                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {selectedGateway} Personal Number (ট্যাপ করে কপি করুন)
                    </span>
                    <span className="font-mono text-base sm:text-lg font-black text-slate-900 tracking-wider select-all block mt-0.5">
                      {getGatewayNumber(selectedGateway)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyGatewayNumber}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 ${
                      copiedNumber 
                        ? 'bg-emerald-600 text-white' 
                        : selectedGateway === 'bKash'
                        ? 'bg-[#DF146E] hover:bg-[#c91060] text-white shadow-[#DF146E]/20'
                        : 'bg-[#F6921E] hover:bg-[#e07f12] text-white shadow-[#F6921E]/20'
                    }`}
                  >
                    {copiedNumber ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>

                {/* 3 Step Instructions */}
                <div className="bg-white/80 rounded-xl p-2.5 border border-slate-200/60 text-[11px] text-slate-600 space-y-1.5 leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">•</span>
                    <span>আপনার <strong>{selectedGateway} App</strong> এ যান এবং <strong>"Send Money" (সেন্ড মানি)</strong> অপশন সিলেক্ট করুন।</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">•</span>
                    <span>ওপরের নম্বরে সর্বনিম্ন <strong>৳{settings.minDeposit}</strong> টাকা পাঠান।</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">•</span>
                    <span>টাকা পাঠানো শেষে ফিরতি এসএমএস থেকে <strong>Transaction ID (TrxID)</strong> কপি করে নিচে দিন।</span>
                  </div>
                </div>
              </div>

              {depositStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
                  depositStatus.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {depositStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  <span className="font-medium">{depositStatus.message}</span>
                </div>
              )}

              {/* Step 2: Form Inputs */}
              <form onSubmit={handleDepositSubmit} className="space-y-3.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white ${
                    selectedGateway === 'bKash' ? 'bg-[#DF146E]' : 'bg-[#F6921E]'
                  }`}>
                    ২
                  </span>
                  <span className="font-black text-xs text-slate-800">
                    ডিপোজিট ভেরিফিকেশন তথ্য সাবমিট করুন:
                  </span>
                </div>

                {/* Amount with quick select buttons */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      টাকার পরিমাণ (BDT) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium">
                      সর্বনিম্ন ৳{settings.minDeposit} - সর্বোচ্চ ৳{settings.maxDeposit}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 font-bold text-slate-400 text-sm">৳</span>
                    <input
                      type="number"
                      min={settings.minDeposit}
                      max={settings.maxDeposit}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder={`Min: ৳${settings.minDeposit}`}
                      className="w-full pl-8 pr-3 py-2.5 text-xs font-extrabold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 mt-2">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-1 rounded-lg text-[10.5px] font-bold border transition-colors ${
                          depositAmount === amt
                            ? selectedGateway === 'bKash' 
                              ? 'bg-[#DF146E] text-white border-[#DF146E]'
                              : 'bg-[#F6921E] text-white border-[#F6921E]'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sender Mobile Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Transaction ID */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      Transaction ID (TrxID) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">এসএমএস থেকে কোডটি দিন</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                      placeholder="Ex: 9K8A7B6C5D"
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono font-black uppercase rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none tracking-wider text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button styled to match active gateway */}
                <button
                  type="submit"
                  disabled={isDepositSubmitting}
                  className={`w-full py-3 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                    isDepositSubmitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : selectedGateway === 'bKash'
                      ? 'bg-gradient-to-r from-[#DF146E] to-[#B00F55] hover:from-[#c91060] hover:to-[#960d49] shadow-[#DF146E]/25'
                      : 'bg-gradient-to-r from-[#F6921E] to-[#D97706] hover:from-[#e07f12] hover:to-[#b45309] shadow-[#F6921E]/25'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isDepositSubmitting ? 'রিকোয়েস্ট যাচাই হচ্ছে...' : `${selectedGateway} ডিপোজিট সাবমিট করুন`}
                  </span>
                </button>

                {/* Trust guarantee footer */}
                <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-slate-500 pt-1 text-center font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>৫-১৫ মিনিটের মধ্যে আপনার ডিপোজিট ব্যালেন্সে টাকা যোগ হবে।</span>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: WITHDRAW (bKash & Nagad only) */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  উত্তোলনের মেথড নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['bKash', 'Nagad'] as GatewayType[]).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setSelectedGateway(gw)}
                      className={`p-3 rounded-2xl border-2 text-xs font-bold flex items-center gap-2.5 transition-all ${
                        selectedGateway === gw
                          ? gw === 'bKash'
                            ? 'border-[#DF146E] bg-[#DF146E]/10 text-slate-900 ring-2 ring-[#DF146E]/20'
                            : 'border-[#F6921E] bg-[#F6921E]/10 text-slate-900 ring-2 ring-[#F6921E]/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-xs shrink-0 ${
                        gw === 'bKash' ? 'bg-[#DF146E]' : 'bg-[#F6921E]'
                      }`}>
                        {gw === 'bKash' ? 'bK' : 'NG'}
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <span className="block font-black text-xs">{gw}</span>
                        <span className="text-[10px] text-slate-500 font-medium">পার্সোনাল ক্যাশআউট</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Winning Balance Status Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">উত্তোলনযোগ্য উইনিং ব্যালেন্স:</span>
                  <span className="text-base font-black text-emerald-600 tabular-nums">৳{currentUser.gameBalance.toFixed(2)}</span>
                </div>
                <p className="text-[10.5px] text-slate-500 leading-snug">
                  * শুধুমাত্র টুর্নামেন্ট/ম্যাচ জিতে অর্জিত টাকা উইথড্র করা যাবে (সর্বনিম্ন ৳৫০)। ডিপোজিটকৃত মেইন ব্যালেন্স (৳{currentUser.mainBalance.toFixed(1)}) দিয়ে ম্যাচ জয়েন ও ডায়মন্ড কিনতে পারবেন।
                </p>
              </div>

              {/* Limits Information Box */}
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>সর্বনিম্ন উত্তোলন:</span>
                  <span className="text-emerald-700">৳{Math.max(50, settings.minWithdraw || 50)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>দৈনিক সর্বোচ্চ সীমা:</span>
                  <span>৳{settings.maxWithdrawPerDay} / দিন</span>
                </div>
              </div>

              {withdrawStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  withdrawStatus.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {withdrawStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  <span>{withdrawStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    টাকার পরিমাণ (BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={Math.max(50, settings.minWithdraw || 50)}
                    max={Math.min(currentUser.gameBalance, settings.maxWithdrawPerDay)}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Min: ৳${Math.max(50, settings.minWithdraw || 50)}`}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        disabled={currentUser.gameBalance < amt}
                        onClick={() => setWithdrawAmount(amt)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-[10.5px] font-bold"
                      >
                        ৳{amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={currentUser.gameBalance < Math.max(50, settings.minWithdraw || 50)}
                      onClick={() => setWithdrawAmount(Math.floor(currentUser.gameBalance))}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-[10.5px] font-bold ml-auto"
                    >
                      সব উইনিং ব্যালেন্স
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    যে নম্বরে টাকা গ্রহণ করবেন ({selectedGateway} Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={withdrawNumber}
                    onChange={(e) => setWithdrawNumber(e.target.value)}
                    placeholder="Ex: 01712345678"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isWithdrawSubmitting || totalBalance < settings.minWithdraw}
                  className={`w-full py-2.5 rounded-xl text-xs font-extrabold uppercase text-white shadow-md transition-all ${
                    isWithdrawSubmitting || totalBalance < settings.minWithdraw
                      ? 'bg-slate-300 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                  }`}
                >
                  {isWithdrawSubmitting ? 'প্রসেসিং হচ্ছে...' : 'উইথড্র রিকোয়েস্ট পাঠান'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {userTransactions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>আপনার কোনো লেনদেনের রেকর্ড নেই</p>
                </div>
              ) : (
                userTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span className="capitalize">{tx.type === 'deposit' ? 'ডিপোজিট' : 'উত্তোলন'}</span>
                          <span className="text-[10px] text-slate-400">({tx.gateway})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(tx.createdAt).toLocaleDateString()}
                        </span>
                        {tx.trxId && (
                          <span className="text-[9.5px] font-mono text-slate-500">
                            Trx: {tx.trxId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-sm font-extrabold block tabular-nums ${
                        tx.type === 'deposit' ? 'text-blue-600' : 'text-slate-900'
                      }`}>
                        {tx.type === 'deposit' ? `+৳${tx.amount}` : `-৳${tx.amount}`}
                      </span>

                      <span className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                        tx.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : tx.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
