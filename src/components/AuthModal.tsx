import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login,
    signUp,
    quickDemoLogin
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('দয়া করে ইমেইল এবং পাসওয়ার্ড উভয়টি লিখুন।');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    const res = await login(email, password);
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'সাইন ইন করতে সমস্যা হয়েছে।');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !ffUid || !password) {
      setErrorMsg('দয়া করে সব কয়টি তথ্য সঠিকভাবে পূরণ করুন।');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড দুটি মেলেনি! একই পাসওয়ার্ড দিন।');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('দয়া করে শর্তাবলী মেনে চলার টিক দিন।');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const res = await signUp({
      name,
      email,
      phone,
      ffUid,
      pass: password,
      referralCode
    });
    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to sign up.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            LG
          </div>
          <h2 className="font-extrabold text-lg text-slate-900 mt-2">
            {authModalMode === 'signin' ? 'Welcome Back!' : "Let's Start"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {authModalMode === 'signin' 
              ? 'আপনার অ্যাকাউন্টে সাইন ইন করুন' 
              : 'নতুন অ্যাকাউন্ট তৈরি করে টুর্নামেন্ট খেলুন'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* SIGN IN FORM */}
        {authModalMode === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">জিমেইল / ইমেইল ঠিকানা</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold text-slate-700">পাসওয়ার্ড</label>
                <span className="text-[10px] text-slate-400">
                  সঠিক পাসওয়ার্ড দিন
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Black Pill Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-md active:scale-[0.98] transition-all"
            >
              {isLoading ? 'সাইন ইন হচ্ছে...' : 'Sign In'}
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('signup');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Create Account
              </button>
            </div>
          </form>
        ) : (
          /* SIGN UP FORM */
          <form onSubmit={handleSignUp} className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">পূর্ণ নাম *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Tanvir Hasan"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">জিমেইল / ইমেইল *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Free Fire UID *</label>
              <input
                type="text"
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                placeholder="Player UID (e.g. 2849102847)"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">পাসওয়ার্ড *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">কনফার্ম পাসওয়ার্ড *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">রেফারেল কোড (ঐচ্ছিক)</label>
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Ex: LGBD7721"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-600">
                আমি প্ল্যাটফর্মের নিয়ম ও ফেয়ার প্লে শর্ত মেনে চলব।
              </label>
            </div>

            {/* Black Pill Create Account Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wide shadow-md active:scale-[0.98] transition-all mt-2"
            >
              {isLoading ? 'তৈরি হচ্ছে...' : 'Create Account'}
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('');
                  setAuthModalMode('signin');
                }}
                className="font-bold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
