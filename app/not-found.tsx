"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "playing" | "dead";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const GROUND = H - 24;

    const G = 0.42;
    const FLAP = -7.2;
    const PIPE_W = 58;
    const GAP = 140;
    const SPEED = 2.4;
    const PIPE_EVERY = 95;

    let bird = { x: 90, y: H / 2, vy: 0, r: 13, rot: 0 };
    let pipes: { x: number; gapY: number; passed: boolean }[] = [];
    let localScore = 0;
    let localPhase: Phase = "idle";
    let frame = 0;
    let raf = 0;

    try {
      const stored = localStorage.getItem("flappy-best");
      if (stored) setBest(parseInt(stored, 10) || 0);
    } catch {}

    function reset() {
      bird = { x: 90, y: H / 2, vy: 0, r: 13, rot: 0 };
      pipes = [];
      localScore = 0;
      frame = 0;
      setScore(0);
    }

    function die() {
      if (localPhase === "dead") return;
      localPhase = "dead";
      setPhase("dead");
      setBest((b) => {
        const nb = Math.max(b, localScore);
        try {
          localStorage.setItem("flappy-best", String(nb));
        } catch {}
        return nb;
      });
    }

    function flap() {
      if (localPhase === "idle") {
        localPhase = "playing";
        setPhase("playing");
        bird.vy = FLAP;
        return;
      }
      if (localPhase === "playing") {
        bird.vy = FLAP;
        return;
      }
      if (localPhase === "dead") {
        reset();
        localPhase = "playing";
        setPhase("playing");
        bird.vy = FLAP;
      }
    }

    function spawnPipe() {
      const min = 70;
      const max = GROUND - GAP - 70;
      const gapY = min + Math.random() * (max - min);
      pipes.push({ x: W, gapY, passed: false });
    }

    function drawBird() {
      ctx!.save();
      ctx!.translate(bird.x, bird.y);
      ctx!.rotate(bird.rot);
      ctx!.fillStyle = "#d7263d";
      ctx!.beginPath();
      ctx!.arc(0, 0, bird.r, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f2ede4";
      ctx!.beginPath();
      ctx!.arc(5, -3, 3.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#1a1a1a";
      ctx!.beginPath();
      ctx!.arc(6, -3, 1.5, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f2ede4";
      ctx!.fillRect(bird.r - 3, -1, 6, 2);
      ctx!.restore();
    }

    function drawPipes() {
      for (const p of pipes) {
        ctx!.fillStyle = "#f2ede4";
        ctx!.fillRect(p.x, 0, PIPE_W, p.gapY);
        ctx!.fillRect(p.x, p.gapY + GAP, PIPE_W, GROUND - (p.gapY + GAP));
        ctx!.fillStyle = "#d7263d";
        ctx!.fillRect(p.x - 3, p.gapY - 10, PIPE_W + 6, 10);
        ctx!.fillRect(p.x - 3, p.gapY + GAP, PIPE_W + 6, 10);
      }
    }

    function loop() {
      ctx!.fillStyle = "#1a1a1a";
      ctx!.fillRect(0, 0, W, H);

      ctx!.strokeStyle = "#2a2a2a";
      ctx!.lineWidth = 1;
      for (let x = (frame * 0.5) % 32; x < W; x += 32) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, GROUND);
        ctx!.stroke();
      }

      ctx!.fillStyle = "#2a2a2a";
      ctx!.fillRect(0, GROUND, W, H - GROUND);
      ctx!.strokeStyle = "#d7263d";
      ctx!.beginPath();
      ctx!.moveTo(0, GROUND);
      ctx!.lineTo(W, GROUND);
      ctx!.stroke();

      if (localPhase === "playing") {
        bird.vy += G;
        bird.y += bird.vy;
        bird.rot = Math.max(-0.5, Math.min(1.2, bird.vy * 0.08));

        if (frame % PIPE_EVERY === 0) spawnPipe();
        for (const p of pipes) p.x -= SPEED;
        pipes = pipes.filter((p) => p.x > -PIPE_W - 10);

        for (const p of pipes) {
          if (!p.passed && p.x + PIPE_W < bird.x) {
            p.passed = true;
            localScore++;
            setScore(localScore);
          }
        }

        if (bird.y + bird.r >= GROUND || bird.y - bird.r <= 0) die();
        for (const p of pipes) {
          if (
            bird.x + bird.r > p.x &&
            bird.x - bird.r < p.x + PIPE_W &&
            (bird.y - bird.r < p.gapY || bird.y + bird.r > p.gapY + GAP)
          ) {
            die();
          }
        }
        frame++;
      } else if (localPhase === "idle") {
        bird.y = H / 2 + Math.sin(frame / 12) * 8;
        frame++;
      } else if (localPhase === "dead") {
        if (bird.y + bird.r < GROUND) {
          bird.vy += G;
          bird.y += bird.vy;
          bird.rot = Math.min(1.4, bird.rot + 0.08);
        }
      }

      drawPipes();
      drawBird();

      raf = requestAnimationFrame(loop);
    }
    loop();

    function onClick(e: Event) {
      e.preventDefault();
      flap();
    }
    function onKey(e: KeyboardEvent) {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        flap();
      }
    }
    canvas.addEventListener("mousedown", onClick);
    canvas.addEventListener("touchstart", onClick, { passive: false });
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown", onClick);
      canvas.removeEventListener("touchstart", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="nf-wrap">
      <style>{`
        .nf-wrap {
          background: #1a1a1a;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 32px;
          gap: 14px;
          color: #f2ede4;
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
        }
        .nf-title {
          font-family: var(--font-climate-crisis), 'Climate Crisis', 'Rubik Mono One', sans-serif;
          font-size: clamp(72px, 16vw, 160px);
          color: #d7263d;
          margin: 0;
          line-height: 0.82;
          letter-spacing: -0.05em;
          text-shadow: 3px 3px 0 rgba(0,0,0,0.3);
        }
        .nf-sub {
          color: #8a857c;
          font-size: 13px;
          margin: 0;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-family: ui-monospace, 'JetBrains Mono', monospace;
          text-align: center;
        }
        .nf-game {
          position: relative;
          width: min(380px, 90vw, 48vh);
          aspect-ratio: 400 / 460;
          border: 1px solid #3a3a3a;
          background: #1a1a1a;
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        }
        .nf-canvas {
          width: 100%;
          height: 100%;
          display: block;
          cursor: pointer;
          touch-action: manipulation;
        }
        .nf-hud {
          position: absolute;
          top: 10px;
          left: 0;
          right: 0;
          padding: 0 14px;
          display: flex;
          justify-content: space-between;
          font-family: ui-monospace, 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.2em;
          color: #8a857c;
          text-transform: uppercase;
          pointer-events: none;
          z-index: 2;
        }
        .nf-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 8px;
          pointer-events: none;
          text-align: center;
          padding: 20px;
          z-index: 1;
        }
        .nf-overlay-title {
          font-family: var(--font-climate-crisis), 'Climate Crisis', sans-serif;
          font-size: 34px;
          color: #d7263d;
          letter-spacing: -0.03em;
        }
        .nf-overlay-hint {
          font-family: ui-monospace, 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: #8a857c;
          text-transform: uppercase;
        }
        .nf-link {
          color: #f2ede4;
          padding: 11px 22px;
          background: transparent;
          border: 1px solid #3a3a3a;
          text-decoration: none;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: ui-monospace, 'JetBrains Mono', monospace;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }
        .nf-link:hover {
          background: #d7263d;
          border-color: #d7263d;
          color: #1a1a1a;
        }
      `}</style>

      <h1 className="nf-title">404</h1>
      <p className="nf-sub">page not found — try flapping your way out</p>

      <div className="nf-game">
        <canvas
          ref={canvasRef}
          width={400}
          height={460}
          className="nf-canvas"
        />
        <div className="nf-hud">
          <span>score {score}</span>
          <span>best {best}</span>
        </div>
        <div className="nf-overlay">
          {phase === "idle" && (
            <>
              <div className="nf-overlay-title">flap</div>
              <div className="nf-overlay-hint">tap / space to start</div>
            </>
          )}
          {phase === "dead" && (
            <>
              <div className="nf-overlay-title">game over</div>
              <div className="nf-overlay-hint">tap / space to retry</div>
            </>
          )}
        </div>
      </div>

      <Link href="/" className="nf-link">
        go home
      </Link>
    </div>
  );
}
