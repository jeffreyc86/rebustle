import type { GameConfig, GameState, Player } from '../types';

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function checkWinner(players: Player[], config: GameConfig, nextRound: number): 'playing' | 'winner' {
  if (config.winCondition === 'points') {
    if (players.some((p) => p.score >= config.targetPoints)) return 'winner';
  } else {
    if (nextRound > config.totalRounds) return 'winner';
  }
  return 'playing';
}

export function allPlayersAttempted(state: GameState): boolean {
  return state.attemptsThisRound >= state.players.length;
}
