import React, { useState } from 'react';
import { Volume2, Plus, Shield, User, Wallet, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    settings, 
    setIsAuthModalOpen, 
    setIsWalletModalOpen, 
    setWalletDefaultTab,
    isAdmin,
    isAdminRoute,
    setIsAdminRoute
  } = useApp();

  const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);

  const totalBalance = currentUser ? currentUser.mainBalance + currentUser.gameBalance : 0;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* App Bar */}
      <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Animated Glowing Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-extrabold text-sm tracking-wider">
              LG
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[15px] tracking-tight bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                {settings.siteName}
              </span>
            </div>
            <p className="text-[9.5px] font-bold text-slate-500 tracking-wider uppercase -mt-0.5">
              FREE FIRE ESPORTS
            </p>
          </div>
        </div>

        {/* Right Action: Balance Chip & Auth */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="relative">
              <div 
                onClick={() => setShowBalanceDropdown(!showBalanceDropdown)}
                className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-slate-100/90 border border-slate-200/90 hover:bg-slate-200/60 cursor-pointer transition-colors shadow-2xs"
              >
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-medium block leading-none">ব্যালেন্স</span>
                  <span className="text-[13px] font-bold text-slate-900 tabular-nums">
                    ৳{totalBalance.toFixed(0)}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showBalanceDropdown ? 'rotate-180' : ''}`} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWalletModalOpen(true);
                    setWalletDefaultTab('deposit');
                  }}
                  className="w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xs active:scale-95 transition-transform"
                  title="Add Money"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* Dynamic Balance Breakdown Dropdown */}
              {showBalanceDropdown && (
                <div 
                  className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span>ওয়ালেট ব্যালেন্স</span>
                    <button 
                      onClick={() => {
                        setShowBalanceDropdown(false);
                        setIsWalletModalOpen(true);
                        setWalletDefaultTab('deposit');
                      }}
                      className="text-blue-600 hover:underline text-[11px]"
                    >
                      বিস্তারিত
                    </button>
                  </div>
                  <div className="py-2 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>ডিপোজিট ব্যালেন্স:</span>
                      <span className="font-bold text-slate-900 tabular-nums">৳{currentUser.mainBalance.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span>উইনিং ব্যালেন্স:</span>
                      <span className="font-bold text-emerald-600 tabular-nums">৳{currentUser.gameBalance.toFixed(1)}</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-100 flex justify-between items-center font-bold text-slate-900">
                      <span>মোট ব্যালেন্স:</span>
                      <span className="text-blue-600 tabular-nums">৳{totalBalance.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setShowBalanceDropdown(false);
                        setIsWalletModalOpen(true);
                        setWalletDefaultTab('deposit');
                      }}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-semibold text-center"
                    >
                      + ডিপোজিট
                    </button>
                    <button
                      onClick={() => {
                        setShowBalanceDropdown(false);
                        setIsWalletModalOpen(true);
                        setWalletDefaultTab('withdraw');
                      }}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold text-center"
                    >
                      উত্তোলন
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-xs transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>লগইন</span>
            </button>
          )}


        </div>
      </div>

      {/* Scrolling Marquee Notice Ticker */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-3 py-1.5 flex items-center gap-2 overflow-hidden text-xs">
        <div className="flex items-center gap-1 shrink-0 bg-blue-900/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-300">
          <Volume2 className="w-3 h-3 text-amber-300 animate-pulse" />
          <span>নোটিশ</span>
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee font-medium text-[11.5px] text-slate-100">
            {settings.marqueeNotice}
          </div>
        </div>
      </div>
    </header>
  );
};
