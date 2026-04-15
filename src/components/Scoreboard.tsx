import type { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function Scoreboard({ players, currentPlayerIndex }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 w-full">
      <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-3">Scoreboard</h2>
      <ul className="space-y-2">
        {sorted.map((player, rank) => {
          const isActive = players[currentPlayerIndex]?.id === player.id;
          return (
            <li
              key={player.id}
              className={`flex items-center justify-between rounded-xl px-3 py-2 transition-colors ${
                isActive ? 'ring-1' : 'bg-stone-50'
              }`}
              style={isActive ? { background: '#FF6B2B18', ringColor: '#FF6B2B40' } : undefined}
            >
              <div className="flex items-center gap-2">
                <span className="text-stone-300 text-xs w-4">{rank + 1}</span>
                <span
                  className="font-semibold text-sm"
                  style={isActive ? { color: '#FF6B2B' } : { color: '#44403c' }}
                >
                  {player.name}
                </span>
              </div>
              <span
                className="font-black text-lg tabular-nums"
                style={isActive ? { color: '#FF6B2B' } : { color: '#44403c' }}
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
