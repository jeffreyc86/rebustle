import { useMemo } from 'react';
import { playerColor } from '../constants/colors';
import type { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  const sorted = useMemo(() => [...players].sort((a, b) => b.score - a.score), [players]);
  const indexMap = useMemo(() => new Map(players.map((p, i) => [p.id, i])), [players]);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 w-full">
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Scoreboard</h2>
      <ul className="space-y-2">
        {sorted.map((player) => {
          const color = playerColor(indexMap.get(player.id) ?? 0);
          const isActive = players[currentPlayerIndex]?.id === player.id;
          return (
            <li
              key={player.id}
              className="flex items-center justify-between rounded-xl px-3 py-2 bg-stone-50"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: color, opacity: isActive ? 1 : 0.35 }}
                />
                <span
                  className="font-semibold text-sm"
                  style={{ color: isActive ? color : '#78716c' }}
                >
                  {player.name}
                </span>
              </div>
              <span
                className="font-black text-lg tabular-nums"
                style={{ color: isActive ? color : '#78716c' }}
              >
                {player.score}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
