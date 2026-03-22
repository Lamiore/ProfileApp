"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { usePageTransition } from "@/components/PageTransition";

export default function CardPage() {
    const { navigateTo } = usePageTransition();
    const cardRef = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState({ x: 0, y: 0 });
    const [drag, setDrag] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const animFrame = useRef<number>(0);
    const didDrag = useRef(false);
    const [flipped, setFlipped] = useState(false);
    const [resetting, setResetting] = useState(false);
    const idleTimer = useRef<ReturnType<typeof setTimeout>>(null);

    const resetIdle = useCallback(() => {
        setResetting(false);
        if (idleTimer.current) clearTimeout(idleTimer.current);
        idleTimer.current = setTimeout(() => {
            setResetting(true);
            setDrag({ x: 0, y: 0 });
            setFlipped(false);
        }, 3000);
    }, []);

    useEffect(() => {
        resetIdle();
        return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
    }, [resetIdle]);

    // Hover tilt — follows cursor
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (e.clientY - cy) / (rect.height / 2);
        setHover({ x: -ny * 20, y: nx * 20 });
        resetIdle();
    }, [resetIdle]);

    const handleMouseLeave = useCallback(() => {
        setHover({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    // Drag rotate
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        setResetting(false);
        setIsDragging(true);
        didDrag.current = false;
        lastPos.current = { x: e.clientX, y: e.clientY };
        velocity.current = { x: 0, y: 0 };
        cancelAnimationFrame(animFrame.current);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }, []);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) didDrag.current = true;
            lastPos.current = { x: e.clientX, y: e.clientY };
            velocity.current = { x: dx, y: dy };
            setDrag((r) => ({ x: r.x - dy * 0.4, y: r.y + dx * 0.4 }));
        },
        [isDragging]
    );

    const handlePointerUp = useCallback(() => {
        setIsDragging(false);
        let vx = velocity.current.x;
        let vy = velocity.current.y;
        const decay = () => {
            if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) return;
            vx *= 0.95;
            vy *= 0.95;
            setDrag((r) => ({ x: r.x - vy * 0.4, y: r.y + vx * 0.4 }));
            animFrame.current = requestAnimationFrame(decay);
        };
        animFrame.current = requestAnimationFrame(decay);
        resetIdle();
    }, [resetIdle]);

    const handleClick = useCallback(() => {
        if (!didDrag.current) setFlipped((f) => !f);
    }, []);

    const flipY = flipped ? 180 : 0;
    const totalX = isDragging ? drag.x : drag.x + hover.x;
    const totalY = isDragging ? drag.y + flipY : drag.y + hover.y + flipY;
    const normalizedY = ((totalY % 360) + 360) % 360;
    const showBack = normalizedY > 90 && normalizedY < 270;

    return (
        <div
            onMouseLeave={handleMouseLeave}
            style={{
                width: "100vw",
                height: "100vh",
                background: "#0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "24px",
                color: "#E0E0E0",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                position: "relative",
                userSelect: "none",
                overflow: "hidden",
            }}
        >
            {/* Back button */}
            <button
                onClick={() => navigateTo("/")}
                style={{
                    position: "absolute",
                    top: "32px",
                    left: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "rgba(224,224,224,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 0",
                    transition: "color 0.2s",
                    zIndex: 10,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#E0E0E0";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(224,224,224,0.5)";
                }}
            >
                <ArrowLeft size={16} /> Kembali
            </button>

            {/* 3D Card */}
            <div
                ref={cardRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onClick={handleClick}
                style={{
                    width: "min(480px, 85vw)",
                    aspectRatio: "1.75 / 1",
                    perspective: "1200px",
                    cursor: isDragging ? "grabbing" : "grab",
                    touchAction: "none",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        transformStyle: "preserve-3d",
                        transition: isDragging ? "none" : resetting ? "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "transform 0.15s ease-out",
                        transform: `rotateX(${totalX}deg) rotateY(${totalY}deg)`,
                    }}
                >
                    {/* Front */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backfaceVisibility: "hidden",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: !showBack
                                ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)"
                                : "none",
                        }}
                    >
                        <img
                            src="/namecard_front.png"
                            alt="Name Card Front"
                            draggable={false}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>

                    {/* Back */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: showBack
                                ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)"
                                : "none",
                        }}
                    >
                        <img
                            src="/namecard_back.png"
                            alt="Name Card Back"
                            draggable={false}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                    </div>
                </div>
            </div>

            {/* Hint */}
            <p
                style={{
                    fontSize: "12px",
                    color: "rgba(224,224,224,0.3)",
                    margin: 0,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                }}
            >
                Drag untuk memutar · Klik untuk membalik
            </p>
        </div>
    );
}
