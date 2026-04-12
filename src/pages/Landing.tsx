import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
      setErrors(playerNames.map((name) => {
        const isDup = playerNames.filter((n) => n.trim().toLowerCase() === name.trim().toLowerCase()).length > 1;
        return isDup ? 'Duplicate name' : '';
      }));
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
    };

    onStart(config);
    navigate('/gm');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black tracking-tight text-white mb-2">
            Re<span className="text-indigo-400">bus</span>tle
          </h1>
          <p className="text-white/40 text-sm">The rebus puzzle party game</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
          {/* Players */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-widest text-white/40">
                Players ({playerNames.length}/{MAX_PLAYERS})
              </label>
              {playerNames.length < MAX_PLAYERS && (
                <button
                  onClick={addPlayer}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
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
                      className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm outline-none focus:ring-2 transition-all ${
                        errors[index]
                          ? 'border-red-500/60 focus:ring-red-500/30'
                          : 'border-white/10 focus:ring-indigo-500/40 focus:border-indigo-500/40'
                      }`}
                    />
                    {errors[index] && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{errors[index]}</p>
                    )}
                  </div>
                  {playerNames.length > MIN_PLAYERS && (
                    <button
                      onClick={() => removePlayer(index)}
                      className="text-white/20 hover:text-red-400 transition-colors text-lg leading-none pb-0.5"
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
            <label className="text-xs font-bold uppercase tracking-widest text-white/40 block mb-3">
              Win Condition
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['points', 'rounds'] as WinCondition[]).map((cond) => (
                <button
                  key={cond}
                  onClick={() => setWinCondition(cond)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    winCondition === cond
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cond === 'points' ? 'First to X Points' : 'Play N Rounds'}
                </button>
              ))}
            </div>

            {winCondition === 'points' ? (
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-sm w-28">Target points</span>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value))}
                  className="flex-1 accent-indigo-400"
                />
                <span className="text-white font-black text-xl w-8 text-right">{targetPoints}</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-sm w-28">Total rounds</span>
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="flex-1 accent-indigo-400"
                />
                <span className="text-white font-black text-xl w-8 text-right">{totalRounds}</span>
              </div>
            )}
            <p className="text-white/25 text-xs mt-2">
              {winCondition === 'points'
                ? `Game ends when a player reaches ${targetPoints} points, or when all puzzles are used.`
                : `Game ends after ${totalRounds} rounds, or when a player reaches the most points.`}
            </p>
          </div>

          {/* Puzzle count notice */}
          <p className="text-white/20 text-xs text-center">
            {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''} loaded
          </p>

          {/* Start */}
          <button
            onClick={handleStart}
            className="w-full bg-indigo-500 hover:bg-indigo-400 active:scale-95 text-white font-black text-lg py-4 rounded-2xl transition-all"
          >
            Start Game →
          </button>
        </div>

        {/* GM link hint */}
        <p className="text-center text-white/20 text-xs mt-4">
          Game Master controls open at <span className="font-mono text-white/30">/gm</span>
        </p>
      </div>
    </div>
  );
}
