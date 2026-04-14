import { useState } from 'react';
import type { GameConfig, Player, WinCondition } from '../types';
import { puzzles } from '../data/puzzles';

interface LandingProps {
  onStart: (config: GameConfig) => void;
}

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 15;

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export function Landing({ onStart }: LandingProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', '']);
  const [winCondition, setWinCondition] = useState<WinCondition>('points');
  const [targetPoints, setTargetPoints] = useState(10);
  const [totalRounds, setTotalRounds] = useState(5);
  const [errors, setErrors] = useState<string[]>([]);

  const addPlayer = () => {
    if (playerNames.length < MAX_PLAYERS) {
      setPlayerNames((prev) => [...prev, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > MIN_PLAYERS) {
      setPlayerNames((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, value: string) => {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? value : n)));
    if (value.trim()) {
      setErrors((prev) => prev.map((e, i) => (i === index ? '' : e)));
    }
  };

  const validate = (): boolean => {
    const newErrors = playerNames.map((name) => (name.trim() ? '' : 'Name required'));
    const hasDuplicates = playerNames.some(
      (name, i) =>
        name.trim() &&
        playerNames.findIndex((n, j) => j !== i && n.trim().toLowerCase() === name.trim().toLowerCase()) !== -1,
    );
    if (hasDuplicates) {
      setErrors(
        playerNames.map((name) => {
          const isDup =
            playerNames.filter((n) => n.trim().toLowerCase() === name.trim().toLowerCase()).length > 1;
          return isDup ? 'Duplicate name' : '';
        }),
      );
      return false;
    }
    setErrors(newErrors);
    return newErrors.every((e) => !e);
  };

  const handleStart = () => {
    if (!validate()) return;

    const players: Player[] = playerNames.map((name) => ({
      id: generateId(),
      name: name.trim(),
      score: 0,
    }));

    const config: GameConfig = {
      players,
      winCondition,
      targetPoints,
      totalRounds,
      puzzlePack: 'all',
    };

    onStart(config);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="Rebustle" className="w-full max-w-md mx-auto" />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 border border-stone-100">
          {/* Players */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">
                Players ({playerNames.length}/{MAX_PLAYERS})
              </label>
              {playerNames.length < MAX_PLAYERS && (
                <button
                  onClick={addPlayer}
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#0099E6' }}
                >
                  + Add player
                </button>
              )}
            </div>
            <div className="space-y-2">
              {playerNames.map((name, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateName(index, e.target.value)}
                      placeholder={`Player ${index + 1}`}
                      maxLength={20}
                      className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-stone-800 placeholder-stone-300 text-sm outline-none focus:ring-2 transition-all ${
                        errors[index]
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-stone-200 focus:ring-orange-200 focus:border-orange-400'
                      }`}
                    />
                    {errors[index] && (
                      <p className="text-red-500 text-xs mt-1 ml-1">{errors[index]}</p>
                    )}
                  </div>
                  {playerNames.length > MIN_PLAYERS && (
                    <button
                      onClick={() => removePlayer(index)}
                      className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none pb-0.5"
                      aria-label="Remove player"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Win Condition */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-3">
              Win Condition
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['points', 'rounds'] as WinCondition[]).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setWinCondition(cond)}
                  className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={
                    winCondition === cond
                      ? { background: '#FF6B2B', color: 'white' }
                      : { background: '#f5f5f4', color: '#78716c' }
                  }
                >
                  {cond === 'points' ? 'First to X Points' : 'Play N Rounds'}
                </button>
              ))}
            </div>

            {winCondition === 'points' ? (
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-sm w-28">Target points</span>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: '#FF6B2B' }}
                />
                <span className="font-black text-xl w-8 text-right" style={{ color: '#FF6B2B' }}>
                  {targetPoints}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-sm w-28">Total rounds</span>
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="flex-1"
                  style={{ accentColor: '#FF6B2B' }}
                />
                <span className="font-black text-xl w-8 text-right" style={{ color: '#FF6B2B' }}>
                  {totalRounds}
                </span>
              </div>
            )}
            <p className="text-stone-400 text-xs mt-2">
              {winCondition === 'points'
                ? `Game ends when a player reaches ${targetPoints} points, or when all puzzles are used.`
                : `Game ends after ${totalRounds} rounds, or when a player reaches the most points.`}
            </p>
          </div>

          {/* Puzzle count notice */}
          <p className="text-stone-300 text-xs text-center">
            {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''} loaded
          </p>

          {/* Start */}
          <button
            onClick={handleStart}
            className="w-full active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
            style={{ background: '#00A878' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#009969')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#00A878')}
          >
            Start Game →
          </button>
        </div>

        {/* GM link hint */}
        <p className="text-center text-stone-400 text-xs mt-4">
          Game Master controls open at <span className="font-mono text-stone-500">/gm</span>
        </p>
      </div>
    </div>
  );
}
