import React from 'react';
import { ShoppingBag, Gamepad2, Swords, Trophy, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedCategory } = useApp();

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'play', label: 'Play', icon: Gamepad2 },
    { id: 'my_matches', label: 'My Matches', icon: Swords },
    { id: 'results', label: 'Results', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    if (tabId === 'play') {
      setSelectedCategory(null);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`min-h-[46px] min-w-[58px] px-2.5 py-1 rounded-2xl flex flex-col items-center justify-center transition-all ${
              isActive
                ? 'bg-purple-100 text-purple-600 font-bold scale-105 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'font-extrabold text-purple-700' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
