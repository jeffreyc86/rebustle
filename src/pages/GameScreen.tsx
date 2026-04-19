import { useEffect, useRef, useState } from 'react';
import { AnswerFlash } from '../components/AnswerFlash';
import { Confetti } from '../components/Confetti';
import { Overlay } from '../components/Overlay';
import { Scoreboard } from '../components/Scoreboard';
import { Timer } from '../components/Timer';
import { playerColor } from '../constants/colors';
import { useBroadcastReceiver } from '../hooks/useBroadcast';
import { useSound } from '../hooks/useSound';
import type { GameState } from '../types';

export function GameScreen() {
  const [state, setState] = useState<GameState | null>(null);
  const { playCorrect, playBuzz, playTick } = useSound();
  const prevPlayersRef = useRef<GameState['players'] | null>(null);

  useBroadcastReceiver(
    (incoming) => {
      // Ding when answer flash appears and a score went up (correct, not skip)
      if (incoming.showingAnswer && !state?.showingAnswer) {
        const prev = prevPlayersRef.current;
        if (prev && incoming.players.some((p, i) => p.score > (prev[i]?.score ?? 0))) {
          playCorrect();
        }
      }
      prevPlayersRef.current = incoming.players;
      setState(incoming);
    },
    () => { prevPlayersRef.current = null; setState(null); },
  );

  useEffect(() => {
    document.title = 'Rebustle';
  }, []);

  // Preload next puzzle image
  useEffect(() => {
    if (!state || state.phase !== 'playing') return;
    const next = state.puzzles[state.currentPuzzleIndex + 1];
    if (!next) return;
    const img = new Image();
    img.src = next.image;
  }, [state?.currentPuzzleIndex, state?.puzzles]);

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
      <>
      <Confetti />
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
              <p className="text-2xl font-bold mb-10" style={{ color: '#00A878' }}>wins with {winner.score} points!</p>
            </>
          )}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-sm mx-auto shadow-sm">
            <Scoreboard players={state.players} currentPlayerIndex={-1} />
          </div>
        </div>
      </div>
      </>
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col gap-4 p-6">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

      <Overlay visible={state.paused}>
        <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">Game Paused</p>
        <p className="text-4xl font-black text-stone-800">⏸</p>
      </Overlay>

      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="flex-1 flex items-center justify-center">
          <img src="/logo-text.svg" alt="Rebustle" className="h-16 w-auto" />
        </div>
        <div className="w-52 bg-white border border-stone-200 rounded-2xl px-4 py-3 text-center shadow-sm shrink-0">
          <p className="text-stone-400 text-xs uppercase tracking-widest">Round</p>
          <p className="text-stone-800 font-black text-2xl">{state.currentRound}</p>
        </div>
      </div>

      {/* Content row */}
      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Puzzle image */}
          <div className="flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-stone-200 relative overflow-hidden">
            <div className="absolute inset-0 flex flex-col items-center gap-4 p-6">
              <img
                key={currentPuzzle.id}
                src={currentPuzzle.image}
                alt="Rebus puzzle"
                className="min-h-0 flex-1 w-full object-contain"
              />
              <span
                className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
                style={{ background: '#0099E618', color: '#0099E6', border: '1px solid #0099E630' }}
              >
                {currentPuzzle.clue}
              </span>
            </div>
          </div>

          <Overlay visible={state.inBuffer}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2 text-stone-400">Next Up</p>
            <p className="text-4xl font-black uppercase tracking-wide" style={{ color: playerColor(state.currentPlayerIndex) }}>
              {currentPlayer.name}
            </p>
          </Overlay>

          {/* Player + timer bar */}
          <div className="bg-white border border-stone-200 rounded-3xl px-8 py-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-stone-400 text-xs uppercase tracking-widest">Now Playing</p>
              <p className="font-black text-3xl" style={{ color: playerColor(state.currentPlayerIndex) }}>{currentPlayer.name}</p>
            </div>
            <Timer
              running={state.timerRunning}
              resetKey={state.timerResetKey}
              onExpire={playBuzz}
              onTick={playTick}
              durationSeconds={state.config.timerDuration}
            />
          </div>
        </div>

        {/* Scoreboard */}
        <div className="w-52 shrink-0">
          <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
        </div>
      </div>
    </div>
  );
}
