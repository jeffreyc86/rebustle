import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  running: boolean;
  onExpire?: () => void;
  resetKey: number;
  durationSeconds?: number;
}

export function Timer({ running, onExpire, resetKey, durationSeconds = 10 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Reset whenever resetKey changes
  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [resetKey, durationSeconds]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!running) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          // Defer callback so state update completes first
          setTimeout(() => onExpireRef.current?.(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, resetKey]);

  const isUrgent = timeLeft <= 3;

  return (
    <div
      className={`text-8xl font-black tabular-nums transition-colors duration-300 ${
        isUrgent ? 'text-red-500' : 'text-stone-800'
      }`}
    >
      {timeLeft}
    </div>
  );
}
