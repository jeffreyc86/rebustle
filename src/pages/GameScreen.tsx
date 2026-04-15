import { useEffect, useState } from 'react';
import { AnswerFlash } from '../components/AnswerFlash';
import { Scoreboard } from '../components/Scoreboard';
import { Timer } from '../components/Timer';
import { useBroadcastReceiver } from '../hooks/useBroadcast';
import type { GameState } from '../types';

export function GameScreen() {
  const [state, setState] = useState<GameState | null>(null);

  useBroadcastReceiver(
    (incoming) => {
      setState(incoming);
    },
    () => {
      // GM refreshed — reset display back to waiting screen
      setState(null);
    },
  );

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
    const sorted = [...state.players].sort((a, b) => b.score - a.score);
    const winner = sorted[0];
    const isTie = sorted.length > 1 && sorted[0].score === sorted[1].score;
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-6">
            <img src="/logo.svg" alt="Rebustle" className="w-full max-w-sm mx-auto" />
          </div>
          <p className="text-stone-400 text-xs uppercase tracking-widest mb-4">Game Over</p>
          {isTie ? (
            <>
              <h1 className="text-7xl font-black text-stone-800 mb-2">It's a Tie!</h1>
              <p className="text-2xl font-bold mb-10" style={{ color: '#00A878' }}>
                {sorted.filter((p) => p.score === winner.score).map((p) => p.name).join(' & ')}
                {' '}— {winner.score} pts each
              </p>
            </>
          ) : (
            <>
              <h1 className="text-7xl font-black text-stone-800 mb-2">{winner.name}</h1>
              <p className="text-2xl font-bold mb-10" style={{ color: '#00A878' }}>
                wins with {winner.score} points!
              </p>
            </>
          )}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-sm mx-auto shadow-sm">
            <Scoreboard players={state.players} currentPlayerIndex={-1} />
          </div>
        </div>
      </div>
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];

  return (
    <div className="min-h-screen bg-stone-100 flex gap-6 p-6">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

      {/* Main area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-center">
          <img src="/logo-text.svg" alt="Rebustle" className="h-10 w-auto" />
        </div>

        {/* Puzzle image */}
        <div className="flex-1 bg-white rounded-3xl overflow-hidden min-h-0 shadow-sm border border-stone-200 flex items-center justify-center">
          <img
            key={currentPuzzle.id}
            src={currentPuzzle.image}
            alt="Rebus puzzle"
            className="max-h-full max-w-full object-contain p-6"
          />
        </div>

        {/* Clue badge below puzzle */}
        <div className="flex justify-center">
          <span
            className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            style={{ background: '#0099E6', color: 'white' }}
          >
            {currentPuzzle.clue}
          </span>
        </div>

        {/* Current player + timer */}
        <div className="bg-white border border-stone-200 rounded-3xl px-8 py-5 flex items-center justify-between shadow-sm">
          <div>
            {state.inBuffer ? (
              <>
                <p className="text-stone-400 text-xs uppercase tracking-widest">Next Up</p>
                <p className="text-stone-800 font-black text-3xl">{currentPlayer.name}</p>
              </>
            ) : (
              <>
                <p className="text-stone-400 text-xs uppercase tracking-widest">Now Playing</p>
                <p className="font-black text-3xl" style={{ color: '#FF6B2B' }}>{currentPlayer.name}</p>
              </>
            )}
          </div>

          <div className="flex flex-col items-center">
            {state.inBuffer ? (
              <p className="text-stone-300 text-lg font-bold">Get ready...</p>
            ) : (
              <Timer
                running={state.timerRunning}
                onExpire={() => {
                  // Timer expiry is handled by the GM — game screen is display-only
                }}
                resetKey={state.timerResetKey}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sidebar scoreboard */}
      <div className="w-52 flex flex-col gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-center shadow-sm">
          <p className="text-stone-400 text-xs uppercase tracking-widest">Round</p>
          <p className="text-stone-800 font-black text-2xl">{state.currentRound}</p>
        </div>
        <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
      </div>
    </div>
  );
}
