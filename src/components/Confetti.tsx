import { useEffect, useRef } from 'react';
import { PLAYER_COLORS } from '../constants/colors';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  color: string;
  rotation: number; rotationSpeed: number;
  w: number; h: number;
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 120,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4,
      color: PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.25,
      w: 8 + Math.random() * 10,
      h: 4 + Math.random() * 5,
    }));

    let animId: number;
    let stopped = false;
    const stopTimer = setTimeout(() => { stopped = true; }, 4500);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allGone = true;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.rotation += p.rotationSpeed;
        if (p.y < canvas.height + 20) allGone = false;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (!allGone && !stopped) animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animId); clearTimeout(stopTimer); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />;
}
