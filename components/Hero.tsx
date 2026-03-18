"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Window from "@/components/window";
import BlurOverlay from "@/components/BlurOverlay";
import { playCloseSound } from "@/lib/audio";

const AboutWindow = dynamic(() => import("@/components/windows/aboutwindow"), { ssr: false });
const ProjectWindow = dynamic(() => import("@/components/windows/projectwindow"), { ssr: false });
const BlogWindow = dynamic(() => import("@/components/windows/blogwindow"), { ssr: false });
const GalleryWindow = dynamic(() => import("@/components/windows/gallerywindow"), { ssr: false });
const ConnectionWindow = dynamic(() => import("@/components/windows/connectionwindow"), { ssr: false });

const IMAGES = [
    "https://i.pinimg.com/avif/736x/b9/88/1d/b9881d73712f3e4aa410348dcabcb8b3.avf",
    "https://i.pinimg.com/736x/58/45/d8/5845d8e1ab60bffa4c25e7166f7eaed3.jpg",
    "https://i.pinimg.com/avif/1200x/f9/6f/7b/f96f7be472570bc706ccc673aee1e4b8.avf",
    "https://i.pinimg.com/736x/ca/e2/94/cae294f8e1aab257939af9ab1f465b64.jpg",
    "https://i.pinimg.com/736x/01/e4/25/01e425074ed2e47516895ff239d6be30.jpg",
    "https://i.pinimg.com/avif/1200x/48/24/3c/48243cf660a62c6907a27d24a25cc98d.avf",
    "https://i.pinimg.com/736x/2a/ea/c9/2aeac961f4fb84819c1bc8ef5b83f5b3.jpg",
    "https://i.pinimg.com/736x/5c/d6/cc/5cd6cc4e4d00ecb875734ac625de675e.jpg",
    "https://i.pinimg.com/avif/736x/2a/2a/89/2a2a89bc2919adcf986231811e6d7204.avf",
];

const CONFIG = {
    COLS: 3,
    ROWS: 3,
    easingFactor: 0.1,
    rotationStrength: 0.1,
    rotationEasing: 0.06,
    scaleEasing: 0.08,
    maxScaleEffect: 0.2,
    tileOverscan: 1,
    mobileTileOverscan: 0,
};

const buttons = ["About", "Project", "Blog", "Gallery", "Connect"];

const buttonIcons: Record<string, React.ReactNode> = {
    About: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    ),
    Project: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    ),
    Blog: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    ),
    Gallery: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
    ),
    Connect: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <circle cx="18" cy="18" r="2.5" />
            <line x1="8.5" y1="11" x2="15.5" y2="7" />
            <line x1="8.5" y1="13" x2="15.5" y2="17" />
        </svg>
    ),
};

