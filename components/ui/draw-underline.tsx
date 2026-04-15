"use client";

import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

const pathVariants = [
  // 0: loop (About)
  "M5 24.2592C26.233 20.2879 47.7083 16.9968 69.135 13.8421C98.0469 9.5853 128.407 4.02322 158.059 5.14674C172.583 5.69708 187.686 8.66104 201.598 11.9696C207.232 13.3093 215.437 14.9471 220.137 18.3619C224.401 21.4596 220.737 25.6575 217.184 27.6168C208.309 32.5097 197.199 34.281 186.698 34.8486C183.159 35.0399 147.197 36.2657 155.105 26.5837C158.11 22.9053 162.993 20.6229 167.764 18.7924C178.386 14.7164 190.115 12.1115 201.624 10.3984C218.367 7.90626 235.528 7.06127 252.521 7.49276C258.455 7.64343 264.389 7.92791 270.295 8.41825C280.321 9.25056 296 10.8932 305 13.0242",
  // 1: zigzag keriting (Gallery)
  "M5 29.5014C9.61174 24.4515 12.9521 17.9873 20.9532 17.5292C23.7742 17.3676 27.0987 17.7897 29.6575 19.0014C33.2644 20.7093 35.6481 24.0004 39.4178 25.5014C48.3911 29.0744 55.7503 25.7731 63.3048 21.0292C67.9902 18.0869 73.7668 16.1366 79.3721 17.8903C85.1682 19.7036 88.2173 26.2464 94.4121 27.2514C102.584 28.5771 107.023 25.5064 113.276 20.6125C119.927 15.4067 128.83 12.3333 137.249 15.0014C141.418 16.3225 143.116 18.7528 146.581 21.0014C149.621 22.9736 152.78 23.6197 156.284 24.2514C165.142 25.8479 172.315 17.5185 179.144 13.5014C184.459 10.3746 191.785 8.74853 195.868 14.5292C199.252 19.3205 205.597 22.9057 211.621 22.5014C215.553 22.2374 220.183 17.8356 222.979 15.5569C225.4 13.5845 227.457 11.1105 230.742 10.5292C232.718 10.1794 234.784 12.9691 236.164 14.0014C238.543 15.7801 240.717 18.4775 243.356 19.8903C249.488 23.1729 255.706 21.2551 261.079 18.0014C266.571 14.6754 270.439 11.5202 277.146 13.6125C280.725 14.7289 283.221 17.209 286.393 19.0014C292.321 22.3517 298.255 22.5014 305 22.5014",
  // 2: maju mundur (Blog)
  "M17.0039 32.6826C32.2307 32.8412 47.4552 32.8277 62.676 32.8118C67.3044 32.807 96.546 33.0555 104.728 32.0775C113.615 31.0152 104.516 28.3028 102.022 27.2826C89.9573 22.3465 77.3751 19.0254 65.0451 15.0552C57.8987 12.7542 37.2813 8.49399 44.2314 6.10216C50.9667 3.78422 64.2873 5.81914 70.4249 5.96641C105.866 6.81677 141.306 7.58809 176.75 8.59886C217.874 9.77162 258.906 11.0553 300 14.4892",
];

interface DrawUnderlineProps {
  isActive?: boolean;
  color?: string;
  variant?: 0 | 1 | 2;
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
