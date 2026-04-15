export const ClueType = {
  CommonPhrase: 'Common Phrase',
  Word: 'Word',
  Thing: 'Thing',
  Person: 'Person',
  Place: 'Place',
  Movie: 'Movie',
  Song: 'Song',
  TVShow: 'TV Show',
  ChristmasMovie: 'Christmas Movie',
  Food: 'Food',
  Music: 'Music',
  Sport: 'Sport',
} as const;

export type ClueType = (typeof ClueType)[keyof typeof ClueType];

export interface Puzzle {
  id: string;
  image: string;
  answer: string;
  clue: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type WinCondition = 'points' | 'rounds';

export interface GameConfig {
  players: Player[];
  winCondition: WinCondition;
  targetPoints: number;
  totalRounds: number;
  puzzlePack: string;
}

export type GamePhase =
  | 'landing'
  | 'player-order'
  | 'playing'
  | 'winner';

export interface GameState {
  phase: GamePhase;
  config: GameConfig;
  players: Player[];
  puzzles: Puzzle[];
  currentPuzzleIndex: number;
  currentPlayerIndex: number;
  currentRound: number;
  // Track how many players have attempted the current puzzle this round
  // so we know when the Skip button becomes available
  attemptsThisRound: number;
  // Timer state
  timerRunning: boolean;
  // Answer flash
  showingAnswer: boolean;
  flashAnswer: string;
  // Whether we're in the pre-turn buffer (showing "Next up")
  inBuffer: boolean;
}

// Messages sent over BroadcastChannel from GM → Game screen
export type BroadcastMessage =
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'INIT_REQUEST' }
  | { type: 'GAME_RESET' };
