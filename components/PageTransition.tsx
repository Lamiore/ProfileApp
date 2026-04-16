"use client";

import { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const PageTransitionContext = createContext<{ navigateTo: (url: string) => void }>({
    navigateTo: () => {},
});

const TRANSITION_VARIANTS = {
    "right-to-left": {
        initial: { x: "100%", y: 0 },
        exit: { x: "-100%", y: 0 }
    },
    "left-to-right": {
        initial: { x: "-100%", y: 0 },
        exit: { x: "100%", y: 0 }
    },
    "top-to-bottom": {
        initial: { x: 0, y: "-100%" },
        exit: { x: 0, y: "100%" }
    },
    "bottom-to-top": {
        initial: { x: 0, y: "100%" },
        exit: { x: 0, y: "-100%" }
    }
};

export const usePageTransition = () => useContext(PageTransitionContext);

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const isFirstLoad = useRef(true);
    const hadClosing = useRef(false);
    const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
    const [prevPathname, setPrevPathname] = useState(pathname);
    const [variant, setVariant] = useState<keyof typeof TRANSITION_VARIANTS>("right-to-left");

    // Detect route change → switch to "opening" (reveal) phase
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        if (!isFirstLoad.current) {
            setPhase("opening");
        }
    }

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        if (phase === "opening") {
            const timer = setTimeout(() => setPhase("idle"), 1200);
            return () => clearTimeout(timer);
        }
    }, [pathname, phase]);

    // Trigger closing curtain, then navigate after animation
    const navigateTo = useCallback((url: string) => {
        const variants = Object.keys(TRANSITION_VARIANTS) as (keyof typeof TRANSITION_VARIANTS)[];
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        setVariant(randomVariant);
        
        hadClosing.current = true;
        setPhase("closing");
        setTimeout(() => {
            router.push(url);
        }, 800);
    }, [router]);

    const currentVariant = TRANSITION_VARIANTS[variant];

    return (
        <PageTransitionContext.Provider value={{ navigateTo }}>
            {children}
            <AnimatePresence>
                {phase !== "idle" && (
                    <motion.div
                        key="page-transition"
                        initial={hadClosing.current ? currentVariant.initial : { x: 0, y: 0 }}
                        animate={{ x: 0, y: 0 }}
                        exit={currentVariant.exit}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        onAnimationComplete={() => { hadClosing.current = false; }}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 9999999,
                            backgroundColor: "#1A1A1A",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: phase === "closing" ? "all" : "none",
                        }}
                    >
                        <div className="avatar-loader">
                                <div className="avatar-loader__inner">
                                    <svg version="1.1" className="avatar avatar-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xmlSpace="preserve">
                                        <g className="head">
                                            <polygon className="face" points="21,25 21,32 15,32 15,12 26,12 26,25" />
                                            <polygon className="hat" points="15,13 15,8 25,8 25,11 29,11 29,13" />
                                        </g>
                                        <path className="body" d="M10.9,30h18.2c2.9,0,5.3,2,5.9,4.8l1,5.2H4l1-5.2C5.6,32,8.1,30,10.9,30z" />
                                    </svg>
                                    <svg version="1.1" className="avatar avatar-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xmlSpace="preserve">
                                        <g className="head">
                                            <polygon className="face" points="21,25 21,32 15,32 15,10 26,10 26,25" />
                                            <rect className="hair" x="15" y="12" width="3" height="9" />
                                            <rect className="beard" x="22" y="19" width="5" height="2" />
                                        </g>
                                        <g className="body-outer">
                                            <path className="body" d="M10.9,30h18.2c2.9,0,5.3,2,5.9,4.8l1,5.2H4l1-5.2C5.6,32,8.1,30,10.9,30z" />
                                            <rect className="body-accessory" x="11" y="30" width="3" height="10" />
                                            <rect className="body-accessory" x="25" y="30" width="3" height="10" />
                                        </g>
                                    </svg>
                                    <svg version="1.1" className="avatar avatar-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xmlSpace="preserve">
                                        <g className="head">
                                            <polygon className="face" points="21,25 21,32 15,32 15,12 26,12 26,25" />
                                            <path className="hair" d="M12,26v-9c0-3,2.2-5.5,5.1-5.9C17.5,9.3,19.1,8,21,8h5v4h-8v10c0,3.3-2.7,6-6,6h-2v-2H12z" />
                                        </g>
                                        <path className="body" d="M10.9,30h18.2c2.9,0,5.3,2,5.9,4.8l1,5.2H4l1-5.2C5.6,32,8.1,30,10.9,30z" />
                                    </svg>
                                    <svg version="1.1" className="avatar avatar-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xmlSpace="preserve">
                                        <g className="head">
                                            <polygon className="face" points="24,26 24,32 15,32 15,12 27,12 27,26" />
                                            <polygon className="glasses" points="25,18 23,18 23,19 19,19 19,18 14,18 14,16 19,16 19,15 23,15 23,16 25,16 25,15 29,15 29,19 25,19" />
                                        </g>
                                        <path className="body" d="M9.9,30h21.2c2.9,0,5.3,2,5.9,4.8l1,5.2H3l1-5.2C4.6,32,7.1,30,9.9,30z" />
                                    </svg>
                                    <svg version="1.1" className="avatar avatar-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" xmlSpace="preserve">
                                        <g className="head">
                                            <polygon className="face" points="21,25 21,32 15,32 15,12 26,12 26,25" />
                                            <polygon className="hat" points="15,13 15,8 25,8 25,11 29,11 29,13" />
                                        </g>
                                        <path className="body" d="M10.9,30h18.2c2.9,0,5.3,2,5.9,4.8l1,5.2H4l1-5.2C5.6,32,8.1,30,10.9,30z" />
                                    </svg>
                                </div>
                            </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageTransitionContext.Provider>
    );
}
