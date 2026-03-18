"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import { playOpenSound, playCloseSound } from "@/lib/audio";

interface WindowProps {
    title: string;
    onClose: () => void;
    onFocus?: () => void;
    onMenuToggle?: () => void;
    menuOpen?: boolean;
    zIndex?: number;
    initialWidth?: number;
    initialHeight?: number;
    children: React.ReactNode;
}

const MIN_W = 360;
const MIN_H = 240;
const DEFAULT_W = 560;
const DEFAULT_H = 480;

const trafficButtonStyle = (color: string): React.CSSProperties => ({
    width: "14px",
    height: "14px",
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

export default function Window({ title, onClose, onFocus, onMenuToggle, menuOpen = false, zIndex = 50, initialWidth, initialHeight, children }: WindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
    const resizeRef = useRef({ isResizing: false, startX: 0, startY: 0, startW: 0, startH: 0 });

    const initW = initialWidth ?? DEFAULT_W;
    const initH = initialHeight ?? DEFAULT_H;

    const positionRef = useRef({ x: 0, y: 0 });
    const sizeRef = useRef({ w: initW, h: initH });
    const [initialized, setInitialized] = useState(false);
    const [, forceUpdate] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [hoveringButtons, setHoveringButtons] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile
    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const check = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            setIsMaximized(mobile);
        };
        check();
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

    // Random spawn offset – generated once on mount, stays fixed
    const [randomOffset] = useState(() => ({
        x: (Math.random() - 0.5) * 180, // -180 to +180 px
        y: (Math.random() - 0.5) * 120, // -120 to +120 px
    }));

    // On first mount → center + random scatter. On size prop change → only resize, keep position.
    useEffect(() => {
        if (isMobile) {
            // On mobile always fullscreen — just mark initialized so entry animation plays
            if (!initialized) setInitialized(true);
            return;
        }
        sizeRef.current = { w: initW, h: initH };
        if (!initialized) {
            positionRef.current = {
                x: (window.innerWidth - initW) / 2 + randomOffset.x,
                y: (window.innerHeight - initH) / 2 + randomOffset.y,
            };
            setInitialized(true);
        } else {
            forceUpdate(f => f + 1);
        }
    }, [initW, initH, isMobile, initialized, randomOffset]);

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
            offsetX: positionRef.current.x,
            offsetY: positionRef.current.y,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!dragRef.current.isDragging) return;
            const newX = dragRef.current.offsetX + (e.clientX - dragRef.current.startX);
            const newY = dragRef.current.offsetY + (e.clientY - dragRef.current.startY);
            const TITLE_H = 48;
            const clampedX = Math.min(Math.max(newX, 0), window.innerWidth - sizeRef.current.w);
            const clampedY = Math.min(Math.max(newY, 0), window.innerHeight - TITLE_H);
            positionRef.current = { x: clampedX, y: clampedY };
            // Direct DOM update — skip React re-render during drag
            if (windowRef.current) {
                windowRef.current.style.left = `${clampedX}px`;
                windowRef.current.style.top = `${clampedY}px`;
            }
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
            startW: sizeRef.current.w,
            startH: sizeRef.current.h,
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!resizeRef.current.isResizing) return;
            const newW = Math.max(MIN_W, resizeRef.current.startW + (e.clientX - resizeRef.current.startX));
            const newH = Math.max(MIN_H, resizeRef.current.startH + (e.clientY - resizeRef.current.startY));
            sizeRef.current = { w: newW, h: newH };
            // Direct DOM update — skip React re-render during resize
            if (windowRef.current) {
                windowRef.current.style.width = `${newW}px`;
                windowRef.current.style.height = `${newH}px`;
            }
        };

        const onMouseUp = () => {
            resizeRef.current.isResizing = false;
            // One re-render to sync content area height
            forceUpdate(f => f + 1);
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
            background: "rgba(26, 26, 26, 0.75)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "none",
            boxShadow: "none",
            pointerEvents: "auto",
        }
        : {
            position: "fixed",
            left: positionRef.current.x,
            top: positionRef.current.y,
            width: `${sizeRef.current.w}px`,
            height: isMinimized ? "48px" : `${sizeRef.current.h}px`,
            minWidth: `${MIN_W}px`,
            minHeight: isMinimized ? "48px" : `${MIN_H}px`,
            zIndex,
            borderRadius: "12px",
            overflow: "hidden",
            background: "rgba(26, 26, 26, 0.55)",
            backdropFilter: "blur(40px) saturate(180%)",
            WebkitBackdropFilter: "blur(40px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.8) inset",
            pointerEvents: "auto",
        };

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
                    background: "rgba(26, 26, 26, 0.4)",
                    userSelect: "none",
                    flexShrink: 0,
                }}
            >
                {/* Traffic light buttons — hidden on mobile */}
                {!isMobile && (
                    <div
                        style={{ display: "flex", gap: "8px", alignItems: "center" }}
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
                                <span style={{ position: "absolute", fontSize: "10px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>✕</span>
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
                                <span style={{ position: "absolute", fontSize: "12px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none", marginTop: "-1px" }}>−</span>
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
                                <span style={{ position: "absolute", fontSize: "10px", color: "rgba(0,0,0,0.5)", fontWeight: 700, lineHeight: 1, pointerEvents: "none" }}>
                                    {isMaximized ? "⊙" : "⤢"}
                                </span>
                            )}
                        </button>
                    </div>
                )}

                {/* Title */}
                <span
                    style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.6)",
                        letterSpacing: "0.05em",
                    }}
                >
                    {title}
                    {isMinimized && (
                        <span style={{ fontSize: "11px", marginLeft: "6px", color: "rgba(255, 255, 255, 0.3)" }}>— minimized</span>
                    )}
                </span>

                {/* Mobile buttons — right side of title bar */}
                {isMobile ? (
                    onMenuToggle ? (
                        <button
                            onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
                            onMouseDown={(e) => e.stopPropagation()}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "42px",
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ width: "20px", height: "14px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <span
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "2px",
                                        borderRadius: "2px",
                                        background: "#E0E0E0",
                                        transformOrigin: "center",
                                        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                                        transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none",
                                    }}
                                />
                                <span
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "2px",
                                        borderRadius: "2px",
                                        background: "#E0E0E0",
                                        transition: "opacity 0.2s, transform 0.2s",
                                        opacity: menuOpen ? 0 : 1,
                                        transform: menuOpen ? "scaleX(0)" : "scaleX(1)",
                                    }}
                                />
                                <span
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "2px",
                                        borderRadius: "2px",
                                        background: "#E0E0E0",
                                        transformOrigin: "center",
                                        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                                        transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none",
                                    }}
                                />
                            </div>
                        </button>
                    ) : (
                        <button
                            onClick={handleClose}
                            onMouseDown={(e) => e.stopPropagation()}
                            aria-label="Close window"
                            style={{
                                background: "rgba(255, 95, 87, 0.15)",
                                border: "1px solid rgba(255, 95, 87, 0.3)",
                                cursor: "pointer",
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "28px",
                                height: "28px",
                                borderRadius: "8px",
                                flexShrink: 0,
                                color: "#FF5F57",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    )
                ) : (
                    <div style={{ width: "42px" }} />
                )}
            </div>

            {/* Content */}
            {!isMinimized && (
                <div
                    style={{
                        padding: "24px",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        height: isMaximized ? "calc(100vh - 48px)" : `calc(${sizeRef.current.h}px - 48px)`,
                        color: "#E0E0E0",
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
                        <circle cx="8" cy="8" r="1.5" fill="rgba(255,255,255,0.25)" />
                        <circle cx="4" cy="8" r="1.5" fill="rgba(255,255,255,0.15)" />
                        <circle cx="8" cy="4" r="1.5" fill="rgba(255,255,255,0.15)" />
                    </svg>
                </div>
            )}
        </motion.div>
    );
}