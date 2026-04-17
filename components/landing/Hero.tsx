"use client";

import { useEffect, useRef } from "react";
import { SparklesText } from "@/components/ui/SparklesText";
import PixelTrail from "@/components/ui/PixelTrail";

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

const LAM_BADGE_TOP_RADIUS = "1.5rem";
const LAM_BADGE_PADDING = "28px";
const LAM_BADGE_TOP_PADDING = "2rem";
const LAM_BADGE_RIGHT_PADDING = "1.5rem";
const LAM_FONT_SIZE = "clamp(6rem, 22vw, 24rem)";

export default function Hero() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        const container = containerRef.current;
        const grid = gridRef.current;
        if (!viewport || !container || !grid) return;

        const imageFor = (baseX: number, baseY: number) =>
            IMAGES[(baseX + baseY * CONFIG.COLS) % IMAGES.length];

        const state = {
            gridItems: [] as { element: HTMLDivElement; baseX: number; baseY: number; tileX: number; tileY: number; yOffset: number }[],
            cameraOffset: { x: 0, y: 0 },
            targetOffset: { x: 0, y: 0 },
            driftTime: 0,
        };

        const DRIFT_SPEED = 0.6;
        const DRIFT_RADIUS_X = 180;
        const DRIFT_RADIUS_Y = 120;

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

        let resizeTimeout: ReturnType<typeof setTimeout> | undefined;
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
                return;
            }
            rafId = requestAnimationFrame(animate);

            state.driftTime += DRIFT_SPEED * 0.016;
            const driftX = Math.sin(state.driftTime * 0.4) * DRIFT_RADIUS_X
                + Math.sin(state.driftTime * 0.13) * DRIFT_RADIUS_X * 0.3;
            const driftY = Math.cos(state.driftTime * 0.25) * DRIFT_RADIUS_Y
                + Math.cos(state.driftTime * 0.17) * DRIFT_RADIUS_Y * 0.4;
            state.targetOffset.x += (driftX - state.targetOffset.x) * 0.012;
            state.targetOffset.y += (driftY - state.targetOffset.y) * 0.012;

            const dx = state.targetOffset.x - state.cameraOffset.x;
            const dy = state.targetOffset.y - state.cameraOffset.y;
            if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
                state.cameraOffset.x += dx * CONFIG.easingFactor;
                state.cameraOffset.y += dy * CONFIG.easingFactor;
                updateItemPositions();
            }
        };

        calculateCellSizeAndTiling();
        createGridItems();
        updateItemPositions();

        window.addEventListener("resize", onResize);

        const onVisibilityChange = () => {
            if (!document.hidden && isPaused) {
                isPaused = false;
                rafId = requestAnimationFrame(animate);
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);
        animate();

        return () => {
            cancelAnimationFrame(rafId);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimeout);
        };
    }, []);

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0d0d0d]">
            {/* Infinite Grid Background — filling parent frame */}
            <div ref={viewportRef} className="absolute inset-0">
                <PixelTrail
                    gridSize={50}
                    trailSize={0.1}
                    maxAge={250}
                    interpolate={5}
                    color="#0e1013"
                    gooeyFilter={{ id: "custom-goo-filter", strength: 2 }}
                />
                <div
                    ref={containerRef}
                    style={{
                        position: "absolute",
                        inset: "-10vmin",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <div ref={gridRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                </div>
            </div>

            {/* LAM Text — Clean version without badge background */}
            <div
                style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "2rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    pointerEvents: "none",
                    zIndex: 55,
                }}
            >
                <div
                    className="font-black text-white select-none flex items-baseline"
                    style={{ 
                        fontSize: LAM_FONT_SIZE, 
                        letterSpacing: "-0.04em", 
                        fontFamily: "Helvetica, Arial, sans-serif",
                        lineHeight: 0.7 
                    }}
                >
                    <SparklesText
                        text="LAM"
                        className="font-black"
                        style={{ fontSize: LAM_FONT_SIZE, letterSpacing: "-0.04em", fontFamily: "Helvetica, Arial, sans-serif", lineHeight: 0.7 }}
                        sparklesCount={12}
                        colors={{ first: "#ffffff", second: "#aaaaaa" }}
                    />
                    
                    {/* Asterisk and Arrow Container */}
                    <div className="relative flex items-baseline">
                        {/* Arrow — now relative to the asterisk */}
                        <div 
                            style={{ 
                                position: "absolute",
                                bottom: "100%",
                                left: "50%",
                                transform: "translateX(-40%)",
                                marginBottom: "var(--hero-arrow-margin, 0.5rem)",
                                zIndex: 60 
                            }}
                        >
                            <svg 
                                width="clamp(2.8rem, 9vw, 10rem)" 
                                height="clamp(2.8rem, 9vw, 10rem)"
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="white" 
                                strokeWidth="4.5" 
                                strokeLinecap="butt" 
                                strokeLinejoin="miter"
                            >
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                            </svg>
                        </div>

                        <svg 
                            width="0.32em" 
                            height="0.32em" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="4.5" 
                            strokeLinecap="butt"
                            style={{ marginLeft: "0.1em", transform: "translateY(-0.04em)" }}
                        >
                            <line x1="12" y1="2" x2="12" y2="22" />
                            <line x1="3.34" y1="7" x2="20.66" y2="17" />
                            <line x1="20.66" y1="7" x2="3.34" y2="17" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
