"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

const pathVariants = [
  "M5 20.9999C26.7762 16.2245 49.5532 11.5572 71.7979 14.6666C84.9553 16.5057 97.0392 21.8432 109.987 24.3888C116.413 25.6523 123.012 25.5143 129.042 22.6388C135.981 19.3303 142.586 15.1422 150.092 13.3333C156.799 11.7168 161.702 14.6225 167.887 16.8333C181.562 21.7212 194.975 22.6234 209.252 21.3888C224.678 20.0548 239.912 17.991 255.42 18.3055C272.027 18.6422 288.409 18.867 305 17.9999",
  "M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014",
  "M4.99805 20.9998C65.6267 17.4649 126.268 13.845 187.208 12.8887C226.483 12.2723 265.751 13.2796 304.998 13.9998",
  "M5 29.8857C52.3147 26.9322 99.4329 21.6611 146.503 17.1765C151.753 16.6763 157.115 15.9505 162.415 15.6551C163.28 15.6069 165.074 15.4123 164.383 16.4275C161.704 20.3627 157.134 23.7551 153.95 27.4983C153.209 28.3702 148.194 33.4751 150.669 34.6605C153.638 36.0819 163.621 32.6063 165.039 32.2029C178.55 28.3608 191.49 23.5968 204.869 19.5404C231.903 11.3436 259.347 5.83254 288.793 5.12258C294.094 4.99476 299.722 4.82265 305 5.45025",
];

interface DrawUnderlineProps {
  isActive?: boolean;
  color?: string;
  variant?: 0 | 1 | 2 | 3;
  children: React.ReactNode;
}

export function DrawUnderline({ isActive = false, color = "#ffffff", variant = 0, children }: DrawUnderlineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathState, setPathState] = useState<{ path: string; id: number } | null>(null);
  const enterTween = useRef<gsap.core.Tween | null>(null);
  const leaveTween = useRef<gsap.core.Tween | null>(null);
  const prevActive = useRef(false);
  const idCounter = useRef(0);

  const showUnderline = () => {
    setPathState({ path: pathVariants[variant], id: ++idCounter.current });
  };

  const hideUnderline = (pathEl: SVGPathElement) => {
    const startLeave = () => {
      if (leaveTween.current?.isActive()) return;
      leaveTween.current = gsap.to(pathEl, {
        duration: 0.4,
        drawSVG: "100% 100%",
        ease: "power2.inOut",
        onComplete: () => { setPathState(null); leaveTween.current = null; },
      });
    };
    if (enterTween.current?.isActive()) {
      enterTween.current.eventCallback("onComplete", startLeave);
    } else {
      startLeave();
    }
  };

  // Draw in when isActive becomes true, draw out when it becomes false
  useEffect(() => {
    const path = pathRef.current;
    if (isActive && !prevActive.current) {
      showUnderline();
    } else if (!isActive && prevActive.current && path) {
      hideUnderline(path);
    }
    prevActive.current = isActive;
  }, [isActive]);

  // Animate draw-in whenever pathState changes
  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathState) return;
    leaveTween.current?.kill();
    leaveTween.current = null;
    gsap.set(path, { drawSVG: "0%" });
    enterTween.current = gsap.to(path, {
      duration: 0.5,
      drawSVG: "100%",
      ease: "power2.inOut",
      onComplete: () => { enterTween.current = null; },
    });
  }, [pathState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      enterTween.current?.kill();
      leaveTween.current?.kill();
    };
  }, []);

  const handleMouseEnter = () => {
    if (enterTween.current?.isActive()) return;
    showUnderline();
  };

  const handleMouseLeave = () => {
    const path = pathRef.current;
    if (!path) { setPathState(null); return; }
    if (isActive) return; // keep underline when active
    hideUnderline(path);
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0"
        style={{ top: "100%", height: "0.35em" }}
      >
        {pathState && (
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 310 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <path
              ref={pathRef}
              d={pathState.path}
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
          </svg>
        )}
      </span>
    </span>
  );
}
