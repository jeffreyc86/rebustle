import { useCallback, useState } from 'react';
import { playerColor } from '../constants/colors';
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
  const [savedConfig, setSavedConfig] = useState<GameConfig | undefined>(undefined);

  const handleStateChange = useCallback(
    (state: GameState) => {
      sendState(state);
    },
    [sendState],
  );

  const { state, startGame, resetToLanding, beginPlay, markCorrect, onTimerExpired, skipPuzzle, allPlayersAttempted, togglePause, endGame } =
    useGameState(handleStateChange);

  const handleStart = (config: GameConfig) => {
    setSavedConfig(config);
    startGame(config, puzzles);
  };

  const handleEndGame = () => {
    setShowEndConfirm(false);
    endGame();
  };

  if (!state || state.phase === 'landing') {
    return <Landing onStart={handleStart} initialConfig={savedConfig} />;
  }

  if (state.phase === 'player-order') {
    return (
      <PlayerOrder
        state={state}
        onBegin={beginPlay}
        onBack={resetToLanding}
      />
    );
  }

  if (state.phase === 'winner') {
    return (
      <WinnerScreen
        state={state}
        onPlayAgain={() => startGame(state.config, puzzles)}
        onResetPlayers={resetToLanding}
      />
    );
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const currentPuzzle = state.puzzles[state.currentPuzzleIndex];
  const everyoneAttempted = allPlayersAttempted(state);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col gap-4 p-4">
      <AnswerFlash answer={state.flashAnswer} visible={state.showingAnswer} />

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo-text.svg" alt="Rebustle" className="h-10 w-auto" />
          <span className="text-stone-300 text-sm">•</span>
          <span
            className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg"
            style={{ background: '#FF6B2B18', color: '#FF6B2B', border: '1px solid #FF6B2B30' }}
          >
            Game Master
          </span>
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
            onClick={togglePause}
            disabled={state.inBuffer}
            className="ml-2 active:scale-95 disabled:opacity-30 font-bold text-xs px-3 py-1.5 rounded-lg transition-all border"
            style={state.paused
              ? { background: '#FF6B2B18', color: '#FF6B2B', borderColor: '#FF6B2B40' }
              : { background: '#f5f5f4', color: '#78716c', borderColor: '#e7e5e4' }}
          >
            {state.paused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={() => setShowEndConfirm(true)}
            className="ml-2 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ background: '#ef4444' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#dc2626')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#ef4444')}
          >
            End Game
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-white rounded-2xl overflow-hidden min-h-0 flex items-center justify-center p-4 shadow-sm border border-stone-200">
            <div className="flex flex-col items-center gap-3 h-full w-full min-h-0">
              <img
                key={currentPuzzle.id}
                src={currentPuzzle.image}
                alt="Rebus puzzle"
                className="flex-1 max-h-full max-w-full object-contain min-h-0"
              />
              <span
                className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shrink-0"
                style={{ background: '#0099E618', color: '#0099E6', border: '1px solid #0099E630' }}
              >
                {currentPuzzle.clue}
              </span>
            </div>
          </div>

          <div className="rounded-2xl px-6 py-3 text-center border"
            style={{ background: '#00A87812', borderColor: '#00A87830' }}>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: '#00A878' }}>Answer</p>
            <p className="font-black text-2xl tracking-wide" style={{ color: '#009969' }}>{currentPuzzle.answer}</p>
            {!state.inBuffer && (
              <p className="text-xs font-semibold mt-1.5" style={everyoneAttempted ? { color: '#00A878' } : { color: '#a8a29e' }}>
                {everyoneAttempted
                  ? '✓ All players have had a turn'
                  : `${state.players.length - state.attemptsThisRound} player${state.players.length - state.attemptsThisRound === 1 ? '' : 's'} yet to attempt`}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={markCorrect}
              disabled={state.showingAnswer || state.inBuffer || state.paused}
              className="flex-1 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
              style={{ background: '#00A878' }}
              onMouseEnter={(e) => { if (!state.showingAnswer && !state.inBuffer && !state.paused) e.currentTarget.style.background = '#009969'; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#00A878')}
            >
              Correct ✓
            </button>
            <button
              onClick={skipPuzzle}
              disabled={state.showingAnswer || state.inBuffer || state.paused}
              className="flex-1 bg-stone-200 hover:bg-stone-300 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 text-stone-600 font-bold text-lg py-4 rounded-2xl transition-all"
            >
              Skip →
            </button>
          </div>
        </div>

        <div className="w-56 flex flex-col gap-4">
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
                <p className="font-black text-2xl" style={{ color: playerColor(state.currentPlayerIndex) }}>{currentPlayer.name}</p>
              </>
            )}
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center justify-center shadow-sm">
            {state.inBuffer ? (
              <p className="text-stone-300 text-4xl font-black">—</p>
            ) : (
              <Timer
                running={state.timerRunning}
                onExpire={onTimerExpired}
                resetKey={state.timerResetKey}
              />
            )}
          </div>

          <div className="flex-1">
            <Scoreboard players={state.players} currentPlayerIndex={state.currentPlayerIndex} />
          </div>

        </div>
      </div>
    </div>
  );
}
