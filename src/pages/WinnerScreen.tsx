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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <img src="/logo.svg" alt="Rebustle" className="w-full max-w-xs mx-auto" />
        </div>

        <p className="text-stone-400 text-xs uppercase tracking-widest mb-4">Game Over</p>

        {isTie ? (
          <>
            <h1 className="text-5xl font-black text-stone-800 mb-2">It's a Tie!</h1>
            <p className="text-xl font-bold mb-8" style={{ color: '#00A878' }}>
              {sorted
                .filter((p) => p.score === winner.score)
                .map((p) => p.name)
                .join(' & ')}{' '}
              — {winner.score} points each
            </p>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-black text-stone-800 mb-2">{winner.name}</h1>
            <p className="text-xl font-bold mb-8" style={{ color: '#00A878' }}>
              wins with {winner.score} points!
            </p>
          </>
        )}

        <div className="bg-white border border-stone-200 rounded-3xl p-5 mb-6 shadow-sm">
          <ol className="space-y-2">
            {sorted.map((player, rank) => {
              const medals = ['🥇', '🥈', '🥉'];
              const isWinner = rank === 0;
              return (
                <li
                  key={player.id}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
                    isWinner ? 'bg-stone-50 ring-1 ring-stone-200' : 'bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{medals[rank] ?? `${rank + 1}.`}</span>
                    <span
                      className="font-semibold"
                      style={isWinner ? { color: '#FF6B2B' } : { color: '#44403c' }}
                    >
                      {player.name}
                    </span>
                  </div>
                  <span
                    className="font-black text-xl tabular-nums"
                    style={isWinner ? { color: '#FF6B2B' } : { color: '#78716c' }}
                  >
                    {player.score}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
          style={{ background: '#00A878' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#009969')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#00A878')}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
