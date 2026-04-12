import type { GameState } from '../types';

interface PlayerOrderProps {
  state: GameState;
  onBegin: () => void;
}

export function PlayerOrder({ state, onBegin }: PlayerOrderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-5xl font-black text-white mb-2">
          Re<span className="text-indigo-400">bus</span>tle
        </h1>
        <p className="text-white/40 text-sm mb-10">Here's the playing order</p>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6">
          <ol className="space-y-3">
            {state.players.map((player, index) => (
              <li
                key={player.id}
                className="flex items-center gap-4 bg-white/5 rounded-2xl px-4 py-3"
              >
                <span className="text-2xl font-black text-indigo-400 w-8 text-center">
                  {index + 1}
                </span>
                <span className="text-white font-semibold text-lg">{player.name}</span>
                {index === 0 && (
                  <span className="ml-auto text-xs font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg">
                    Goes First
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="text-white/30 text-sm mb-6 space-y-1">
          {state.config.winCondition === 'points' ? (
            <p>First to <span className="text-white font-bold">{state.config.targetPoints} points</span> wins</p>
          ) : (
            <p><span className="text-white font-bold">{state.config.totalRounds} rounds</span> — most points wins</p>
          )}
          <p>10 seconds per turn · {state.puzzles.length} puzzles ready</p>
        </div>

        <button
          onClick={onBegin}
          className="w-full bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-black text-xl py-5 rounded-2xl transition-all"
        >
          Let's Go! 🎮
        </button>
      </div>
    </div>
  );
}
