"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface WindowProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Window({ title, onClose, children }: WindowProps) {
    const windowRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({ isDragging: false, startX: 0, startY: 0, offsetX: 0, offsetY: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [initialized, setInitialized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [hoveringButtons, setHoveringButtons] = useState(false);

    // Center window on mount
    useEffect(() => {
        if (windowRef.current) {
            const w = windowRef.current.offsetWidth;
            const h = windowRef.current.offsetHeight;
            setPosition({
                x: (window.innerWidth - w) / 2,
                y: (window.innerHeight - h) / 2,
            });
            setInitialized(true);
        }
    }, []);

    // Drag logic (disabled when maximized or minimized)
    const onMouseDown = (e: React.MouseEvent) => {
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
        onClose();
    };

    // Compute dynamic style based on state
    const windowStyle: React.CSSProperties = isMaximized
        ? {
            position: "fixed",
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            maxWidth: "100vw",
            maxHeight: "100vh",
            zIndex: 50,
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
            width: "560px",
            maxWidth: "90vw",
            maxHeight: isMinimized ? "48px" : "70vh",
            zIndex: 50,
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
        >
            {/* Title Bar */}
            <div
                onMouseDown={onMouseDown}
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
                    {/* Close — merah */}
                    <button
                        onClick={handleClose}
                        onMouseDown={(e) => e.stopPropagation()}
                        title="Close"
                        style={trafficButtonStyle("#FF5F57")}
                    >
                        {hoveringButtons && (
                            <span style={{
                                position: "absolute",
                                fontSize: "8px",
                                color: "rgba(0,0,0,0.5)",
                                fontWeight: 700,
                                lineHeight: 1,
                                pointerEvents: "none",
                            }}>
                                ✕
                            </span>
                        )}
                    </button>

                    {/* Minimize — kuning */}
                    <button
                        onClick={handleMinimize}
                        onMouseDown={(e) => e.stopPropagation()}
                        title={isMinimized ? "Restore" : "Minimize"}
                        style={trafficButtonStyle("#FEBC2E")}
                    >
                        {hoveringButtons && (
                            <span style={{
                                position: "absolute",
                                fontSize: "10px",
                                color: "rgba(0,0,0,0.5)",
                                fontWeight: 700,
                                lineHeight: 1,
                                pointerEvents: "none",
                                marginTop: "-1px",
                            }}>
                                −
                            </span>
                        )}
                    </button>

                    {/* Maximize — hijau */}
                    <button
                        onClick={handleMaximize}
                        onMouseDown={(e) => e.stopPropagation()}
                        title={isMaximized ? "Restore" : "Maximize"}
                        style={trafficButtonStyle("#28C840")}
                    >
                        {hoveringButtons && (
                            <span style={{
                                position: "absolute",
                                fontSize: "8px",
                                color: "rgba(0,0,0,0.5)",
                                fontWeight: 700,
                                lineHeight: 1,
                                pointerEvents: "none",
                            }}>
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
                        <span style={{ fontSize: "11px", marginLeft: "6px", color: "#2C2C2C50" }}>
                            — minimized
                        </span>
                    )}
                </span>

                {/* Spacer */}
                <div style={{ width: "42px" }} />
            </div>

            {/* Content — hidden when minimized */}
            {!isMinimized && (
                <div
                    style={{
                        padding: "24px",
                        overflowY: "auto",
                        maxHeight: isMaximized ? "calc(100vh - 48px)" : "calc(70vh - 48px)",
                        color: "#2C2C2C",
                    }}
                >
                    {children}
                </div>
            )}
        </motion.div>
    );
}