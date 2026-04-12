import type { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Scoreboard</h2>
      <ul className="space-y-2">
        {sorted.map((player, rank) => {
          const isActive = players[currentPlayerIndex]?.id === player.id;
          return (
            <li
              key={player.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                isActive ? 'bg-yellow-400/20 ring-1 ring-yellow-400/40' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs w-4">{rank + 1}</span>
                <span className={`font-semibold text-sm ${isActive ? 'text-yellow-300' : 'text-white'}`}>
                  {player.name}
                </span>
              </div>
              <span className={`font-black text-lg tabular-nums ${isActive ? 'text-yellow-300' : 'text-white'}`}>
                {player.score}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
