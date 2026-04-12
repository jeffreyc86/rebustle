import type { GameState } from '../types';

interface WinnerScreenProps {
  state: GameState;
  onPlayAgain: () => void;
}

export function WinnerScreen({ state, onPlayAgain }: WinnerScreenProps) {
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-4">Game Over</p>

        {isTie ? (
          <>
            <h1 className="text-5xl font-black text-white mb-2">It's a Tie!</h1>
            <p className="text-indigo-400 text-lg mb-8">
              {sorted
                .filter((p) => p.score === winner.score)
                .map((p) => p.name)
                .join(' & ')}{' '}
              — {winner.score} points each
            </p>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-black text-white mb-2">{winner.name}</h1>
            <p className="text-indigo-400 text-xl font-bold mb-8">wins with {winner.score} points!</p>
          </>
        )}

        {/* Podium */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-6">
          <ol className="space-y-2">
            {sorted.map((player, rank) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <li
                  key={player.id}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                    rank === 0 ? 'bg-yellow-400/10 ring-1 ring-yellow-400/30' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medals[rank] ?? `${rank + 1}.`}</span>
                    <span className={`font-semibold ${rank === 0 ? 'text-yellow-300' : 'text-white'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className={`font-black text-xl tabular-nums ${rank === 0 ? 'text-yellow-300' : 'text-white'}`}>
                    {player.score}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
