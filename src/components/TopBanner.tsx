import React from 'react';
import { HelpCircle, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TopBanner: React.FC = () => {
  const { setIsWalletModalOpen, setWalletDefaultTab } = useApp();

  const handleBannerClick = () => {
    setIsWalletModalOpen(true);
    setWalletDefaultTab('deposit');
  };

  return (
    <div className="px-3.5 pt-3">
      <div
        onClick={handleBannerClick}
        className="cursor-pointer group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-600 to-sky-500 p-3.5 text-white shadow-md shadow-blue-500/15 border border-blue-400/30 transition-transform active:scale-[0.98]"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ইন্সট্যান্ট ডিপোজিট</span>
            </div>
            <h3 className="font-extrabold text-[15px] sm:text-base leading-tight text-white drop-shadow-xs">
              কিভাবে? টাকা ADD করবেন?
            </h3>
            <p className="text-[11px] text-blue-100 font-medium">
              বিকাশ ও নগদে টাকা পাঠাতে এখানে ট্যাপ করুন
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {/* Gateway Badges: bKash and Nagad */}
            <div className="flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full border border-white/20">
              <span className="px-1.5 py-0.5 rounded-full bg-[#DF146E] flex items-center justify-center font-black text-[9px] text-white shadow-xs" title="bKash">
                bKash
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#F6921E] flex items-center justify-center font-black text-[9px] text-white shadow-xs" title="Nagad">
                Nagad
              </span>
            </div>

            <div className="flex items-center gap-0.5 text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-full transition-colors">
              <span>টাকা যোগ করুন</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
