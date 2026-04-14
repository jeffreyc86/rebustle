import { useEffect, useRef, useState } from 'react';
import { AnswerFlash } from '../components/AnswerFlash';
import { Scoreboard } from '../components/Scoreboard';
import { Timer } from '../components/Timer';
import { useBroadcastReceiver } from '../hooks/useBroadcast';
import type { GameState } from '../types';

export function GameScreen() {
  const [state, setState] = useState<GameState | null>(null);
  // Increment to reset the timer when the active player changes
  const timerResetKeyRef = useRef(0);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const prevPlayerIndexRef = useRef<number | null>(null);

  useBroadcastReceiver((incoming) => {
    setState((prev) => {
      // Reset timer when player changes
      if (prev !== null && incoming.currentPlayerIndex !== prevPlayerIndexRef.current) {
        timerResetKeyRef.current += 1;
        setTimerResetKey(timerResetKeyRef.current);
      }
      prevPlayerIndexRef.current = incoming.currentPlayerIndex;
      return incoming;
    });
  });

  // Prevent GM page from being opened here
  useEffect(() => {
    document.title = 'Rebustle';
  }, []);

  if (!state || state.phase === 'landing' || state.phase === 'player-order') {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-6">
        <img src="/logo.svg" alt="Rebustle" className="w-full max-w-2xl" />
        <p className="text-stone-400 text-sm">Waiting for the Game Master to start...</p>
        <p className="text-stone-300 text-xs">
          Game Master opens <span className="font-mono text-stone-400">/gm</span> in their own browser window
        </p>
      </div>
    );
  }

  if (state.phase === 'winner') {
    const winner = [...state.players].sort((a, b) => b.score - a.score)[0];
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Game Over</p>
          <h1 className="text-7xl font-black text-white mb-2">{winner.name}</h1>
          <p className="text-indigo-400 text-2xl font-bold mb-10">wins with {winner.score} points!</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-sm mx-auto">
            <Scoreboard players={state.players} currentPlayerIndex={-1} />
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];

  return (
    <div className="min-h-screen bg-gray-950 flex gap-6 p-6">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

      {/* Main area */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Clue badge */}
        <div className="flex justify-center">
          <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
            {currentPuzzle.clue}
          </span>
        </div>

        {/* Puzzle image */}
        <div className="flex-1 flex items-center justify-center bg-white rounded-3xl overflow-hidden min-h-0">
          <img
            key={currentPuzzle.id}
            src={currentPuzzle.image}
            alt="Rebus puzzle"
            className="max-h-full max-w-full object-contain p-6"
          />
        </div>

        {/* Current player + timer */}
        <div className="bg-white/5 border border-white/10 rounded-3xl px-8 py-5 flex items-center justify-between">
          <div>
            {state.inBuffer ? (
              <>
                <p className="text-white/40 text-xs uppercase tracking-widest">Next Up</p>
                <p className="text-white font-black text-3xl">{currentPlayer.name}</p>
              </>
            ) : (
              <>
                <p className="text-white/40 text-xs uppercase tracking-widest">Now Playing</p>
                <p className="text-yellow-300 font-black text-3xl">{currentPlayer.name}</p>
              </>
            )}
          </div>

          <div className="flex flex-col items-center">
            {state.inBuffer ? (
              <p className="text-white/30 text-lg font-bold">Get ready...</p>
            ) : (
              <Timer
                running={state.timerRunning}
                onExpire={() => {
                  // Timer expiry is handled by the GM — game screen is display-only
                }}
                resetKey={timerResetKey}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar scoreboard */}
      <div className="w-52 flex flex-col gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest">Round</p>
          <p className="text-white font-black text-2xl">{state.currentRound}</p>
        </div>
        <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
      </div>
    </div>
  );
}
