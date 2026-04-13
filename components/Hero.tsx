"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Window from "@/components/window";
import BlurOverlay from "@/components/BlurOverlay";
import { playCloseSound } from "@/lib/audio";

const AboutWindow = dynamic(() => import("@/components/windows/aboutwindow"), { ssr: false });
const WorkWindow = dynamic(() => import("@/components/windows/workwindow"), { ssr: false });
const BlogWindow = dynamic(() => import("@/components/windows/blogwindow"), { ssr: false });
const GalleryWindow = dynamic(() => import("@/components/windows/gallerywindow"), { ssr: false });
const ConnectionWindow = dynamic(() => import("@/components/windows/connectionwindow"), { ssr: false });
const AdminWindow = dynamic(() => import("@/components/windows/adminwindow"), { ssr: false });

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


export default function Hero() {
    const HERO_FRAME_GAP = "16px";
    const HERO_FRAME_RADIUS = "2rem";

    const viewportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [isMobile, setIsMobile] = useState(false);
    const focusCounter = useRef(0);
    const [windowZMap, setWindowZMap] = useState<Record<string, number>>({});
    const isMobileRef = useRef(false);
    const [peeking, setPeeking] = useState(false);
    const windowsOpenRef = useRef(false);
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

    // Detect mobile viewport + track window size
    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            isMobileRef.current = mobile;
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        windowsOpenRef.current = openWindows.length > 0;
    }, [openWindows]);

    // Buka/tutup window + sound — memoized to prevent child re-renders
    const toggleWindow = useCallback((name: string) => {
        setPeeking(false);
        setOpenWindows((prev) => {
            if (prev.includes(name)) {
                playCloseSound();
                setWindowZMap((z) => {
                    const next = { ...z };
                    delete next[name];
                    return next;
                });
                return prev.filter((w) => w !== name);
            }
            // Desktop: allow multiple windows
            focusCounter.current += 1;
            setWindowZMap((z) => ({ ...z, [name]: focusCounter.current }));
            return [...prev, name];
        });
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

    // Compute dynamic grid layout for open windows (desktop only)
    // Work & Blog = big, About & Connect = small (same size), Gallery = wide/long
    const gridLayout = (() => {
        if (isMobile || openWindows.length === 0) return {} as Record<string, { x: number; y: number; w: number; h: number }>;
        const vw = windowSize.w || 1440;
        const vh = windowSize.h || 900;
        const pad = 48;
        const topPad = 100;
        const gap = 16;
        const areaW = vw - pad * 2;
        const areaH = vh - topPad - pad;
        const layout: Record<string, { x: number; y: number; w: number; h: number }> = {};
        const wins = openWindows;
        const count = wins.length;

        const big = ["Work", "Blog", "Gallery"];
        const small = ["About", "Connect"];

        if (count === 1) {
            // Single window centered at comfortable size
            const w = Math.min(areaW, 820);
            const h = Math.min(areaH, 620);
            layout[wins[0]] = { x: pad + (areaW - w) / 2, y: topPad + (areaH - h) / 2, w, h };
        } else if (count === 2) {
            const bothSmall = wins.every(n => small.includes(n));
            const bothBig = wins.every(n => big.includes(n));
            if (bothSmall) {
                // Two small windows side by side, capped size
                const cellW = (areaW - gap) / 2;
                const h = Math.min(areaH, 480);
                const yOff = (areaH - h) / 2;
                wins.forEach((name, i) => {
                    layout[name] = { x: pad + i * (cellW + gap), y: topPad + yOff, w: cellW, h };
                });
            } else if (bothBig) {
                // Two big windows side by side, full height
                const cellW = (areaW - gap) / 2;
                wins.forEach((name, i) => {
                    layout[name] = { x: pad + i * (cellW + gap), y: topPad, w: cellW, h: areaH };
                });
            } else {
                // Mixed: big gets 60%, small gets 40%
                const bigW = areaW * 0.6 - gap / 2;
                const smallW = areaW * 0.4 - gap / 2;
                wins.forEach((name, i) => {
                    const isBig = big.includes(name);
                    const w = isBig ? bigW : smallW;
                    // Place big first, small second (or vice versa based on order)
                    const prevW = i === 0 ? 0 : (big.includes(wins[0]) ? bigW + gap : smallW + gap);
                    layout[name] = { x: pad + prevW, y: topPad, w, h: areaH };
                });
            }
        } else if (count === 3) {
            // Sort: big windows top row, small bottom — or adapt
            const bigWins = wins.filter(n => big.includes(n));
            const smallWins = wins.filter(n => small.includes(n));

            if (bigWins.length >= 2) {
                // Top row: 2 big windows (65% height), bottom: remaining (35% height)
                const topH = areaH * 0.65 - gap / 2;
                const botH = areaH * 0.35 - gap / 2;
                const cellW = (areaW - gap) / 2;
                bigWins.slice(0, 2).forEach((name, i) => {
                    layout[name] = { x: pad + i * (cellW + gap), y: topPad, w: cellW, h: topH };
                });
                const rest = wins.filter(n => !layout[n]);
                rest.forEach((name) => {
                    layout[name] = { x: pad, y: topPad + topH + gap, w: areaW, h: botH };
                });
            } else {
                // 2 columns, top big full row, bottom 2 small
                const topH = areaH * 0.6 - gap / 2;
                const botH = areaH * 0.4 - gap / 2;
                if (bigWins.length === 1) {
                    layout[bigWins[0]] = { x: pad, y: topPad, w: areaW, h: topH };
                    smallWins.forEach((name, i) => {
                        const cellW = (areaW - gap) / 2;
                        layout[name] = { x: pad + i * (cellW + gap), y: topPad + topH + gap, w: cellW, h: botH };
                    });
                } else {
                    // All small — uniform grid
                    const cellW = (areaW - gap) / 2;
                    wins.forEach((name, i) => {
                        if (i < 2) {
                            layout[name] = { x: pad + i * (cellW + gap), y: topPad, w: cellW, h: topH };
                        } else {
                            layout[name] = { x: pad, y: topPad + topH + gap, w: areaW, h: botH };
                        }
                    });
                }
            }
        } else if (count === 4) {
            // Sort: big on top, small on bottom
            const bigWins = wins.filter(n => big.includes(n));
            const smallWins = wins.filter(n => small.includes(n));
            const topRow = bigWins.length >= 2 ? bigWins.slice(0, 2) : [...bigWins, ...smallWins].slice(0, 2);
            const botRow = wins.filter(n => !topRow.includes(n));

            const topH = areaH * 0.6 - gap / 2;
            const botH = areaH * 0.4 - gap / 2;
            const cellW = (areaW - gap) / 2;

            topRow.forEach((name, i) => {
                layout[name] = { x: pad + i * (cellW + gap), y: topPad, w: cellW, h: topH };
            });
            botRow.forEach((name, i) => {
                layout[name] = { x: pad + i * (cellW + gap), y: topPad + topH + gap, w: cellW, h: botH };
            });
        } else {
            // 5 windows:
            // Left 2 cols: Work & Blog (top, big) + About & Connect (bottom, small same size)
            // Right col: Gallery (full height, tall)
            const galleryW = areaW * 0.35;
            const leftW = areaW - galleryW - gap;
            const topH = areaH * 0.6 - gap / 2;
            const botH = areaH * 0.4 - gap / 2;
            const leftCellW = (leftW - gap) / 2;

            // Categorize
            const topCandidates: string[] = wins.filter(n => n === "Work" || n === "Blog");
            const botSmall: string[] = wins.filter(n => small.includes(n));
            const remaining = wins.filter(n => !topCandidates.includes(n) && n !== "Gallery" && !botSmall.includes(n));

            // Left top row: Work & Blog (or fill with remaining)
            const leftTop = [...topCandidates, ...remaining].slice(0, 2);
            // Left bottom row: About & Connect
            const leftBot = botSmall.slice(0, 2);
            // Fill any unplaced into leftBot
            const placed = new Set([...leftTop, ...leftBot, "Gallery"]);
            const unplaced = wins.filter(n => !placed.has(n));
            leftBot.push(...unplaced);

            // Left top
            leftTop.forEach((name, i) => {
                layout[name] = { x: pad + i * (leftCellW + gap), y: topPad, w: leftCellW, h: topH };
            });

            // Left bottom
            const botCellW = leftBot.length > 1 ? (leftW - gap) / 2 : leftW;
            leftBot.forEach((name, i) => {
                layout[name] = { x: pad + i * (botCellW + gap), y: topPad + topH + gap, w: botCellW, h: botH };
            });

            // Gallery: right column, full height
            if (wins.includes("Gallery")) {
                layout["Gallery"] = { x: pad + leftW + gap, y: topPad, w: galleryW, h: areaH };
            }
        }
        return layout;
    })();

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

        const IDLE_DELAY_MS = 1500;  // waktu tunggu sedang
        const DRIFT_SPEED = 0.6;     // kecepatan sedang
        const DRIFT_RADIUS_X = 180;  // jangkauan horizontal sedang
        const DRIFT_RADIUS_Y = 120;  // jangkauan vertikal sedang

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
        let frameCount = 0;

        const animate = () => {
            if (document.hidden) {
                isPaused = true;
                return; // stop loop — resumed via visibilitychange
            }
            rafId = requestAnimationFrame(animate);

            // Throttle to every 3rd frame when windows are open (save CPU)
            if (windowsOpenRef.current) {
                frameCount++;
                if (frameCount % 3 !== 0) return;
            }

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
        <>
        <div className="relative overflow-hidden" style={{ width: "calc(100vw - 32px)", height: "calc(100dvh - 32px)", borderRadius: HERO_FRAME_RADIUS }}>

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

            {/* Nav — pojok kiri atas */}
            <nav
                className="absolute top-0 left-0 right-0 px-6 pt-6 md:px-10 md:pt-10"
                style={{ zIndex: 55 }}
            >
                <div className="flex w-full items-center justify-between gap-6">
                {["About", "Work", "Blog", "Gallery", "Connect"].map((name) => (
                    <button
                        key={name}
                        onClick={() => toggleWindow(name)}
                        className="text-left text-sm md:text-xl font-bold tracking-wide text-white hover:text-white transition-colors duration-150"
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
                    >
                        {name.toLowerCase()}
                    </button>
                ))}
                </div>
            </nav>


            {/* BlurOverlay — click to peek/unpeek (show desktop) — desktop only */}
            <AnimatePresence>
                {!isMobile && openWindows.length > 0 && (
                    <BlurOverlay onClose={() => setPeeking(p => !p)} peeking={peeking} />
                )}
            </AnimatePresence>

            {/* Desktop: windowed mode with blur, drag, resize */}
            <AnimatePresence>
                {!isMobile && openWindows.map((name, index) => (
                    <Window
                        key={name}
                        title={name}
                        zIndex={BASE_Z + (windowZMap[name] ?? index)}
                        onFocus={() => bringToFront(name)}
                        onClose={() => closeWindow(name)}
                        initialWidth={gridLayout[name]?.w ?? (["Gallery", "Blog", "Work"].includes(name) ? 820 : 560)}
                        initialHeight={gridLayout[name]?.h ?? (["Gallery", "Blog", "Work"].includes(name) ? 620 : 480)}
                        gridPosition={gridLayout[name]}
                        peeking={peeking}
                    >
                        {name === "About" && <AboutWindow />}
                        {name === "Work" && <WorkWindow />}
                        {name === "Blog" && <BlogWindow />}
                        {name === "Gallery" && <GalleryWindow />}
                        {name === "Connect" && <ConnectionWindow />}
                        {name === "Admin" && <AdminWindow />}
                    </Window>
                ))}
            </AnimatePresence>

            {/* Mobile: full-screen solid view */}
            <AnimatePresence>
                {isMobile && openWindows.length > 0 && (() => {
                    const name = openWindows[openWindows.length - 1];
                    return (
                        <motion.div
                            key={`mobile-${name}`}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="mobile-fullview"
                        >
                            <div className="mobile-fullview-header">
                                <span className="mobile-fullview-title">{name}</span>
                            </div>
                            <div className="mobile-fullview-content">
                                {name === "About" && <AboutWindow />}
                                {name === "Work" && <WorkWindow />}
                                {name === "Blog" && <BlogWindow />}
                                {name === "Gallery" && <GalleryWindow />}
                                {name === "Connect" && <ConnectionWindow />}
                                {name === "Admin" && <AdminWindow />}
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

        </div>

            {/* LAM — di luar hero (fixed), biar concave corners nyambung ke frame tanpa kena overflow:hidden */}
            <div
                style={{ position: "fixed", bottom: 0, left: 0, pointerEvents: "none", zIndex: 55, lineHeight: 0.7, background: "#111", borderTopRightRadius: HERO_FRAME_RADIUS, padding: `1.5rem 2rem ${HERO_FRAME_GAP} ${HERO_FRAME_GAP}` }}
            >
                {/* Concave corner kiri atas */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: HERO_FRAME_GAP,
                        width: HERO_FRAME_RADIUS,
                        height: HERO_FRAME_RADIUS,
                        background: "radial-gradient(circle at 100% 100%, transparent calc(100% - 1px), #111 100%)",
                    }}
                />
                {/* Concave corner kanan bawah */}
                <div
                    style={{
                        position: "absolute",
                        bottom: HERO_FRAME_GAP,
                        left: "100%",
                        width: HERO_FRAME_RADIUS,
                        height: HERO_FRAME_RADIUS,
                        background: "radial-gradient(circle at 0 0, transparent calc(100% - 1px), #111 100%)",
                    }}
                />
                <span
                    className="font-black text-white select-none"
                    style={{ fontSize: "clamp(8rem, 28vw, 32rem)", display: "block", letterSpacing: "-0.04em", fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                    LAM.
                </span>
            </div>
        </>
    );
}
