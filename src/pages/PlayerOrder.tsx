import type { GameState } from '../types';

interface PlayerOrderProps {
  state: GameState;
  onBegin: () => void;
}

export function PlayerOrder({ state, onBegin }: PlayerOrderProps) {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <img src="/logo.svg" alt="Rebustle" className="w-full max-w-xs mx-auto" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-stone-100 p-6 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Playing Order</p>
          <ol className="space-y-2">
            {state.players.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center gap-4 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-3"
              >
                <span className="text-2xl font-black w-8 text-center" style={{ color: '#0099E6' }}>
                  {index + 1}
                </span>
                <span className="text-stone-800 font-semibold text-lg">{player.name}</span>
                {index === 0 && (
                  <span className="ml-auto text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg"
                    style={{ color: '#FF6B2B', background: '#FF6B2B18' }}>
                    Goes First
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="text-stone-400 text-sm mb-6 space-y-1">
          {state.config.winCondition === 'points' ? (
            <p>First to <span className="text-stone-700 font-bold">{state.config.targetPoints} points</span> wins</p>
          ) : (
            <p><span className="text-stone-700 font-bold">{state.config.totalRounds} rounds</span> — most points wins</p>
          )}
          <p>10 seconds per turn · {state.puzzles.length} puzzles ready</p>
        </div>

        <button
          onClick={onBegin}
          className="w-full active:scale-95 text-white font-black text-xl py-5 rounded-2xl transition-all"
          style={{ background: '#00A878' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#009969')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#00A878')}
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}
