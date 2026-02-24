"use client";

import { motion } from "framer-motion";

interface BlurOverlayProps {
    onClose: () => void;
}

export default function BlurOverlay({ onClose }: BlurOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 40,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                background: "rgba(245,240,232,0.2)",
            }}
        />
    );
}