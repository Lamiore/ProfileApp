"use client";

import { motion } from "framer-motion";

interface BlurOverlayProps {
    onClose: () => void;
    peeking?: boolean;
}

export default function BlurOverlay({ onClose, peeking = false }: BlurOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: peeking ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                backdropFilter: peeking ? "blur(0px)" : "blur(8px)",
                WebkitBackdropFilter: peeking ? "blur(0px)" : "blur(8px)",
                background: peeking ? "transparent" : "rgba(245,240,232,0.2)",
                pointerEvents: "auto",
                transition: "backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease, background 0.4s ease",
            }}
        />
    );
}