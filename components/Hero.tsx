"use client";

import { useEffect, useRef } from "react";
import Nav from "@/components/Nav";

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

const HERO_FRAME_RADIUS = "2rem";
const LAM_BADGE_RADIUS = "1.5rem";
const LAM_BADGE_PADDING = "24px";
const LAM_BADGE_TOP_PADDING = "1.1rem";
const LAM_BADGE_RIGHT_PADDING = "1.5rem";
const LAM_FONT_SIZE = "clamp(6rem, 22vw, 24rem)";

export default function Hero() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const isMobileRef = useRef(false);

    useEffect(() => {
        const check = () => {
            isMobileRef.current = window.innerWidth <= 768;
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

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
            lastInteractionTime: performance.now(),
            driftTime: 0,
            driftActive: false,
            driftBlendFactor: 0,
        };

        const IDLE_DELAY_MS = 1500;
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

            const now = performance.now();
            const idleMs = now - state.lastInteractionTime;

            if (!state.isDragging && idleMs > IDLE_DELAY_MS) {
                state.driftActive = true;
            }

            if (state.driftActive) {
                state.driftBlendFactor = Math.min(1, state.driftBlendFactor + 0.012);
                state.driftTime += DRIFT_SPEED * 0.016;
                const driftX = Math.sin(state.driftTime * 0.4) * DRIFT_RADIUS_X
                    + Math.sin(state.driftTime * 0.13) * DRIFT_RADIUS_X * 0.3;
                const driftY = Math.cos(state.driftTime * 0.25) * DRIFT_RADIUS_Y
                    + Math.cos(state.driftTime * 0.17) * DRIFT_RADIUS_Y * 0.4;
                state.targetOffset.x += (driftX - state.targetOffset.x) * 0.012 * state.driftBlendFactor;
                state.targetOffset.y += (driftY - state.targetOffset.y) * 0.012 * state.driftBlendFactor;
            } else {
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
            <div
                className="relative overflow-hidden"
                style={{ width: "100%", height: "100%", borderRadius: HERO_FRAME_RADIUS }}
            >
                {/* Infinite Grid Background — filling parent frame */}
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

                {/* Nav — absolute over grid */}
                <div className="absolute top-0 left-0 right-0" style={{ zIndex: 55 }}>
                    <Nav />
                </div>
            </div>

            {/* LAM badge — outside hero so concave corners connect to frame */}
            <div
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    pointerEvents: "none",
                    zIndex: 55,
                    lineHeight: 0.7,
                    background: "#161415",
                    borderTopRightRadius: LAM_BADGE_RADIUS,
                    padding: `${LAM_BADGE_TOP_PADDING} ${LAM_BADGE_RIGHT_PADDING} ${LAM_BADGE_PADDING} ${LAM_BADGE_PADDING}`,
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        left: LAM_BADGE_PADDING,
                        width: LAM_BADGE_RADIUS,
                        height: LAM_BADGE_RADIUS,
                        background: "radial-gradient(circle at 100% 100%, transparent calc(100% - 1px), #161415 100%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: LAM_BADGE_PADDING,
                        left: "100%",
                        width: LAM_BADGE_RADIUS,
                        height: LAM_BADGE_RADIUS,
                        background: "radial-gradient(circle at 0 0, transparent calc(100% - 1px), #161415 100%)",
                    }}
                />
                <span
                    className="font-black text-white select-none"
                    style={{ fontSize: LAM_FONT_SIZE, display: "block", letterSpacing: "-0.04em", fontFamily: "Helvetica, Arial, sans-serif" }}
                >
                    LAM.
                </span>
            </div>
        </>
    );
}