export default function Hero() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const focusCounter = useRef(0);
    const [windowZMap, setWindowZMap] = useState<Record<string, number>>({});
    const isMobileRef = useRef(false);

    // Detect mobile viewport (debounced)
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const check = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            isMobileRef.current = mobile;
        };
        check(); // run once on mount
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(check, 150);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // Buka/tutup window + sound — memoized to prevent child re-renders
    const toggleWindow = useCallback((name: string) => {
        const mobile = isMobileRef.current;
        setOpenWindows((prev) => {
            if (prev.includes(name)) {
                playCloseSound();
                // Clean up z-map entry
                setWindowZMap((z) => {
                    const next = { ...z };
                    delete next[name];
                    return next;
                });
                return prev.filter((w) => w !== name);
            }
            // On mobile: only 1 window at a time — close existing before opening new
            if (mobile && prev.length > 0) {
                playCloseSound();
                focusCounter.current = 1;
                setWindowZMap({ [name]: 1 });
                return [name];
            }
            // Assign z-index for new window
            focusCounter.current += 1;
            setWindowZMap((z) => ({ ...z, [name]: focusCounter.current }));
            return [...prev, name];
        });
        // Auto-close mobile menu when opening a window
        if (mobile) setMenuOpen(false);
    }, []);

    // Bawa window ke paling depan — only update z-index, never reorder array
    const bringToFront = useCallback((name: string) => {
        focusCounter.current += 1;
        setWindowZMap((z) => ({ ...z, [name]: focusCounter.current }));
    }, []);

    const closeWindow = useCallback((name: string) => {
        playCloseSound();
        setOpenWindows((prev) => prev.filter((w) => w !== name));
        setWindowZMap((z) => {
            const next = { ...z };
            delete next[name];
            return next;
        });
    }, []);

    const BASE_Z = 50; // z-index dasar window

    // Hero hover image interaction
    useEffect(() => {
        const hoverElements = document.querySelectorAll('.hero-hover');
        const handlers: { el: Element; over: () => void; leave: () => void }[] = [];

        hoverElements.forEach((el) => {
            const over = () => el.classList.remove('unhover');
            const leave = () => el.classList.add('unhover');
            el.addEventListener('mouseover', over);
            el.addEventListener('mouseleave', leave);
            handlers.push({ el, over, leave });
        });

        return () => {
            handlers.forEach(({ el, over, leave }) => {
                el.removeEventListener('mouseover', over);
                el.removeEventListener('mouseleave', leave);
            });
        };
    }, []);

    useEffect(() => {
        const viewport = viewportRef.current;
        const container = containerRef.current;
        const grid = gridRef.current;
        if (!viewport || !container || !grid) return;

        const imageFor = (baseX: number, baseY: number) => {
            return IMAGES[(baseX + baseY * CONFIG.COLS) % IMAGES.length];
        };

        const state = {
            gridItems: [] as { element: HTMLDivElement; baseX: number; baseY: number; tileX: number; tileY: number; yOffset: number }[],
            cameraOffset: { x: 0, y: 0 },
            targetOffset: { x: 0, y: 0 },
            isDragging: false,
            previousMousePosition: { x: 0, y: 0 },
            touchStart: null as { x: number; y: number } | null,
            containerRotationX: 0,
            containerRotationY: 0,
            targetRotationX: 0,
            targetRotationY: 0,
            containerScale: 1,
            targetScale: 1,
            scrollSpeed: 0,
            // Idle drift
            lastInteractionTime: performance.now(),
            driftTime: 0,
            driftActive: false,
            driftBlendFactor: 0,  // 0 = no drift, 1 = full drift
        };

        const IDLE_DELAY_MS = 500;   // mulai drift lebih cepat
        const DRIFT_SPEED = 1.0;     // kecepatan drift lebih tinggi
        const DRIFT_RADIUS_X = 280;  // jangkauan horizontal lebih jauh
        const DRIFT_RADIUS_Y = 180;  // jangkauan vertikal lebih jauh

        let cellWidth = 0;
        let cellHeight = 0;
        let tilesX = 1;
        let tilesY = 1;
        let rafId: number;

        const calculateCellSizeAndTiling = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const minScale = 1 - CONFIG.maxScaleEffect;
            const requiredCoverFactor = 1 / minScale;
            const size = Math.max(vw / CONFIG.COLS, vh / CONFIG.ROWS) * requiredCoverFactor;
            cellWidth = size;
            cellHeight = size;
            const totalWidth = cellWidth * CONFIG.COLS;
            const totalHeight = cellHeight * CONFIG.ROWS;
            const neededTilesX = Math.ceil((vw * requiredCoverFactor) / totalWidth);
            const neededTilesY = Math.ceil((vh * requiredCoverFactor) / totalHeight);
            const overscan = window.innerWidth <= 768 ? CONFIG.mobileTileOverscan : CONFIG.tileOverscan;
            tilesX = Math.max(1, neededTilesX + overscan);
            tilesY = Math.max(1, neededTilesY + overscan);
        };

        const createGridItems = () => {
            grid.innerHTML = "";
            state.gridItems = [];
            for (let tileY = -tilesY; tileY <= tilesY; tileY++) {
                for (let tileX = -tilesX; tileX <= tilesX; tileX++) {
                    for (let y = 0; y < CONFIG.ROWS; y++) {
                        for (let x = 0; x < CONFIG.COLS; x++) {
                            const element = document.createElement("div");
                            element.style.cssText = `
                position: absolute;
                width: ${cellWidth}px;
                height: ${cellHeight}px;
                padding: 25px;
                box-sizing: border-box;
                overflow: hidden;
                will-change: transform;
                user-select: none;
                backface-visibility: hidden;
              `;
                            const yOffset = x * cellHeight * 0.15;
                            const src = imageFor(x, y);
                            element.innerHTML = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;display:block;pointer-events:none;border-radius:8px;" loading="lazy" decoding="async" />`;
                            grid.appendChild(element);
                            state.gridItems.push({ element, baseX: x, baseY: y, tileX, tileY, yOffset });
                        }
                    }
                }
            }
        };

        const updateItemPositions = () => {
            const totalWidth = cellWidth * CONFIG.COLS;
            const totalHeight = cellHeight * CONFIG.ROWS;
            state.gridItems.forEach(({ element, baseX, baseY, tileX, tileY, yOffset }) => {
                const baseOffsetX = state.cameraOffset.x % totalWidth;
                const baseOffsetY = state.cameraOffset.y % totalHeight;
                const x = baseX * cellWidth + tileX * totalWidth - baseOffsetX;
                const y = baseY * cellHeight + tileY * totalHeight - baseOffsetY + yOffset;
                element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            });
        };

        const resetIdle = () => {
            state.lastInteractionTime = performance.now();
            state.driftActive = false;
        };

        const onMouseDown = (e: MouseEvent) => {
            state.isDragging = true;
            viewport.style.cursor = "grabbing";
            state.previousMousePosition = { x: e.clientX, y: e.clientY };
            resetIdle();
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!state.isDragging) return;
            const deltaX = e.clientX - state.previousMousePosition.x;
            const deltaY = e.clientY - state.previousMousePosition.y;
            state.targetOffset.x -= deltaX;
            state.targetOffset.y -= deltaY;
            state.scrollSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            state.targetRotationY = deltaX * CONFIG.rotationStrength;
            state.targetRotationX = -deltaY * CONFIG.rotationStrength;
            state.previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        const onMouseUp = () => {
            state.isDragging = false;
            viewport.style.cursor = "grab";
            state.targetRotationX = 0;
            state.targetRotationY = 0;
            resetIdle();
        };

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            state.targetOffset.x += e.deltaX;
            state.targetOffset.y += e.deltaY;
            state.scrollSpeed = Math.sqrt(e.deltaX * e.deltaX + e.deltaY * e.deltaY);
            state.targetRotationY = e.deltaX * CONFIG.rotationStrength * 0.5;
            state.targetRotationX = -e.deltaY * CONFIG.rotationStrength * 0.5;
            resetIdle();
        };

        const onTouchStart = (e: TouchEvent) => {
            if (e.touches.length === 1)
                state.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        };

        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 1 && state.touchStart) {
                e.preventDefault();
                const deltaX = e.touches[0].clientX - state.touchStart.x;
                const deltaY = e.touches[0].clientY - state.touchStart.y;
                state.targetOffset.x -= deltaX;
                state.targetOffset.y -= deltaY;
                state.scrollSpeed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                state.targetRotationY = deltaX * CONFIG.rotationStrength;
                state.targetRotationX = -deltaY * CONFIG.rotationStrength;
                state.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        const onTouchEnd = () => {
            state.touchStart = null;
            state.targetRotationX = 0;
            state.targetRotationY = 0;
        };

        let resizeTimeout: ReturnType<typeof setTimeout>;
        const onResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                calculateCellSizeAndTiling();
                createGridItems();
                updateItemPositions();
            }, 100);
        };

        let isPaused = false;

        const animate = () => {
            if (document.hidden) {
                isPaused = true;
                return; // stop loop — resumed via visibilitychange
            }
            rafId = requestAnimationFrame(animate);

            const now = performance.now();
            const idleMs = now - state.lastInteractionTime;

            // Masuk idle mode setelah IDLE_DELAY_MS
            if (!state.isDragging && idleMs > IDLE_DELAY_MS) {
                state.driftActive = true;
            }

            if (state.driftActive) {
                // Blend factor naik perlahan (fade-in drift)
                state.driftBlendFactor = Math.min(1, state.driftBlendFactor + 0.012);
                state.driftTime += DRIFT_SPEED * 0.016; // ~60fps equiv

                // Organic figure-8 / Lissajous path
                const driftX = Math.sin(state.driftTime * 0.4) * DRIFT_RADIUS_X
                    + Math.sin(state.driftTime * 0.13) * DRIFT_RADIUS_X * 0.3;
                const driftY = Math.cos(state.driftTime * 0.25) * DRIFT_RADIUS_Y
                    + Math.cos(state.driftTime * 0.17) * DRIFT_RADIUS_Y * 0.4;

                // Blend dari posisi user ke posisi drift
                state.targetOffset.x += (driftX - state.targetOffset.x) * 0.012 * state.driftBlendFactor;
                state.targetOffset.y += (driftY - state.targetOffset.y) * 0.012 * state.driftBlendFactor;
            } else {
                // Fade-out drift blend
                state.driftBlendFactor = Math.max(0, state.driftBlendFactor - 0.05);
            }

            const dx = state.targetOffset.x - state.cameraOffset.x;
            const dy = state.targetOffset.y - state.cameraOffset.y;
            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                state.cameraOffset.x += dx * CONFIG.easingFactor;
                state.cameraOffset.y += dy * CONFIG.easingFactor;
                updateItemPositions();
            }
            if (state.scrollSpeed > 0.1) {
                const speedFactor = Math.min(state.scrollSpeed * 0.01, 1);
                state.targetScale = 1 - speedFactor * CONFIG.maxScaleEffect;
                state.scrollSpeed *= 0.85;
            } else {
                state.scrollSpeed = 0;
                state.targetScale = 1;
            }
            const prevScale = state.containerScale;
            const prevRotX = state.containerRotationX;
            const prevRotY = state.containerRotationY;
            state.containerScale += (state.targetScale - state.containerScale) * CONFIG.scaleEasing;
            state.containerRotationX += (state.targetRotationX - state.containerRotationX) * CONFIG.rotationEasing;
            state.containerRotationY += (state.targetRotationY - state.containerRotationY) * CONFIG.rotationEasing;
            if (
                Math.abs(state.containerScale - prevScale) > 0.0001 ||
                Math.abs(state.containerRotationX - prevRotX) > 0.0001 ||
                Math.abs(state.containerRotationY - prevRotY) > 0.0001
            ) {
                if (isMobileRef.current) {
                    container.style.transform = `scale(${state.containerScale})`;
                } else {
                    container.style.transform = `scale(${state.containerScale}) skewY(${state.containerRotationX}deg) skewX(${state.containerRotationY}deg)`;
                }
            }
        };

        calculateCellSizeAndTiling();
        createGridItems();
        updateItemPositions();
        viewport.style.perspective = "1000px";

        viewport.addEventListener("mousedown", onMouseDown);
        viewport.addEventListener("mousemove", onMouseMove);
        viewport.addEventListener("mouseup", onMouseUp);
        viewport.addEventListener("mouseleave", onMouseUp);
        viewport.addEventListener("wheel", onWheel, { passive: false });
        viewport.addEventListener("touchstart", onTouchStart);
        viewport.addEventListener("touchmove", onTouchMove, { passive: false });
        viewport.addEventListener("touchend", onTouchEnd);
        window.addEventListener("resize", onResize);

        // Listen to visibilitychange inside the effect explicitly if needed,
        // though document.hidden check inside animate loop already handles the RAF pause.

        const onVisibilityChange = () => {
            if (!document.hidden && isPaused) {
                isPaused = false;
                rafId = requestAnimationFrame(animate);
            }
        };
        document.addEventListener('visibilitychange', onVisibilityChange);
        animate();

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener('visibilitychange', onVisibilityChange);
            viewport.removeEventListener("mousedown", onMouseDown);
            viewport.removeEventListener("mousemove", onMouseMove);
            viewport.removeEventListener("mouseup", onMouseUp);
            viewport.removeEventListener("mouseleave", onMouseUp);
            viewport.removeEventListener("wheel", onWheel);
            viewport.removeEventListener("touchstart", onTouchStart);
            viewport.removeEventListener("touchmove", onTouchMove);
            viewport.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <div className="relative w-screen overflow-hidden" style={{ height: "100dvh" }}>

            {/* Infinite Grid Background */}
            <div ref={viewportRef} className="absolute inset-0" style={{ cursor: "grab" }}>
                <div
                    ref={containerRef}
                    style={{
                        position: "absolute",
                        inset: "-10vmin",
                        width: "100%",
                        height: "100%",
                        transformOrigin: "center center",
                        willChange: "transform",
                    }}
                >
                    <div ref={gridRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                </div>
            </div>

            {/* Navbar — logo kiri, buttons kanan atas */}
            <div className="absolute top-0 left-0 right-0 z-[55] flex items-center justify-between p-6 md:p-12" style={{ pointerEvents: "none" }}>
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.8 }}
                    style={{ pointerEvents: "auto" }}
                >
                    <div
                        className="logo"
                        style={{
                            filter: openWindows.length > 0 ? "blur(8px)" : "none",
                            opacity: openWindows.length > 0 ? 0.5 : 1,
                            transition: "filter 0.4s ease, opacity 0.4s ease",
                            pointerEvents: "none",
                            userSelect: "none"
                        }}
                    >
                        <span className="flip-text">
                            <span data-char="L" style={{ "--i": 1 } as React.CSSProperties}>L</span>
                            <span data-char="a" style={{ "--i": 2 } as React.CSSProperties}>a</span>
                            <span data-char="m" style={{ "--i": 3 } as React.CSSProperties}>m</span>
                            <span data-char="." style={{ "--i": 4 } as React.CSSProperties}>.</span>
                        </span>
                    </div>
                </motion.div>

                {/* Nav Buttons — desktop only */}
                {!isMobile && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 3.0 }}
                        className="flex gap-4 flex-wrap justify-end"
                        style={{ pointerEvents: "auto", position: "relative", zIndex: 60 }}
                    >
                        {buttons.map((btn, i) => (
                            <motion.button
                                key={btn}
                                onClick={() => toggleWindow(btn)}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 3.0 + i * 0.08,
                                    scale: { type: "spring", stiffness: 400, damping: 20 },
                                    y: { type: "spring", stiffness: 400, damping: 20 },
                                }}
                                whileHover={{ scale: 1.15, y: -2 }}
                                whileTap={{ scale: 0.96 }}
                                className="relative flex items-center gap-2 px-6 py-3 text-sm tracking-widest uppercase cursor-pointer overflow-hidden"
                                style={{
                                    borderRadius: "999px",
                                    color: openWindows.includes(btn) ? "#fff" : "#E0E0E0",
                                    background: openWindows.includes(btn)
                                        ? "rgba(255,255,255,0.2)"
                                        : "rgba(26, 26, 26, 0.35)",
                                    backdropFilter: "blur(20px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.2)",
                                    textShadow: "none",
                                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                    fontWeight: 700,
                                    transition: "background 0.2s, color 0.2s, border 0.2s",
                                    transformOrigin: "center center",
                                }}
                            >
                                <span style={{ opacity: 0.75, display: "flex", alignItems: "center" }}>{buttonIcons[btn]}</span>
                                {btn}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Mobile Hamburger Button — only visible when no window is open */}
            {isMobile && openWindows.length === 0 && !menuOpen && (
                <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="absolute top-0 right-0 z-[70] p-6 md:p-12"
                    style={{ pointerEvents: "auto", background: "none", border: "none", cursor: "pointer" }}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {/* iOS 26 Liquid Glass pill */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "48px",
                            height: "48px",
                            borderRadius: "18px",
                            /* Liquid glass layers */
                            background: "linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.20) 50%, rgba(255,255,255,0.38) 100%)",
                            backdropFilter: "blur(28px) saturate(200%) brightness(1.08)",
                            WebkitBackdropFilter: "blur(28px) saturate(200%) brightness(1.08)",
                            border: "1px solid rgba(255,255,255,0.70)",
                            boxShadow: [
                                "0 2px 12px rgba(0,0,0,0.10)",
                                "0 1px 0 rgba(255,255,255,0.90) inset",
                                "0 -1px 0 rgba(0,0,0,0.06) inset",
                                "inset 1px 0 0 rgba(255,255,255,0.60)",
                            ].join(", "),
                            transition: "box-shadow 0.25s, background 0.25s",
                        }}
                    >
                        <div style={{ width: "22px", height: "16px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <span
                                style={{
                                    display: "block", width: "100%", height: "2px", borderRadius: "2px", background: "#E0E0E0",
                                }}
                            />
                            <span
                                style={{
                                    display: "block", width: "100%", height: "2px", borderRadius: "2px", background: "#E0E0E0",
                                }}
                            />
                            <span
                                style={{
                                    display: "block", width: "100%", height: "2px", borderRadius: "2px", background: "#E0E0E0",
                                }}
                            />
                        </div>
                    </div>
                </motion.button>
            )}

            {/* Mobile Slide-Down Menu */}
            <AnimatePresence>
                {isMobile && menuOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 65,
                            background: "rgba(26, 26, 26, 0.85)",
                            backdropFilter: "blur(40px) saturate(180%)",
                            WebkitBackdropFilter: "blur(40px) saturate(180%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "12px",
                            padding: "80px 32px 32px",
                        }}
                    >
                        {/* Close (X) button — top right */}
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.25, delay: 0.1 }}
                            onClick={() => {
                                setMenuOpen(false);
                                if (openWindows.length > 0) {
                                    playCloseSound();
                                    setOpenWindows([]);
                                    setWindowZMap({});
                                    focusCounter.current = 0;
                                }
                            }}
                            aria-label="Close menu"
                            style={{
                                position: "absolute",
                                top: "40px",
                                right: "40px",
                                width: "48px",
                                height: "48px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                zIndex: 70,
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="2.2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </motion.button>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", maxWidth: "160px", gap: "12px" }}>
                            {buttons.map((btn, i) => (
                                <motion.button
                                    key={btn}
                                    onClick={() => toggleWindow(btn)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        gap: "16px",
                                        width: "100%",
                                        padding: "16px 0",
                                        fontSize: "18px",
                                        letterSpacing: "0.15em",
                                        textTransform: "uppercase" as const,
                                        cursor: "pointer",
                                        color: openWindows.includes(btn) ? "#fff" : "#A0A0A0",
                                        background: "transparent",
                                        border: "none",
                                        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                        fontWeight: 700,
                                        transition: "color 0.2s",
                                    }}
                                >
                                    <span style={{ opacity: 0.7, display: "flex", alignItems: "center" }}>{buttonIcons[btn]}</span>
                                    {btn}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content — kiri bawah */}
            <div
                className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-12"
                style={{ pointerEvents: "none" }}
            >
                {/* Typography — kiri */}
                <div className="flex flex-col items-start gap-8">
                    <div className="flex flex-col gap-2">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 2.9 }}
                            className="hero-text"
                            style={{ pointerEvents: "none" }}
                        >
                            <div className="hero-line">
                                <motion.span
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 3.0, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ display: "inline-block" }}
                                >
                                    Simplicity is the
                                </motion.span>
                            </div>
                            <div className="hero-line">
                                <motion.span
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 1.2, delay: 3.1, ease: [0.16, 1, 0.3, 1] }}
                                    style={{ display: "inline-block" }}
                                >
                                    <span className="hero-hover unhover">
                                        ultimate
                                        <span className="hero-img">
                                            <img
                                                src="https://i.pinimg.com/avif/736x/fe/00/a6/fe00a6d3a8978b2c055e6d86674be866.avf"
                                                alt="aesthetic"
                                            />
                                        </span>
                                    </span>
                                    {" "}sophistication.
                                </motion.span>
                            </div>
                        </motion.div>
                    </div>


                    {/* BlurOverlay hanya muncul kalau ada window terbuka */}
                    <AnimatePresence>
                        {openWindows.length > 0 && (
                            <BlurOverlay onClose={() => { playCloseSound(); setOpenWindows([]); setWindowZMap({}); focusCounter.current = 0; }} />
                        )}
                    </AnimatePresence>
                    {/* Render semua window yang terbuka, stacked by z-index */}
                    <AnimatePresence>
                        {openWindows.map((name, index) => (
                            <Window
                                key={name}
                                title={name}
                                zIndex={BASE_Z + (windowZMap[name] ?? index)}
                                onFocus={() => bringToFront(name)}
                                onClose={() => closeWindow(name)}
                                onMenuToggle={() => setMenuOpen((prev) => !prev)}
                                menuOpen={menuOpen}
                                initialWidth={["Gallery", "Blog", "Project"].includes(name) ? 820 : 560}
                                initialHeight={["Gallery", "Blog", "Project"].includes(name) ? 620 : 480}
                            >
                                {name === "About" && <AboutWindow />}
                                {name === "Project" && <ProjectWindow />}
                                {name === "Blog" && <BlogWindow />}
                                {name === "Gallery" && <GalleryWindow />}
                                {name === "Connect" && <ConnectionWindow />}
                            </Window>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}