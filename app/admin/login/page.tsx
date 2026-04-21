"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { ArrowLeft, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/admin");
      else setChecking(false);
    });
    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.replace("/admin");
    } catch (e) {
      console.error("Login failed:", e);
      setError("Login gagal. Coba lagi.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="lg-root">
        <div className="lg-loading font-mono">loading…</div>
      </div>
    );
  }

  return (
    <div className="lg-root">
      <style>{`
        .lg-root {
          --paper: #0d0d0d;
          --paper-2: #1f1f1f;
          --ink: #f2ede4;
          --ink-2: #d4cec0;
          --muted: #8a857c;
          --accent: #d7263d;
          --card: #fbfaf6;
          --card-ink: #0f0f0f;
          min-height: 100dvh;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--font-space-grotesk), system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        .lg-root::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.025) 1px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.02) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.018) 1px, transparent 1px);
          background-size: 3px 3px, 5px 5px, 7px 7px;
          mix-blend-mode: screen;
          opacity: 0.7;
          z-index: 1;
        }
        .lg-root::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%);
          z-index: 1;
        }
        .lg-bg-label {
          position: absolute;
          top: 28px;
          left: 28px;
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 3;
        }
        .lg-bg-label::before {
          content: "";
          width: 22px;
          height: 1px;
          background: var(--ink);
        }
        .lg-back {
          position: absolute;
          top: 28px;
          right: 28px;
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-decoration: none;
          padding: 9px 14px;
          border: 1px solid rgba(242,237,228,0.18);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
          z-index: 3;
        }
        .lg-back:hover {
          background: var(--ink);
          color: var(--paper);
          border-color: var(--ink);
        }
        .lg-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 34px;
        }
        .lg-bg-title {
          font-family: var(--font-climate-crisis), 'Climate Crisis', sans-serif;
          font-size: clamp(84px, 18vw, 220px);
          color: rgba(215, 38, 61, 0.12);
          letter-spacing: -0.05em;
          line-height: 0.82;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -58%);
          pointer-events: none;
          z-index: 1;
          white-space: nowrap;
          text-align: center;
        }
        .lg-card {
          position: relative;
          background: var(--card);
          color: var(--card-ink);
          padding: 18px 18px 44px;
          box-shadow:
            0 2px 6px rgba(0,0,0,0.25),
            0 20px 50px rgba(0,0,0,0.45);
          transform: rotate(-1.5deg);
          width: min(380px, 92vw);
          z-index: 2;
        }
        .lg-card::before {
          content: '';
          position: absolute;
          top: -14px;
          left: 50%;
          transform: translateX(-50%) rotate(-4deg);
          width: 110px;
          height: 28px;
          background: rgba(215, 38, 61, 0.3);
          border-left: 1px dashed rgba(0,0,0,0.2);
          border-right: 1px dashed rgba(0,0,0,0.2);
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .lg-card-inner {
          padding: 16px 14px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .lg-eyebrow {
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(15,15,15,0.5);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .lg-eyebrow::before,
        .lg-eyebrow::after {
          content: "";
          width: 16px;
          height: 1px;
          background: rgba(15,15,15,0.35);
        }
        .lg-title {
          font-family: var(--font-climate-crisis), 'Climate Crisis', sans-serif;
          font-size: clamp(54px, 9vw, 78px);
          color: var(--accent);
          letter-spacing: -0.05em;
          line-height: 0.82;
          margin: 0;
          text-align: center;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.1);
        }
        .lg-hand {
          font-family: var(--font-caveat), cursive;
          font-size: 26px;
          line-height: 1.1;
          color: var(--card-ink);
          transform: rotate(-2deg);
          margin-top: -4px;
        }
        .lg-divider {
          width: 80%;
          height: 1px;
          background: rgba(15,15,15,0.15);
          margin: 4px 0;
        }
        .lg-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 20px;
          border: none;
          background: var(--card-ink);
          color: var(--card);
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s, color 0.2s, box-shadow 0.2s;
        }
        .lg-btn:hover:not(:disabled) {
          background: var(--accent);
          color: var(--card);
          transform: translate(-2px, -2px);
          box-shadow: 4px 4px 0 var(--card-ink);
        }
        .lg-btn:active:not(:disabled) {
          transform: translate(0,0);
          box-shadow: 0 0 0;
        }
        .lg-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .lg-error {
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 8px 12px;
          width: 100%;
          text-align: center;
        }
        .lg-caption {
          position: absolute;
          right: 18px;
          bottom: 12px;
          font-family: var(--font-caveat), cursive;
          font-size: 18px;
          color: rgba(15,15,15,0.55);
          transform: rotate(-3deg);
        }
        .lg-footer {
          position: relative;
          z-index: 2;
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 10.5px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--muted);
          text-align: center;
        }
        .lg-loading {
          color: var(--muted);
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 12px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        @media (max-width: 560px) {
          .lg-bg-label, .lg-back {
            top: 18px;
            font-size: 10px;
          }
          .lg-bg-label { left: 18px; }
          .lg-back { right: 18px; padding: 7px 10px; }
          .lg-bg-title { font-size: 22vw; }
        }
      `}</style>

      <span className="lg-bg-label">00 · studio access</span>
      <Link href="/" className="lg-back">
        <ArrowLeft size={12} />
        <span>back home</span>
      </Link>

      <div className="lg-wrap">
        <div className="lg-bg-title" aria-hidden>
          admin
        </div>

        <div className="lg-card">
          <div className="lg-card-inner">
            <span className="lg-eyebrow">sign in</span>
            <h1 className="lg-title">welcome back</h1>
            <div className="lg-hand">studio&rsquo;s only mine.</div>

            <div className="lg-divider" />

            {error && <div className="lg-error">{error}</div>}

            <button
              type="button"
              className="lg-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <LogIn size={15} />
              {loading ? "signing in…" : "continue with google"}
            </button>
          </div>

          <span className="lg-caption">admin · v1</span>
        </div>
      </div>

      <div className="lg-footer">
        <span>for authorized eyes only</span>
      </div>
    </div>
  );
}
