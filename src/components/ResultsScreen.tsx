import React, { useState } from 'react';
import { Trophy, Medal, Award, Flame, Users, ChevronDown, ChevronUp, Crown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MatchResult } from '../types';
import confetti from 'canvas-confetti';

export const ResultsScreen: React.FC = () => {
  const { results } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);

  const filters = [
    { id: 'all', label: 'All Results' },
    { id: 'free_fire', label: 'Free Fire' },
    { id: 'cs4v4', label: 'CS 4v4' },
    { id: 'lonewolf', label: 'Lone Wolf' },
    { id: 'free_match', label: 'Free Match' },
  ];

  const filteredResults = results.filter((res) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'free_fire') return res.category.toLowerCase().includes('free fire') || res.category.toLowerCase().includes('solo') || res.category.toLowerCase().includes('duo') || res.category.toLowerCase().includes('squad');
    if (selectedFilter === 'cs4v4') return res.category.toLowerCase().includes('cs') || res.category.toLowerCase().includes('clash');
    if (selectedFilter === 'lonewolf') return res.category.toLowerCase().includes('wolf') || res.category.toLowerCase().includes('lone');
    if (selectedFilter === 'free_match') return res.category.toLowerCase().includes('free');
    return true;
  });

  const toggleExpand = (id: string) => {
    if (expandedResultId !== id) {
      // Fire confetti celebration!
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      setExpandedResultId(id);
    } else {
      setExpandedResultId(null);
    }
  };

  return (
    <div className="p-3.5 space-y-4 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>ট্যুর্নামেন্ট রেজাল্ট ও বিজয়ী তালিকা</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          সম্পন্ন হওয়া ম্যাচসমূহের ফলাফল ও স্কোরেবল তালিকা
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <Trophy className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">কোনো রেজাল্ট রেকর্ড পাওয়া যায়নি</p>
          </div>
        ) : (
          filteredResults.map((result) => {
            const isExpanded = expandedResultId === result.id;

            return (
              <div
                key={result.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col transition-all"
              >
                {/* Result Card Header: "Winner & Result" */}
                <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-3.5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      WINNER & RESULT
                    </span>
                    <h3 className="font-extrabold text-sm text-white mt-1">
                      {result.matchTitle}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400">
                    {new Date(result.publishedAt).toLocaleDateString('en-GB')}
                  </span>
                </div>

                {/* Booyah Champion Trophy Badge */}
                <div className="p-3.5 bg-gradient-to-b from-amber-500/10 to-transparent border-b border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                      <Crown className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider">
                        BOOYAH CHAMPION #1
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {result.winnerIgn || result.winnerName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        FF UID: {result.winnerFfUid || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      PRIZE WON
                    </span>
                    <span className="text-base font-extrabold text-emerald-600 tabular-nums">
                      ৳{result.winnerPrize}
                    </span>
                  </div>
                </div>

                {/* Quick Match Specs */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 text-center py-2 text-xs">
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase block">WIN PRIZE</span>
                    <span className="font-bold text-slate-800">৳{result.winPrize}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase block">ENTRY FEE</span>
                    <span className="font-bold text-slate-800">{result.entryFee === 0 ? 'FREE' : `৳${result.entryFee}`}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 font-bold uppercase block">PER KILL</span>
                    <span className="font-bold text-slate-800">৳{result.perKill}</span>
                  </div>
                </div>

                {/* Scoreboard Expand Toggle */}
                <div className="p-2.5 bg-white border-t border-slate-100">
                  <button
                    onClick={() => toggleExpand(result.id)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{isExpanded ? 'স্কোরবোর্ড লুকান' : 'সম্পূর্ণ স্কোরবোর্ড দেখুন'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Player Scoreboard Table */}
                  {isExpanded && (
                    <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/80 text-slate-600 text-[10.5px] font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-2.5">Rank</th>
                            <th className="py-2 px-2.5">Player / IGN</th>
                            <th className="py-2 px-2.5">FF UID</th>
                            <th className="py-2 px-2.5 text-center">Kills</th>
                            <th className="py-2 px-2.5 text-right">Prize</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {result.scoreboard.map((row) => (
                            <tr
                              key={`${result.id}_${row.rank}_${row.ffUid}`}
                              className={`hover:bg-slate-50 ${row.rank === 1 ? 'bg-amber-50/50 font-bold' : ''}`}
                            >
                              <td className="py-2 px-2.5">
                                {row.rank === 1 ? (
                                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-extrabold">
                                    1
                                  </span>
                                ) : (
                                  <span className="text-slate-600 font-semibold pl-1.5">
                                    #{row.rank}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-2.5 font-bold text-slate-900">
                                {row.ign || row.playerName}
                              </td>
                              <td className="py-2 px-2.5 font-mono text-slate-500 text-[11px]">
                                {row.ffUid}
                              </td>
                              <td className="py-2 px-2.5 text-center font-bold text-amber-600 tabular-nums">
                                {row.kills}
                              </td>
                              <td className="py-2 px-2.5 text-right font-extrabold text-emerald-600 tabular-nums">
                                {row.winningAmount > 0 ? `৳${row.winningAmount}` : '৳0'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
