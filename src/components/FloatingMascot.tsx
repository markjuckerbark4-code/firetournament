import React, { useState } from 'react';
import { MessageCircle, X, Send, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingMascot: React.FC = () => {
  const { settings } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 max-w-md mx-auto">
      {/* Support Popover */}
      {isOpen && (
        <div className="mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3.5 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                LG
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">২৪/৭ লাইভ সাপোর্ট</h4>
                <span className="text-[10px] text-emerald-600 font-medium">অনলাইন আছেন</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight">
            টাকা যোগ, উত্তোলন বা রুম পাসওয়ার্ড সংক্রান্ত যেকোনো সহায়তায় সরাসরি যোগাযোগ করুন:
          </p>

          <div className="space-y-1.5 pt-1">
            <a
              href={`https://wa.me/${settings.supportWhatsapp}?text=Hello%20LG%20LEADER%20BD%20Support`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp সাপোর্ট</span>
            </a>

            <a
              href={settings.supportTelegram}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram হেল্পডেস্ক</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 border-2 border-white active:scale-95 transition-all relative group"
        title="Customer Support"
        aria-label="Customer Support"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
};
