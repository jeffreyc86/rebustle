import { useCallback, useRef } from 'react';
import { AnswerFlash } from '../components/AnswerFlash';
import { PlayerOrder } from './PlayerOrder';
import { Scoreboard } from '../components/Scoreboard';
import { Timer } from '../components/Timer';
import { Landing } from './Landing';
import { WinnerScreen } from './WinnerScreen';
import { useBroadcastSender } from '../hooks/useBroadcast';
import { useGameState } from '../hooks/useGameState';
import { puzzles } from '../data/puzzles';
import type { GameConfig, GameState } from '../types';

export function GMScreen() {
  const timerResetKeyRef = useRef(0);
  const sendState = useBroadcastSender();

  const handleStateChange = useCallback(
    (state: GameState) => {
      sendState(state);
    },
    [sendState],
  );

  const { state, startGame, beginPlay, markCorrect, onTimerExpired, skipPuzzle, canSkip } =
    useGameState(handleStateChange);

  const handleStart = (config: GameConfig) => {
    startGame(config, puzzles);
  };

  const handleBegin = () => {
    timerResetKeyRef.current += 1;
    beginPlay();
  };

  const handleCorrect = () => {
    timerResetKeyRef.current += 1;
    markCorrect();
  };

  const handleTimerExpired = () => {
    timerResetKeyRef.current += 1;
    onTimerExpired();
  };

  // Phase: no game started yet
  if (!state || state.phase === 'landing') {
    return <Landing onStart={handleStart} />;
  }

  // Phase: show player order before game starts
  if (state.phase === 'player-order') {
    return <PlayerOrder state={state} onBegin={handleBegin} />;
  }

  // Phase: game over
  if (state.phase === 'winner') {
    return (
      <WinnerScreen
        state={state}
        onPlayAgain={() => {
          // Reset to landing — just reload for simplicity
          window.location.href = '/gm';
        }}
      />
    );
  }

  // Phase: playing
  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
  const skipAvailable = canSkip(state);

  return (
    <div className="min-h-screen bg-gray-950 flex gap-4 p-4">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

      {/* Left: puzzle + controls */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-white font-black text-xl">
            Re<span className="text-indigo-400">bus</span>tle
            <span className="text-white/30 font-normal text-sm ml-2">— Game Master</span>
          </h1>
          <div className="flex gap-2 text-xs text-white/30">
            <span>Round {state.currentRound}</span>
            <span>·</span>
            <span>Puzzle {state.currentPuzzleIndex + 1}/{state.puzzles.length}</span>
            {state.config.winCondition === 'points' && (
              <>
                <span>·</span>
                <span>First to {state.config.targetPoints} pts</span>
              </>
            )}
            {state.config.winCondition === 'rounds' && (
              <>
                <span>·</span>
                <span>{state.config.totalRounds} rounds total</span>
              </>
            )}
          </div>
        </div>

        {/* Clue */}
        <div className="flex justify-center">
          <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            {currentPuzzle.clue}
          </span>
        </div>

        {/* Puzzle image */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden min-h-0 flex items-center justify-center">
          <img
            key={currentPuzzle.id}
            src={currentPuzzle.image}
            alt="Rebus puzzle"
            className="max-h-full max-w-full object-contain p-4"
          />
        </div>

        {/* Answer (always visible to GM) */}
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl px-6 py-3 text-center">
          <p className="text-green-400/60 text-xs uppercase tracking-widest mb-0.5">Answer</p>
          <p className="text-green-300 font-black text-2xl tracking-wide">{currentPuzzle.answer}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleCorrect}
            disabled={state.showingAnswer || state.inBuffer}
            className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-black font-black text-lg py-4 rounded-2xl transition-all"
          >
            Correct ✓
          </button>
          <button
            onClick={skipPuzzle}
            disabled={!skipAvailable}
            title={!skipAvailable ? 'Available after all players attempt this puzzle' : 'Skip to next puzzle'}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 text-white font-bold text-lg py-4 rounded-2xl transition-all"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Right: current player + timer + scoreboard */}
      <div className="w-56 flex flex-col gap-4">
        {/* Current player */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          {state.inBuffer ? (
            <>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Next Up</p>
              <p className="text-white font-black text-2xl">{currentPlayer.name}</p>
              <p className="text-white/30 text-sm mt-1">Get ready...</p>
            </>
          ) : (
            <>
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Now Playing</p>
              <p className="text-yellow-300 font-black text-2xl">{currentPlayer.name}</p>
            </>
          )}
        </div>

        {/* Timer */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-center">
          {state.inBuffer ? (
            <p className="text-white/20 text-4xl font-black">—</p>
          ) : (
            <Timer
              running={state.timerRunning}
              onExpire={handleTimerExpired}
              resetKey={timerResetKeyRef.current}
            />
          )}
        </div>

        {/* Scoreboard */}
        <div className="flex-1">
          <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
        </div>

        {/* Skip availability hint */}
        {!skipAvailable && !state.inBuffer && (
          <p className="text-white/20 text-xs text-center">
            Skip unlocks after all {state.players.length} players attempt this puzzle
            ({state.players.length - state.attemptsThisRound} left)
          </p>
        )}
      </div>
    </div>
  );
}
