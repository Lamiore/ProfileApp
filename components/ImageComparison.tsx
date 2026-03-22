"use client";

import { useRef, useEffect, useCallback } from "react";

interface ImageComparisonProps {
    beforeUrl: string;
    afterUrl: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export default function ImageComparison({
    beforeUrl,
    afterUrl,
    beforeLabel = "Before",
    afterLabel = "After",
}: ImageComparisonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const beforeRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const knobRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const currentPosition = useRef(50);

    const updateSlider = useCallback((position: number) => {
        position = Math.max(0, Math.min(100, position));
        currentPosition.current = position;

        if (beforeRef.current) {
            beforeRef.current.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        }
        if (lineRef.current) {
            lineRef.current.style.left = `${position}%`;
        }
        if (knobRef.current) {
            knobRef.current.style.left = `${position}%`;
            knobRef.current.setAttribute("aria-valuenow", String(Math.round(position)));
        }
    }, []);

    const handleMove = useCallback((clientX: number) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        updateSlider(percentage);
    }, [updateSlider]);

    useEffect(() => {
        const container = containerRef.current;
        const knob = knobRef.current;
        if (!container || !knob) return;

        // Mouse events
        const onKnobMouseDown = (e: MouseEvent) => {
            isDragging.current = true;
            container.classList.add("cmp-dragging");
            e.preventDefault();
        };

        const onContainerMouseDown = (e: MouseEvent) => {
            if (e.target === knob) return;
            isDragging.current = true;
            container.classList.add("cmp-dragging");
            handleMove(e.clientX);
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            handleMove(e.clientX);
        };

        const onMouseUp = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            container.classList.remove("cmp-dragging");
        };

        // Touch events
        const onKnobTouchStart = (e: TouchEvent) => {
            isDragging.current = true;
            container.classList.add("cmp-dragging");
            e.preventDefault();
        };

        const onContainerTouchStart = (e: TouchEvent) => {
            if (e.target === knob) return;
            isDragging.current = true;
            container.classList.add("cmp-dragging");
            handleMove(e.touches[0].clientX);
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!isDragging.current) return;
            handleMove(e.touches[0].clientX);
        };

        const onTouchEnd = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            container.classList.remove("cmp-dragging");
        };

        // Keyboard accessibility
        const onKeyDown = (e: KeyboardEvent) => {
            let newPosition = currentPosition.current;
            switch (e.key) {
                case "ArrowLeft":
                case "ArrowDown":
                    newPosition -= 5;
                    e.preventDefault();
                    break;
                case "ArrowRight":
                case "ArrowUp":
                    newPosition += 5;
                    e.preventDefault();
                    break;
                case "Home":
                    newPosition = 0;
                    e.preventDefault();
                    break;
                case "End":
                    newPosition = 100;
                    e.preventDefault();
                    break;
                default:
                    return;
            }
            updateSlider(newPosition);
        };

        knob.addEventListener("mousedown", onKnobMouseDown);
        container.addEventListener("mousedown", onContainerMouseDown);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        knob.addEventListener("touchstart", onKnobTouchStart, { passive: false });
        container.addEventListener("touchstart", onContainerTouchStart, { passive: false });
        document.addEventListener("touchmove", onTouchMove, { passive: false });
        document.addEventListener("touchend", onTouchEnd);

        knob.addEventListener("keydown", onKeyDown);

        // Initialize
        updateSlider(50);

        return () => {
            knob.removeEventListener("mousedown", onKnobMouseDown);
            container.removeEventListener("mousedown", onContainerMouseDown);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            knob.removeEventListener("touchstart", onKnobTouchStart);
            container.removeEventListener("touchstart", onContainerTouchStart);
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);

            knob.removeEventListener("keydown", onKeyDown);
        };
    }, [handleMove, updateSlider]);

    return (
        <div ref={containerRef} className="comparison-container">
            {/* Before Image (Left side) */}
            <div ref={beforeRef} className="image-wrapper image-before">
                <img src={beforeUrl} alt={beforeLabel} referrerPolicy="no-referrer" draggable={false} />
            </div>

            {/* After Image (Right side) */}
            <div className="image-wrapper image-after">
                <img src={afterUrl} alt={afterLabel} referrerPolicy="no-referrer" draggable={false} />
            </div>

            {/* Labels */}
            <span className="label label-before">{beforeLabel}</span>
            <span className="label label-after">{afterLabel}</span>

            {/* Slider Line with Gradient Fade */}
            <div ref={lineRef} className="slider-line" />

            {/* Center Knob */}
            <div
                ref={knobRef}
                className="slider-knob"
                tabIndex={0}
                role="slider"
                aria-label="Image comparison slider"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={50}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 25 25" fill="none">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.5 8C10.3284 8 11 7.32843 11 6.5C11 5.67157 10.3284 5 9.5 5C8.67157 5 8 5.67157 8 6.5C8 7.32843 8.67157 8 9.5 8ZM9.5 14C10.3284 14 11 13.3284 11 12.5C11 11.6716 10.3284 11 9.5 11C8.67157 11 8 11.6716 8 12.5C8 13.3284 8.67157 14 9.5 14ZM11 18.5C11 19.3284 10.3284 20 9.5 20C8.67157 20 8 19.3284 8 18.5C8 17.6716 8.67157 17 9.5 17C10.3284 17 11 17.6716 11 18.5ZM15.5 8C16.3284 8 17 7.32843 17 6.5C17 5.67157 16.3284 5 15.5 5C14.6716 5 14 5.67157 14 6.5C14 7.32843 14.6716 8 15.5 8ZM17 12.5C17 13.3284 16.3284 14 15.5 14C14.6716 14 14 13.3284 14 12.5C14 11.6716 14.6716 11 15.5 11C16.3284 11 17 11.6716 17 12.5ZM15.5 20C16.3284 20 17 19.3284 17 18.5C17 17.6716 16.3284 17 15.5 17C14.6716 17 14 17.6716 14 18.5C14 19.3284 14.6716 20 15.5 20Z"
                        fill="#121923"
                    />
                </svg>
            </div>
        </div>
    );
}
