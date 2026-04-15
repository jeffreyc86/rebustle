import { useCallback, useState } from 'react';
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
  const sendState = useBroadcastSender();
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleStateChange = useCallback(
    (state: GameState) => {
      sendState(state);
    },
    [sendState],
  );

  const { state, startGame, beginPlay, markCorrect, onTimerExpired, skipPuzzle, canSkip, endGame } =
    useGameState(handleStateChange);

  const handleStart = (config: GameConfig) => {
    startGame(config, puzzles);
  };

  const handleBegin = () => {
    beginPlay();
  };

  const handleCorrect = () => {
    markCorrect();
  };

  const handleTimerExpired = () => {
    onTimerExpired();
  };

  const handleEndGame = () => {
    setShowEndConfirm(false);
    endGame();
  };

  // Phase: no game started yet
  if (!state || state.phase === 'landing') {
    return <Landing onStart={handleStart} />;
  }

  // Phase: show player order before game starts
  if (state.phase === 'player-order') {
    return (
      <PlayerOrder
        state={state}
        onBegin={handleBegin}
        onBack={() => window.location.reload()}
      />
    );
  }

  // Phase: game over
  if (state.phase === 'winner') {
    return (
      <WinnerScreen
        state={state}
        onPlayAgain={() => {
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
    <div className="min-h-screen bg-stone-100 flex gap-4 p-4">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

      {/* End game confirmation overlay */}
      {showEndConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 p-8 max-w-sm w-full text-center mx-4">
            <p className="text-stone-800 font-black text-xl mb-2">End the game?</p>
            <p className="text-stone-400 text-sm mb-6">This will jump straight to the winner screen.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 font-bold py-3 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEndGame}
                className="flex-1 active:scale-95 text-white font-bold py-3 rounded-2xl transition-all"
                style={{ background: '#FF6B2B' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#e55a1f')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#FF6B2B')}
              >
                End Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left: puzzle + controls */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-text.svg" alt="Rebustle" className="h-10 w-auto" />
            <span className="text-stone-400 font-normal text-sm">— Game Master</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-400">
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
            <button
              onClick={() => setShowEndConfirm(true)}
              className="ml-2 text-stone-300 hover:text-stone-500 transition-colors font-semibold"
            >
              End Game
            </button>
          </div>
        </div>

        {/* Clue */}
        <div className="flex justify-center">
          <span
            className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{ background: '#0099E618', color: '#0099E6', border: '1px solid #0099E630' }}
          >
            {currentPuzzle.clue}
          </span>
        </div>

        {/* Puzzle image */}
        <div className="flex-1 bg-white rounded-2xl overflow-hidden min-h-0 flex items-center justify-center shadow-sm border border-stone-200">
          <img
            key={currentPuzzle.id}
            src={currentPuzzle.image}
            alt="Rebus puzzle"
            className="max-h-full max-w-full object-contain p-4"
          />
        </div>

        {/* Answer (always visible to GM) */}
        <div className="rounded-2xl px-6 py-3 text-center border"
          style={{ background: '#00A87812', borderColor: '#00A87830' }}>
          <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#00A878' }}>Answer</p>
          <p className="font-black text-2xl tracking-wide" style={{ color: '#009969' }}>{currentPuzzle.answer}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={handleCorrect}
            disabled={state.showingAnswer || state.inBuffer}
            className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
            style={{ background: '#00A878' }}
            onMouseEnter={(e) => { if (!state.showingAnswer && !state.inBuffer) e.currentTarget.style.background = '#009969'; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00A878')}
          >
            Correct ✓
          </button>
          <button
            onClick={skipPuzzle}
            disabled={!skipAvailable}
            title={!skipAvailable ? 'Available after all players attempt this puzzle' : 'Skip to next puzzle'}
            className="flex-1 bg-stone-200 hover:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-stone-600 font-bold text-lg py-4 rounded-2xl transition-all"
          >
            Skip →
          </button>
        </div>
      </div>

      {/* Right: current player + timer + scoreboard */}
      <div className="w-56 flex flex-col gap-4">
        {/* Current player */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 text-center shadow-sm">
          {state.inBuffer ? (
            <>
              <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Next Up</p>
              <p className="text-stone-800 font-black text-2xl">{currentPlayer.name}</p>
              <p className="text-stone-300 text-sm mt-1">Get ready...</p>
            </>
          ) : (
            <>
              <p className="text-stone-400 text-xs uppercase tracking-widest mb-1">Now Playing</p>
              <p className="font-black text-2xl" style={{ color: '#FF6B2B' }}>{currentPlayer.name}</p>
            </>
          )}
        </div>

        {/* Timer */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-center shadow-sm">
          {state.inBuffer ? (
            <p className="text-stone-300 text-4xl font-black">—</p>
          ) : (
            <Timer
              running={state.timerRunning}
              onExpire={handleTimerExpired}
              resetKey={state.timerResetKey}
            />
          )}
        </div>

        {/* Scoreboard */}
        <div className="flex-1">
          <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
        </div>

        {/* Skip availability hint */}
        {!skipAvailable && !state.inBuffer && (
          <p className="text-stone-400 text-xs text-center">
            Skip unlocks after all {state.players.length} players attempt this puzzle
            ({state.players.length - state.attemptsThisRound} left)
          </p>
        )}
      </div>
    </div>
  );
}
