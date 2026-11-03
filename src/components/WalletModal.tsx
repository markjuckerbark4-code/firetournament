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
  Clock4
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
      case 'bKash': return settings.bkashNumber;
      case 'Nagad': return settings.nagadNumber;
      case 'Rocket': return settings.rocketNumber;
      case 'Upay': return settings.upayNumber;
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
      setWithdrawStatus({ success: false, message: 'Please enter a valid withdrawal amount.' });
      return;
    }
    if (!withdrawNumber.trim()) {
      setWithdrawStatus({ success: false, message: 'Please enter your receiving mobile number.' });
      return;
    }

    setIsWithdrawSubmitting(true);
    setWithdrawStatus(null);

    const res = await submitWithdraw({
      gateway: selectedGateway,
      amount: Number(withdrawAmount),
      withdrawNumber: withdrawNumber.trim()
    });

    setIsWithdrawSubmitting(false);
    setWithdrawStatus(res);

    if (res.success) {
      setWithdrawNumber('');
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
              {/* Gateway Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  পেমেন্ট মেথড নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['bKash', 'Nagad', 'Rocket', 'Upay'] as GatewayType[]).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setSelectedGateway(gw)}
                      className={`py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedGateway === gw
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black ${
                        gw === 'bKash' ? 'bg-[#DF146E]' : gw === 'Nagad' ? 'bg-[#F6921E]' : gw === 'Rocket' ? 'bg-[#8C3494]' : 'bg-[#0081C9]'
                      }`}>
                        {gw.charAt(0)}
                      </span>
                      <span>{gw}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Branded Instruction Card with Copy Button */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedGateway} Personal (Send Money)</span>
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    সেন্ড মানি
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">আমাদের নম্বর</span>
                    <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                      {getGatewayNumber(selectedGateway)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyGatewayNumber}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    {copiedNumber ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  * ওপরের নম্বরে সেন্ড মানি করুন। এরপর আপনার প্রেরক মোবাইল নম্বর ও ফিরতি মেসেজের ট্রানজেকশন আইডি (TrxID) নিচে লিখে সাবমিট করুন। সর্বনিম্ন ডিপোজিট ৳{settings.minDeposit}।
                </p>
              </div>

              {depositStatus && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  depositStatus.success 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {depositStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  <span>{depositStatus.message}</span>
                </div>
              )}

              {/* Form Inputs */}
              <form onSubmit={handleDepositSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    টাকার পরিমাণ (BDT) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={settings.minDeposit}
                    max={settings.maxDeposit}
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Min: ৳${settings.minDeposit}`}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold"
                      >
                        +৳{amt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="Ex: 01712345678"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Transaction ID (TrxID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="Ex: 9K8A7B6C5D"
                    className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isDepositSubmitting}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-extrabold uppercase shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
                >
                  {isDepositSubmitting ? 'রিকোয়েস্ট পাঠানো হচ্ছে...' : 'ডিপোজিট রিকোয়েস্ট সাবমিট করুন'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: WITHDRAW */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  উত্তোলনের মেথড নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['bKash', 'Nagad', 'Rocket'] as GatewayType[]).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setSelectedGateway(gw)}
                      className={`py-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                        selectedGateway === gw
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{gw}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Limits Information Box */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>সর্বনিম্ন উত্তোলন:</span>
                  <span>৳{settings.minWithdraw}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>দৈনিক সর্বোচ্চ সীমা:</span>
                  <span>৳{settings.maxWithdrawPerDay} / দিন</span>
                </div>
                <p className="text-[10.5px] text-emerald-700 pt-1">
                  * উইথড্র রিকোয়েস্ট করার সাথে সাথে আপনার ব্যালেন্স থেকে টাকা হোল্ড হবে এবং এডমিন যাচাই করে ১০-৩০ মিনিটের মধ্যে টাকা পাঠিয়ে দেবেন।
                </p>
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
                    min={settings.minWithdraw}
                    max={Math.min(totalBalance, settings.maxWithdrawPerDay)}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Min: ৳${settings.minWithdraw}`}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <div className="flex gap-1.5 mt-1.5">
                    {[50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(amt)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10.5px] font-bold"
                      >
                        ৳{amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(Math.floor(totalBalance))}
                      className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10.5px] font-bold ml-auto"
                    >
                      সব ব্যালেন্স
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
