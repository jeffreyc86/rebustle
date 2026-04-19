import { useState } from 'react';
import { Button } from '../components/Button';
import { puzzles } from '../data/puzzles';
import type { GameConfig, Player, WinCondition } from '../types';

interface LandingProps {
  onStart: (config: GameConfig) => void;
  initialConfig?: GameConfig;
}

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 15;
const TIMER_OPTIONS = [10, 15, 20, 30];

export function Landing({ onStart, initialConfig }: LandingProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(
    initialConfig ? initialConfig.players.map((p) => p.name) : ['', ''],
  );
  const [winCondition, setWinCondition] = useState<WinCondition>(initialConfig?.winCondition ?? 'points');
  const [targetPoints, setTargetPoints] = useState(initialConfig?.targetPoints ?? 10);
  const [totalRounds, setTotalRounds] = useState(initialConfig?.totalRounds ?? 5);
  const [timerDuration, setTimerDuration] = useState(initialConfig?.timerDuration ?? 10);
  const [errors, setErrors] = useState<string[]>([]);

  const addPlayer = () => {
    if (playerNames.length < MAX_PLAYERS) setPlayerNames((prev) => [...prev, '']);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > MIN_PLAYERS) {
      setPlayerNames((prev) => prev.filter((_, i) => i !== index));
      setErrors((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, value: string) => {
    setPlayerNames((prev) => prev.map((n, i) => (i === index ? value : n)));
    if (value.trim()) setErrors((prev) => prev.map((e, i) => (i === index ? '' : e)));
  };

  const validate = (): boolean => {
    const hasDuplicates = playerNames.some(
      (name, i) =>
        name.trim() &&
        playerNames.findIndex((n, j) => j !== i && n.trim().toLowerCase() === name.trim().toLowerCase()) !== -1,
    );
    if (hasDuplicates) {
      setErrors(
        playerNames.map((name) =>
          playerNames.filter((n) => n.trim().toLowerCase() === name.trim().toLowerCase()).length > 1
            ? 'Duplicate name'
            : '',
        ),
      );
      return false;
    }
    const newErrors = playerNames.map((name) => (name.trim() ? '' : 'Name required'));
    setErrors(newErrors);
    return newErrors.every((e) => !e);
  };

  const handleStart = () => {
    if (!validate()) return;
    const players: Player[] = playerNames.map((name) => ({
      id: crypto.randomUUID(),
      name: name.trim(),
      score: 0,
    }));
    onStart({ players, winCondition, targetPoints, totalRounds, timerDuration });
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
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
                      className={`w-full bg-white border rounded-xl px-4 py-2.5 text-stone-800 placeholder-stone-300 text-sm outline-none focus:ring-2 transition-all ${
                        errors[index]
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-stone-200 focus:ring-orange-200 focus:border-orange-400'
                      }`}
                    />
                    {errors[index] && <p className="text-red-500 text-xs mt-1 ml-1">{errors[index]}</p>}
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
                <Button
                  key={cond}
                  variant={winCondition === cond ? 'orange' : 'stone'}
                  onClick={() => setWinCondition(cond)}
                  className="py-2.5 text-sm"
                >
                  {cond === 'points' ? 'First to X Points' : 'Play N Rounds'}
                </Button>
              ))}
            </div>

            {winCondition === 'points' ? (
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-sm w-28">Target points</span>
                <input
                  type="range" min={3} max={25} value={targetPoints}
                  onChange={(e) => setTargetPoints(Number(e.target.value))}
                  className="flex-1" style={{ accentColor: '#FF6B2B' }}
                />
                <span className="font-black text-xl w-8 text-right" style={{ color: '#FF6B2B' }}>{targetPoints}</span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-sm w-28">Total rounds</span>
                <input
                  type="range" min={2} max={15} value={totalRounds}
                  onChange={(e) => setTotalRounds(Number(e.target.value))}
                  className="flex-1" style={{ accentColor: '#FF6B2B' }}
                />
                <span className="font-black text-xl w-8 text-right" style={{ color: '#FF6B2B' }}>{totalRounds}</span>
              </div>
            )}
            <p className="text-stone-400 text-xs mt-2">
              {winCondition === 'points'
                ? `Game ends when a player reaches ${targetPoints} points, or when all puzzles are used.`
                : `Game ends after ${totalRounds} rounds, or when all puzzles are used.`}
            </p>
          </div>

          {/* Timer Duration */}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400 block mb-3">
              Timer Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIMER_OPTIONS.map((s) => (
                <Button
                  key={s}
                  variant={timerDuration === s ? 'orange' : 'stone'}
                  onClick={() => setTimerDuration(s)}
                  className="py-2.5 text-sm"
                >
                  {s}s
                </Button>
              ))}
            </div>
          </div>

          <p className="text-stone-300 text-xs text-center">
            {puzzles.length} puzzle{puzzles.length !== 1 ? 's' : ''} loaded
          </p>

          <Button variant="green" onClick={handleStart} className="w-full text-lg py-4 font-black">
            Start Game →
          </Button>
        </div>

        <p className="text-center text-stone-400 text-xs mt-4">
          Game Master controls open at <span className="font-mono text-stone-500">/gm</span>
        </p>
      </div>
    </div>
  );
}
