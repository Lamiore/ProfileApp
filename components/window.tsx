"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

// --- Sound effects via Web Audio API ---
const playSound = (freq: number, endFreq: number, duration: number, volume: number, type: OscillatorType = "sine") => {
    try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch { /* silent fail */ }
};

const playOpenSound = () => {
    playSound(600, 1200, 0.15, 0.08, "sine");
    setTimeout(() => playSound(900, 1400, 0.1, 0.05, "sine"), 60);
};

const playCloseSound = () => {
    playSound(800, 400, 0.15, 0.06, "sine");
};

interface WindowProps {
    title: string;
    onClose: () => void;
    onFocus?: () => void;
    zIndex?: number;
    initialWidth?: number;
    initialHeight?: number;
    children: React.ReactNode;
}

const MIN_W = 360;
const MIN_H = 240;
const DEFAULT_W = 560;
const DEFAULT_H = 480;

export default function Window({ title, onClose, onFocus, zIndex = 50, initialWidth, initialHeight, children }: WindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
    const resizeRef = useRef({ isResizing: false, startX: 0, startY: 0, startW: 0, startH: 0 });

    const initW = initialWidth ?? DEFAULT_W;
    const initH = initialHeight ?? DEFAULT_H;

    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [size, setSize] = useState({ w: initW, h: initH });
    const [initialized, setInitialized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [hoveringButtons, setHoveringButtons] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        const check = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (mobile) setIsMaximized(true);
        };
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // On first mount → center. On size prop change → only resize, keep position.
    useEffect(() => {
        if (isMobile) return; // skip on mobile — always fullscreen
        setSize({ w: initW, h: initH });
        if (!initialized) {
            setPosition({
                x: (window.innerWidth - initW) / 2,
                y: (window.innerHeight - initH) / 2,
            });
            setInitialized(true);
        }
    }, [initW, initH, isMobile]);

    // Play open sound on mount
    useEffect(() => {
        playOpenSound();
    }, []);

    // Title bar drag (disabled when maximized or minimized)
    const onTitleMouseDown = (e: React.MouseEvent) => {
        if (isMaximized || isMinimized) return;
        dragRef.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            offsetX: position.x,
            offsetY: position.y,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging) return;
            setPosition({
                x: dragRef.current.offsetX + (e.clientX - dragRef.current.startX),
                y: dragRef.current.offsetY + (e.clientY - dragRef.current.startY),
            });
        };

        const onMouseUp = () => {
            dragRef.current.isDragging = false;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    // Resize handle (bottom-right corner)
    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMaximized) return;
        resizeRef.current = {
            isResizing: true,
            startX: e.clientX,
            startY: e.clientY,
            startW: size.w,
            startH: size.h,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current.isResizing) return;
            const newW = Math.max(MIN_W, resizeRef.current.startW + (e.clientX - resizeRef.current.startX));
            const newH = Math.max(MIN_H, resizeRef.current.startH + (e.clientY - resizeRef.current.startY));
            setSize({ w: newW, h: newH });
        };

        const onMouseUp = () => {
            resizeRef.current.isResizing = false;
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
    };

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMinimized((prev) => !prev);
        setIsMaximized(false);
    };

    const handleMaximize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMaximized((prev) => !prev);
        setIsMinimized(false);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        playCloseSound();
        onClose();
    };

    const windowStyle: React.CSSProperties = isMaximized
        ? {
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            zIndex,
            borderRadius: 0,
            overflow: "hidden",
            background: "rgba(245, 240, 232, 0.75)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "none",
            boxShadow: "none",
            pointerEvents: "auto",
        }
        : {
            position: "fixed",
            left: position.x,
            top: position.y,
            width: isMinimized ? `${size.w}px` : `${size.w}px`,
            height: isMinimized ? "48px" : `${size.h}px`,
            minWidth: `${MIN_W}px`,
            minHeight: isMinimized ? "48px" : `${MIN_H}px`,
            zIndex,
            borderRadius: "12px",
            overflow: "hidden",
            background: "rgba(245, 240, 232, 0.55)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.8) inset",
            pointerEvents: "auto",
        };

    const trafficButtonStyle = (color: string): React.CSSProperties => ({
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: color,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        position: "relative",
        transition: "filter 0.15s ease",
    });

    return (
        <motion.div
            ref={windowRef}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={
                initialized
                    ? { opacity: 1, scale: 1, y: 0 }
                    : { opacity: 0, scale: 0.92, y: 20 }
            }
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={windowStyle}
            onMouseDown={onFocus}
        >
            {/* Title Bar */}
            <div
                onMouseDown={onTitleMouseDown}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "14px 16px",
                    cursor: isMaximized || isMinimized ? "default" : "grab",
                    borderBottom: isMinimized ? "none" : "1px solid rgba(44,44,44,0.1)",
                    background: "rgba(245,240,232,0.4)",
                    userSelect: "none",
                    flexShrink: 0,
                }}
            >
                {/* Traffic light buttons */}
                <div
                    style={{ display: "flex", gap: "6px", alignItems: "center" }}
                    onMouseEnter={() => setHoveringButtons(true)}
                    onMouseLeave={() => setHoveringButtons(false)}
                >
                    {/* Close */}
                    <button
                        onClick={handleClose}
                        onMouseDown={(e) => e.stopPropagation()}
                        title="Close"
                        style={trafficButtonStyle("#FF5F57")}
                    >
                        {hoveringButtons && (
                            <span style={{ position: "absolute", fontSize: "8px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>✕</span>
                        )}
                    </button>

                    {/* Minimize */}
                    <button
                        onClick={handleMinimize}
                        onMouseDown={(e) => e.stopPropagation()}
                        title={isMinimized ? "Restore" : "Minimize"}
                        style={trafficButtonStyle("#FEBC2E")}
                    >
                        {hoveringButtons && (
                            <span style={{ position: "absolute", fontSize: "10px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none", marginTop: "-1px" }}>−</span>
                        )}
                    </button>

                    {/* Maximize */}
                    <button
                        onClick={handleMaximize}
                        onMouseDown={(e) => e.stopPropagation()}
                        title={isMaximized ? "Restore" : "Maximize"}
                        style={trafficButtonStyle("#28C840")}
                    >
                        {hoveringButtons && (
                            <span style={{ position: "absolute", fontSize: "8px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>
                                {isMaximized ? "⊙" : "⤢"}
                            </span>
                        )}
                    </button>
                </div>

                {/* Title */}
                <span
                    style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#2C2C2C99",
                        letterSpacing: "0.05em",
                    }}
                >
                    {title}
                    {isMinimized && (
                        <span style={{ fontSize: "11px", marginLeft: "6px", color: "#2C2C2C50" }}>— minimized</span>
                    )}
                </span>

                <div style={{ width: "42px" }} />
            </div>

            {/* Content */}
            {!isMinimized && (
                <div
                    style={{
                        padding: "24px",
                        overflowY: "auto",
                        height: isMaximized ? "calc(100vh - 48px)" : `calc(${size.h}px - 48px)`,
                        color: "#2C2C2C",
                        boxSizing: "border-box",
                    }}
                >
                    {children}
                </div>
            )}

            {/* Resize handle — bottom-right corner */}
            {!isMaximized && !isMinimized && (
                <div
                    onMouseDown={onResizeMouseDown}
                    title="Resize"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "20px",
                        height: "20px",
                        cursor: "nwse-resize",
                        zIndex: 10,
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "flex-end",
                        padding: "4px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Grip dots — like macOS */}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <circle cx="8" cy="8" r="1.5" fill="rgba(44,44,44,0.25)" />
                        <circle cx="4" cy="8" r="1.5" fill="rgba(44,44,44,0.15)" />
                        <circle cx="8" cy="4" r="1.5" fill="rgba(44,44,44,0.15)" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}