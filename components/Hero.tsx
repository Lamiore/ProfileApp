"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Window from "@/components/window";
import BlurOverlay from "@/components/BlurOverlay";
import AboutWindow from "@/components/windows/aboutwindow";
import ProjectWindow from "@/components/windows/projectwindow";
import BlogWindow from "@/components/windows/blogwindow";
import GalleryWindow from "@/components/windows/gallerywindow";
import ConnectionWindow from "@/components/windows/connectionwindow";

const IMAGES = [
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-01.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879560&s=086ab8a578db90a897ccb42465a7075b",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-02.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879561&s=dc1e49888250a4939aac294b63fcceea",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-03.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879561&s=47245c8a50622ce01819ed9d1481153f",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-04.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879562&s=fbfefc6eee114f91ad6ccd58477b8feb",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-05.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879563&s=2a6b546b9601c21efb677c51bf39e4d2",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-06.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879564&s=0ac91ce79fa486fe66c5e79d30670d88",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-07.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879565&s=9a28f44510dc21fadd9449f4b328500c",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-08.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879566&s=eedecd5320ec481c45f2185416773346",
    "https://images.okaydev.co/production/uploads/articles/building-an-infinite-animated-grid-no-webgl-needed/okay-creature-09.jpg?w=1024&h=1024&auto=compress%2Cformat&fit=min&dm=1770879566&s=f60b32386d814a8df539b22f930f23c4",
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
};

const buttons = ["About", "Project", "Blog", "Gallery", "Connection"];

export default function Hero() {
    const viewportRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [activeWindow, setActiveWindow] = useState<string | null>(null);

    useEffect(() => {
        const viewport = viewportRef.current;
        const container = containerRef.current;
        const grid = gridRef.current;
        if (!viewport || !container || !grid) return;

        const imageFor = (baseX: number, baseY: number) => {
            const i = (baseX + baseY * CONFIG.COLS) % IMAGES.length;
            return IMAGES[(i + IMAGES.length) % IMAGES.length];
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

        const IDLE_DELAY_MS = 2000;  // 2 detik sebelum drift aktif
        const DRIFT_SPEED = 0.3;     // kecepatan drift (px per frame equiv)
        const DRIFT_RADIUS_X = 180;  // seberapa jauh drift horizontal
        const DRIFT_RADIUS_Y = 120;  // seberapa jauh drift vertikal

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
            tilesX = Math.max(1, neededTilesX + CONFIG.tileOverscan);
            tilesY = Math.max(1, neededTilesY + CONFIG.tileOverscan);
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

        const onResize = () => {
            calculateCellSizeAndTiling();
            createGridItems();
            updateItemPositions();
        };

        const animate = () => {
            rafId = requestAnimationFrame(animate);

            const now = performance.now();
            const idleMs = now - state.lastInteractionTime;

            // Masuk idle mode setelah IDLE_DELAY_MS
            if (!state.isDragging && idleMs > IDLE_DELAY_MS) {
                state.driftActive = true;
            }

            if (state.driftActive) {
                // Blend factor naik perlahan (fade-in drift)
                state.driftBlendFactor = Math.min(1, state.driftBlendFactor + 0.004);
                state.driftTime += DRIFT_SPEED * 0.016; // ~60fps equiv

                // Organic figure-8 / Lissajous path
                const driftX = Math.sin(state.driftTime * 0.4) * DRIFT_RADIUS_X
                    + Math.sin(state.driftTime * 0.13) * DRIFT_RADIUS_X * 0.3;
                const driftY = Math.cos(state.driftTime * 0.25) * DRIFT_RADIUS_Y
                    + Math.cos(state.driftTime * 0.17) * DRIFT_RADIUS_Y * 0.4;

                // Blend dari posisi user ke posisi drift
                state.targetOffset.x += (driftX - state.targetOffset.x) * 0.004 * state.driftBlendFactor;
                state.targetOffset.y += (driftY - state.targetOffset.y) * 0.004 * state.driftBlendFactor;
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
            const speedFactor = Math.min(state.scrollSpeed * 0.01, 1);
            state.targetScale = 1 - speedFactor * CONFIG.maxScaleEffect;
            state.scrollSpeed *= 0.85;
            state.containerScale += (state.targetScale - state.containerScale) * CONFIG.scaleEasing;
            state.containerRotationX += (state.targetRotationX - state.containerRotationX) * CONFIG.rotationEasing;
            state.containerRotationY += (state.targetRotationY - state.containerRotationY) * CONFIG.rotationEasing;
            container.style.transform = `scale(${state.containerScale}) skewY(${state.containerRotationX}deg) skewX(${state.containerRotationY}deg)`;
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

        animate();

        return () => {
            cancelAnimationFrame(rafId);
            viewport.removeEventListener("mousedown", onMouseDown);
            viewport.removeEventListener("mousemove", onMouseMove);
            viewport.removeEventListener("mouseup", onMouseUp);
            viewport.removeEventListener("mouseleave", onMouseUp);
            viewport.removeEventListener("wheel", onWheel);
            viewport.removeEventListener("touchstart", onTouchStart);
            viewport.removeEventListener("touchmove", onTouchMove);
            viewport.removeEventListener("touchend", onTouchEnd);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden">

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

            {/* Content — kiri bawah */}
            <div
                className="absolute inset-0 z-10 flex flex-col justify-end p-12"
                style={{ pointerEvents: "none" }}
            >
                {/* Typography — kiri */}
                <div className="flex flex-col items-start gap-8">
                    <div className="flex flex-col gap-2">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-sm tracking-[0.3em] uppercase"
                            style={{ color: "#2C2C2C99" }}
                        >
                            Random
                        </motion.p>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[6rem] font-bold leading-none tracking-tight"
                            style={{ color: "#2C2C2C" }}
                        >
                            Lam
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            className="text-sm italic"
                            style={{ color: "#2C2C2CAA" }}
                        >
                            "Crafting experiences, one pixel at a time."
                        </motion.p>
                    </div>

                    {/* Buttons — liquid glass iOS 26 style */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 }}
                        className="flex gap-2 flex-wrap"
                        style={{ pointerEvents: "auto" }}
                    >
                        {buttons.map((btn, i) => (
                            <motion.button
                                key={btn}
                                onClick={() => setActiveWindow(btn)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.08 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                className="relative px-5 py-2.5 text-sm tracking-widest uppercase cursor-pointer overflow-hidden"
                                style={{
                                    borderRadius: "999px",
                                    color: "#2C2C2C",
                                    background: "rgba(255, 255, 255, 0.25)",
                                    backdropFilter: "blur(20px) saturate(180%)",
                                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                                    border: "1px solid rgba(255, 255, 255, 0.5)",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)",
                                    textShadow: "none",
                                }}
                            >
                                {btn}
                            </motion.button>
                        ))}
                    </motion.div>
                    <AnimatePresence>
                        {activeWindow && (
                            <>
                                <BlurOverlay onClose={() => setActiveWindow(null)} />
                                <Window title={activeWindow} onClose={() => setActiveWindow(null)}>
                                    {activeWindow === "About" && <AboutWindow />}
                                    {activeWindow === "Project" && <ProjectWindow />}
                                    {activeWindow === "Blog" && <BlogWindow />}
                                    {activeWindow === "Gallery" && <GalleryWindow />}
                                    {activeWindow === "Connection" && <ConnectionWindow />}
                                </Window>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </div>
    );
}