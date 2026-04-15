import { useCallback, useRef, useState } from 'react';
import type { GameConfig, GameState, Player, Puzzle } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildInitialState(config: GameConfig, allPuzzles: Puzzle[]): GameState {
  return {
    phase: 'player-order',
    config,
    players: config.players.map((p) => ({ ...p, score: 0 })),
    puzzles: shuffle(allPuzzles),
    currentPuzzleIndex: 0,
    currentPlayerIndex: 0,
    currentRound: 1,
    attemptsThisRound: 0,
    timerRunning: false,
    timerResetKey: 0,
    showingAnswer: false,
    flashAnswer: '',
    inBuffer: false,
  };
}

export function useGameState(onStateChange: (state: GameState) => void) {
  const [state, setStateRaw] = useState<GameState | null>(null);
  // Keep a stable ref so timer callbacks always read latest state
  const stateRef = useRef<GameState | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bufferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setState = useCallback(
    (updater: GameState | ((prev: GameState) => GameState)) => {
      setStateRaw((prev) => {
        const next = typeof updater === 'function' ? updater(prev!) : updater;
        stateRef.current = next;
        onStateChange(next);
        return next;
      });
    },
    [onStateChange],
  );

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  const clearFlashTimer = () => {
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
  };

  const clearBufferTimer = () => {
    if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
  };

  const clearPendingTimers = () => {
    clearFlashTimer();
    clearBufferTimer();
  };

  /** Flash the answer for 1.2 s then run a callback */
  const flashAndThen = (answer: string, afterFlash: () => void) => {
    clearPendingTimers();
    setState((s) => ({ ...s, timerRunning: false, showingAnswer: true, flashAnswer: answer }));
    flashTimerRef.current = setTimeout(() => {
      setState((s) => ({ ...s, showingAnswer: false, flashAnswer: '' }));
      afterFlash();
    }, 1200);
  };

  /** Check win condition and return updated state phase */
  const checkWinner = (players: Player[], config: GameConfig, nextRound: number): 'playing' | 'winner' => {
    if (config.winCondition === 'points') {
      if (players.some((p) => p.score >= config.targetPoints)) return 'winner';
    } else {
      // rounds — nextRound is the round we're about to start
      if (nextRound > config.totalRounds) return 'winner';
    }
    return 'playing';
  };

  /** Advance to next puzzle, checking win condition */
  const advanceToNextPuzzle = (fromState: GameState) => {
    const nextPuzzleIndex = fromState.currentPuzzleIndex + 1;

    // Out of puzzles — game over regardless of win condition
    if (nextPuzzleIndex >= fromState.puzzles.length) {
      setState((s) => ({ ...s, phase: 'winner' }));
      return;
    }

    const nextPlayerIndex = (fromState.currentPlayerIndex + 1) % fromState.players.length;
    const isNewRound = nextPlayerIndex === 0;
    const nextRound = isNewRound ? fromState.currentRound + 1 : fromState.currentRound;

    const nextPhase = checkWinner(fromState.players, fromState.config, nextRound);

    if (nextPhase === 'winner') {
      setState((s) => ({ ...s, phase: 'winner' }));
      return;
    }

    enterBuffer({
      ...fromState,
      currentPuzzleIndex: nextPuzzleIndex,
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
      attemptsThisRound: 0,
    });
  };

  /** Advance to next player, same puzzle */
  const advanceToNextPlayer = (fromState: GameState) => {
    const nextPlayerIndex = (fromState.currentPlayerIndex + 1) % fromState.players.length;
    const isNewRound = nextPlayerIndex === 0;
    const nextRound = isNewRound ? fromState.currentRound + 1 : fromState.currentRound;

    // New round completed — check win condition (for rounds-based)
    const nextPhase = checkWinner(fromState.players, fromState.config, nextRound);
    if (nextPhase === 'winner') {
      setState((s) => ({ ...s, phase: 'winner' }));
      return;
    }

    const nextAttempts = fromState.attemptsThisRound + 1;

    enterBuffer({
      ...fromState,
      currentPlayerIndex: nextPlayerIndex,
      currentRound: nextRound,
      attemptsThisRound: nextAttempts,
    });
  };

  /** Show the "Next up" buffer for 1.5 s before starting the timer */
  const enterBuffer = (nextState: GameState) => {
    clearBufferTimer(); // only cancel a pending buffer — never interrupt an active flash
    // Always clear showingAnswer: afterFlash runs before React flushes the hide-answer
    // setState, so stateRef.current may still carry showingAnswer:true at this point.
    setState({ ...nextState, inBuffer: true, timerRunning: false, showingAnswer: false, flashAnswer: '' });
    bufferTimerRef.current = setTimeout(() => {
      setState((s) => ({ ...s, inBuffer: false, timerRunning: true, timerResetKey: s.timerResetKey + 1 }));
    }, 1500);
  };

  // ---------------------------------------------------------------------------
  // Public actions (called by GM screen)
  // ---------------------------------------------------------------------------

  const startGame = (config: GameConfig, allPuzzles: Puzzle[]) => {
    const initial = buildInitialState(config, allPuzzles);
    stateRef.current = initial;
    setState(initial);
  };

  const beginPlay = () => {
    // Called when GM clicks "Let's Go" on the player order screen
    if (!stateRef.current) return;
    enterBuffer({ ...stateRef.current, phase: 'playing' });
  };

  /** GM marks the current player's answer as correct */
  const markCorrect = () => {
    const s = stateRef.current;
    if (!s || s.showingAnswer || s.inBuffer) return;

    const updatedPlayers = s.players.map((p, i) =>
      i === s.currentPlayerIndex ? { ...p, score: p.score + 1 } : p,
    );

    // Check point-based win immediately after awarding point
    const nextPhase = checkWinner(updatedPlayers, s.config, s.currentRound);

    if (nextPhase === 'winner') {
      flashAndThen(s.puzzles[s.currentPuzzleIndex].answer, () => {
        setState((prev) => ({ ...prev, players: updatedPlayers, phase: 'winner' }));
      });
      return;
    }

    const updatedState = { ...s, players: updatedPlayers };
    flashAndThen(s.puzzles[s.currentPuzzleIndex].answer, () => {
      // Timer keeps running — just move to next puzzle, same player
      const nextPuzzleIndex = updatedState.currentPuzzleIndex + 1;
      if (nextPuzzleIndex >= updatedState.puzzles.length) {
        setState((prev) => ({ ...prev, players: updatedPlayers, phase: 'winner' }));
        return;
      }
      setState((prev) => ({
        ...prev,
        players: updatedPlayers,
        currentPuzzleIndex: nextPuzzleIndex,
        attemptsThisRound: 0,
        timerRunning: true,
        timerResetKey: prev.timerResetKey + 1,
      }));
    });
  };

  /**
   * Called when the 10s timer expires (from Timer component).
   * Advances to next player, same puzzle.
   * Guard against race condition where the deferred Timer callback fires
   * just after the GM clicked Correct/Skip (which started a flash).
   */
  const onTimerExpired = () => {
    const s = stateRef.current;
    if (!s || s.showingAnswer || s.inBuffer) return;
    advanceToNextPlayer(s);
  };

  /**
   * Skip the current puzzle. Only available after all players have
   * attempted the current puzzle in this round (attemptsThisRound >= player count).
   */
  const skipPuzzle = () => {
    const s = stateRef.current;
    if (!s || s.showingAnswer || s.inBuffer) return;
    flashAndThen(s.puzzles[s.currentPuzzleIndex].answer, () => {
      advanceToNextPuzzle(stateRef.current!);
    });
  };

  const canSkip = (s: GameState): boolean =>
    s.attemptsThisRound >= s.players.length && !s.showingAnswer && !s.inBuffer;

  /** GM ends the game immediately, jumping to the winner screen. */
  const endGame = () => {
    clearPendingTimers();
    setState((s) => ({ ...s!, phase: 'winner' }));
  };

  return {
    state,
    startGame,
    beginPlay,
    markCorrect,
    onTimerExpired,
    skipPuzzle,
    canSkip,
    endGame,
  };
}
