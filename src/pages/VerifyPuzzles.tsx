import { useState } from 'react';
import { puzzles } from '../data/puzzles';

export function VerifyPuzzles() {
  const [filter, setFilter] = useState('');
  const [clueFilter, setClueFilter] = useState('');

  const clueTypes = [...new Set(puzzles.map((p) => p.clue))].sort();

  const visible = puzzles.filter((p) => {
    const matchesClue = !clueFilter || p.clue === clueFilter;
    const matchesText = !filter || p.answer.toLowerCase().includes(filter.toLowerCase()) || p.id.includes(filter);
    return matchesClue && matchesText;
  });

  return (
    <div className="min-h-screen bg-stone-100 p-6">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-stone-800">Puzzle Verification</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {visible.length} of {puzzles.length} puzzles shown
            </p>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search answer or ID..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
            />
            <select
              value={clueFilter}
              onChange={(e) => setClueFilter(e.target.value)}
              className="bg-white border border-stone-200 rounded-xl px-4 py-2 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">All clue types</option>
              {clueTypes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {visible.map((puzzle) => (
            <div
              key={puzzle.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col"
            >
              <div className="bg-stone-50 flex items-center justify-center p-3 min-h-[140px]">
                <img
                  src={puzzle.image}
                  alt={puzzle.answer}
                  className="max-h-[130px] max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 flex flex-col gap-1">
                <p className="font-black text-stone-800 text-sm leading-tight">{puzzle.answer}</p>
                <span
                  className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full self-start"
                  style={{ background: '#0099E618', color: '#0099E6', border: '1px solid #0099E630' }}
                >
                  {puzzle.clue}
                </span>
                <p className="text-stone-300 text-xs font-mono">{puzzle.id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
