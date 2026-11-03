import React from 'react';
import { Flame, Trophy, Swords, Zap, Gift, Dices } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoryGrid: React.FC = () => {
  const { matches, setSelectedCategory } = useApp();

  const getMatchCount = (category: string) => {
    return matches.filter((m) => m.category === category && m.status !== 'completed' && m.status !== 'cancelled').length;
  };

  const freeFireCategories = [
    {
      id: 'solo',
      title: 'SOLO BATTLE',
      subtitle: 'BERMUDA & PURGATORY',
      badge: 'HOT',
      badgeColor: 'bg-red-500 text-white',
      image: '/src/assets/images/ff_alok_solo_1793678913693.jpg',
      icon: Flame,
      heroName: 'DJ ALOK',
      count: getMatchCount('solo'),
    },
    {
      id: 'duo',
      title: 'DUO WARRIORS',
      subtitle: '2 PLAYERS TEAM',
      badge: 'PRO',
      badgeColor: 'bg-blue-600 text-white',
      image: '/src/assets/images/ff_hayato_duo_1793678915489.jpg',
      icon: Swords,
      heroName: 'HAYATO',
      count: getMatchCount('duo'),
    },
    {
      id: 'squad',
      title: 'SQUAD ROYALE',
      subtitle: '4 PLAYERS CLAN WAR',
      badge: 'HOT',
      badgeColor: 'bg-amber-500 text-white',
      image: '/src/assets/images/ff_chrono_squad_1793678915035.jpg',
      icon: Trophy,
      heroName: 'CHRONO',
      count: getMatchCount('squad'),
    },
    {
      id: 'cs4v4',
      title: 'CS 4V4 CLASH',
      subtitle: 'ROUND 7 BOOYAH',
      badge: 'POPULAR',
      badgeColor: 'bg-emerald-600 text-white',
      image: '/src/assets/images/ff_kelly_clash_1793678916143.jpg',
      icon: Zap,
      heroName: 'KELLY',
      count: getMatchCount('cs4v4'),
    },
  ];

  const ludoAndFreeCategories = [
    {
      id: 'lonewolf',
      title: 'LONE WOLF 1V1',
      subtitle: 'HEAD TO HEAD DUEL',
      badge: 'PRO',
      badgeColor: 'bg-purple-600 text-white',
      image: '/src/assets/images/ff_hayato_duo_1793678915489.jpg',
      icon: Swords,
      heroName: 'IRON CAGE',
      count: getMatchCount('lonewolf'),
    },
    {
      id: 'ludo_free',
      title: '100% FREE MATCH',
      subtitle: 'ZERO ENTRY · WIN CASH',
      badge: 'GIVEAWAY',
      badgeColor: 'bg-emerald-500 text-white',
      image: '/src/assets/images/ff_alok_solo_1793678913693.jpg',
      icon: Gift,
      heroName: 'FREE ENTRY',
      count: getMatchCount('ludo_free'),
    },
  ];

  return (
    <div className="px-3.5 py-4 space-y-5">
      {/* SECTION 1: FREE FIRE MODES */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-4 bg-blue-600 rounded-sm" />
            <h2 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase">
              FREE FIRE TOURNAMENTS
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-blue-600">
            {matches.filter(m => m.categorySection === 'free_fire' && m.status !== 'completed').length} টি ম্যাচ চলছে
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {freeFireCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex flex-col"
              >
                {/* Image Banner */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase tracking-wide shadow-xs ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  {/* Character label */}
                  <div className="absolute bottom-1.5 right-2">
                    <span className="text-[9px] font-bold text-slate-300 tracking-wider">
                      {cat.heroName}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[13px] text-slate-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Icon className="w-3 h-3 text-blue-600" />
                      ম্যাচ
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10.5px]">
                      {cat.count} Available
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: LUDO AND FREE MATCH */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-4 bg-emerald-600 rounded-sm" />
            <h2 className="text-xs font-extrabold tracking-wider text-slate-800 uppercase">
              LUDO AND FREE MATCH
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-emerald-600">
            স্পেশাল ইভেন্ট
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {ludoAndFreeCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-[0.98] flex flex-col"
              >
                {/* Image Banner */}
                <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded-md text-[9.5px] font-extrabold uppercase tracking-wide shadow-xs ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-1.5 right-2">
                    <span className="text-[9px] font-bold text-amber-300 tracking-wider">
                      {cat.heroName}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[13px] text-slate-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-500 mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Icon className="w-3 h-3 text-emerald-600" />
                      ম্যাচ
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10.5px]">
                      {cat.count} Available
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
