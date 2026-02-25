"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const cursorDot = dotRef.current;
        const cursorOutline = outlineRef.current;
        if (!cursorDot || !cursorOutline) return;

        // Check for touch device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            cursorDot.style.display = 'none';
            cursorOutline.style.display = 'none';
            return;
        }

        const onMouseMove = (e: MouseEvent) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.transform = `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%)`;

            cursorOutline.animate(
                { transform: `translate3d(${posX}px, ${posY}px, 0) translate(-50%, -50%) scale(${cursorOutline.dataset.scale || 1})` },
                { duration: 500, fill: "forwards" }
            );
        };

        window.addEventListener("mousemove", onMouseMove);

        const initHoverEffects = () => {
            const interactiveElements = document.querySelectorAll(
                "a, button, input, textarea, [role='button'], .window-handle"
            );

            interactiveElements.forEach((el) => {
                // Remove generic active listeners if any, to avoid duplicates
                const onMouseEnter = () => {
                    cursorOutline.dataset.scale = "1.5";
                    cursorOutline.style.borderColor = "#C45B3E";
                    cursorOutline.style.transform = `translate3d(${cursorOutline.style.left || 0}, ${cursorOutline.style.top || 0}, 0) translate(-50%, -50%) scale(1.5)`;
                };

                const onMouseLeave = () => {
                    cursorOutline.dataset.scale = "1";
                    cursorOutline.style.borderColor = "rgba(44, 44, 44, 0.5)"; // Default color for light mode
                    cursorOutline.style.transform = `translate3d(${cursorOutline.style.left || 0}, ${cursorOutline.style.top || 0}, 0) translate(-50%, -50%) scale(1)`;
                };

                el.addEventListener("mouseenter", onMouseEnter);
                el.addEventListener("mouseleave", onMouseLeave);

                // Store references to remove them later if needed
                (el as any)._cursorEnter = onMouseEnter;
                (el as any)._cursorLeave = onMouseLeave;
            });
        };

        // Run once on mount
        initHoverEffects();

        // Setup a MutationObserver to catch dynamically added interactive elements (like windows)
        const observer = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) hasNewNodes = true;
            }
            if (hasNewNodes) {
                initHoverEffects(); // Re-bind to catch new elements
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            observer.disconnect();
            document.querySelectorAll("a, button, input, textarea, [role='button']").forEach(el => {
                if ((el as any)._cursorEnter) el.removeEventListener("mouseenter", (el as any)._cursorEnter);
                if ((el as any)._cursorLeave) el.removeEventListener("mouseleave", (el as any)._cursorLeave);
            });
        };
    }, [pathname]); // Re-run effect on route change as well

    return (
        <>
            <style>{`
                * {
                    cursor: none !important;
                }
                .cursor-dot,
                .cursor-outline {
                    position: fixed;
                    top: 0;
                    left: 0;
                    border-radius: 50%;
                    z-index: 999999;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                }
                
                .cursor-dot {
                    width: 8px;
                    height: 8px;
                    background-color: #C45B3E;
                }
                
                .cursor-outline {
                    width: 40px;
                    height: 40px;
                    border: 1px solid rgba(44, 44, 44, 0.5); /* #1a1a1a but softer for ivory bg */
                    transition: background-color 0.2s, border-color 0.2s;
                }
                
                body.dark-mode .cursor-outline, .dark .cursor-outline {
                    border-color: #F5F5F5;
                }
            `}</style>
            <div ref={dotRef} className="cursor-dot" id="cursor-dot" />
            <div ref={outlineRef} className="cursor-outline" id="cursor-outline" />
        </>
    );
}
