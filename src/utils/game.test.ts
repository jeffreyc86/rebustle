import { describe, expect, it } from 'vitest';
import type { GameConfig, GameState } from '../types';
import { allPlayersAttempted, checkWinner, shuffle } from './game';
import { playerColor, PLAYER_COLORS } from '../constants/colors';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr)).toHaveLength(arr.length);
  });

  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffle(arr).sort()).toEqual([...arr].sort());
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3];
    const copy = [...arr];
    shuffle(arr);
    expect(arr).toEqual(copy);
  });
});

describe('checkWinner', () => {
  const pointsConfig: GameConfig = {
    players: [],
    winCondition: 'points',
    targetPoints: 5,
    totalRounds: 10,
    categories: [],
  };

  const roundsConfig: GameConfig = {
    players: [],
    winCondition: 'rounds',
    targetPoints: 5,
    totalRounds: 3,
    categories: [],
  };

  it('returns winner when a player meets the points target', () => {
    const players = [{ id: '1', name: 'Alice', score: 5 }];
    expect(checkWinner(players, pointsConfig, 1)).toBe('winner');
  });

  it('returns playing when no player has reached the points target', () => {
    const players = [{ id: '1', name: 'Alice', score: 4 }];
    expect(checkWinner(players, pointsConfig, 1)).toBe('playing');
  });

  it('returns winner when next round exceeds total rounds', () => {
    const players = [{ id: '1', name: 'Alice', score: 0 }];
    expect(checkWinner(players, roundsConfig, 4)).toBe('winner');
  });

  it('returns playing when next round equals total rounds', () => {
    const players = [{ id: '1', name: 'Alice', score: 0 }];
    expect(checkWinner(players, roundsConfig, 3)).toBe('playing');
  });
});

describe('allPlayersAttempted', () => {
  const baseState = {
    players: [
      { id: '1', name: 'Alice', score: 0 },
      { id: '2', name: 'Bob', score: 0 },
    ],
  } as unknown as GameState;

  it('returns true when attemptsThisRound equals player count', () => {
    expect(allPlayersAttempted({ ...baseState, attemptsThisRound: 2 })).toBe(true);
  });

  it('returns true when attemptsThisRound exceeds player count', () => {
    expect(allPlayersAttempted({ ...baseState, attemptsThisRound: 3 })).toBe(true);
  });

  it('returns false when not all players have attempted', () => {
    expect(allPlayersAttempted({ ...baseState, attemptsThisRound: 1 })).toBe(false);
  });
});

describe('playerColor', () => {
  it('returns the color at the given index', () => {
    expect(playerColor(0)).toBe(PLAYER_COLORS[0]);
    expect(playerColor(1)).toBe(PLAYER_COLORS[1]);
  });

  it('wraps around when index exceeds color count', () => {
    expect(playerColor(PLAYER_COLORS.length)).toBe(PLAYER_COLORS[0]);
    expect(playerColor(PLAYER_COLORS.length + 1)).toBe(PLAYER_COLORS[1]);
  });
});
