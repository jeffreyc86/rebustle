import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  running: boolean;
  onExpire?: () => void;
  onTick?: () => void;
  resetKey: number;
  durationSeconds?: number;
}

export function Timer({ running, onExpire, onTick, resetKey, durationSeconds = 10 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onExpireRef = useRef(onExpire);
  const onTickRef = useRef(onTick);
  onExpireRef.current = onExpire;
  onTickRef.current = onTick;

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
          setTimeout(() => onExpireRef.current?.(), 0);
          return 0;
        }
        const next = prev - 1;
        if (next <= 3) setTimeout(() => onTickRef.current?.(), 0);
        return next;
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
