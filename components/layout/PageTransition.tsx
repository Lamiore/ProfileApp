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
    const [phase, setPhase] = useState<"idle" | "closing" | "opening">("idle");
    const [prevPathname, setPrevPathname] = useState(pathname);
    const [variant, setVariant] = useState<keyof typeof TRANSITION_VARIANTS>("right-to-left");
    const [shouldAnimateIn, setShouldAnimateIn] = useState(false);
    const [contentVisible, setContentVisible] = useState(true);

    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (pathname !== prevPathname) {
            setPrevPathname(pathname);
            if (!isFirstLoad.current) {
                setPhase("opening");
                setContentVisible(false);
            }
        }
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
        }
    }, [pathname, prevPathname]);

    // Intercept browser back/forward (Chrome's go-back arrow, swipe gestures, etc.)
    // so the closing animation plays before the URL actually changes.
    // Uses the Navigation API, available in Chromium-based browsers.
    useEffect(() => {
        const nav = (window as unknown as { navigation?: EventTarget & {
            addEventListener: (type: string, listener: (e: Event & {
                navigationType: string;
                canIntercept: boolean;
                hashChange: boolean;
                downloadRequest: string | null;
                intercept: (opts: { handler: () => Promise<void> }) => void;
            }) => void) => void;
            removeEventListener: (type: string, listener: EventListener) => void;
        } }).navigation;
        if (!nav) return;

        const handler: Parameters<typeof nav.addEventListener>[1] = (event) => {
            if (event.navigationType !== "traverse") return;
            if (!event.canIntercept) return;
            if (event.hashChange) return;
            if (event.downloadRequest !== null) return;

            const variants = Object.keys(
                TRANSITION_VARIANTS
            ) as (keyof typeof TRANSITION_VARIANTS)[];
            const randomVariant =
                variants[Math.floor(Math.random() * variants.length)];
            setVariant(randomVariant);
            setShouldAnimateIn(true);
            setPhase("closing");

            event.intercept({
                handler: () =>
                    new Promise<void>((resolve) => {
                        setTimeout(resolve, 600);
                    }),
            });
        };

        nav.addEventListener("navigate", handler as EventListener);
        return () => nav.removeEventListener("navigate", handler as EventListener);
    }, []);

    useEffect(() => {
        if (phase === "opening") {
            const timer = setTimeout(() => {
                setPhase("idle");
                setShouldAnimateIn(false);
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    const navigateTo = useCallback((url: string) => {
        if (!url) return;
        
        // Normalize for comparison
        const nUrl = url.split('?')[0].split('#')[0].replace(/\/$/, "") || "/";
        const nPath = pathname?.split('?')[0].split('#')[0].replace(/\/$/, "") || "/";

        if (nUrl === nPath) {
            // If already on the page, just make sure we're in idle
            setPhase("idle");
            return;
        }

        const variants = Object.keys(TRANSITION_VARIANTS) as (keyof typeof TRANSITION_VARIANTS)[];
        const randomVariant = variants[Math.floor(Math.random() * variants.length)];
        setVariant(randomVariant);
        
        setShouldAnimateIn(true);
        setPhase("closing");
        
        setTimeout(() => {
            router.push(url);
        }, 600);
    }, [router, pathname]);

    const currentVariant = TRANSITION_VARIANTS[variant];

    const layerBaseStyle = {
        position: "fixed" as const,
        inset: 0,
    };
    const layerTransition = { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const };

    return (
        <PageTransitionContext.Provider value={{ navigateTo }}>
            {contentVisible && children}
            <AnimatePresence onExitComplete={() => setContentVisible(true)}>
                {phase !== "idle" && (
                    <>
                        {/* bottom layer — accent red, exits last */}
                        <motion.div
                            key="t-red"
                            initial={shouldAnimateIn ? currentVariant.initial : { x: 0, y: 0 }}
                            animate={{ x: 0, y: 0 }}
                            exit={currentVariant.exit}
                            transition={{ ...layerTransition, delay: 0.16 }}
                            style={{
                                ...layerBaseStyle,
                                zIndex: 9999997,
                                backgroundColor: "#d7263d",
                                pointerEvents: "none",
                            }}
                        />

                        {/* middle layer — paper white */}
                        <motion.div
                            key="t-white"
                            initial={shouldAnimateIn ? currentVariant.initial : { x: 0, y: 0 }}
                            animate={{ x: 0, y: 0 }}
                            exit={currentVariant.exit}
                            transition={{ ...layerTransition, delay: 0.08 }}
                            style={{
                                ...layerBaseStyle,
                                zIndex: 9999998,
                                backgroundColor: "#f2ede4",
                                pointerEvents: "none",
                            }}
                        />

                        {/* top layer — base dark, holds avatar loader, exits first */}
                        <motion.div
                            key="t-dark"
                            initial={shouldAnimateIn ? currentVariant.initial : { x: 0, y: 0 }}
                            animate={{ x: 0, y: 0 }}
                            exit={currentVariant.exit}
                            transition={layerTransition}
                            style={{
                                ...layerBaseStyle,
                                zIndex: 9999999,
                                backgroundColor: "#0d0d0d",
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
                    </>
                )}
            </AnimatePresence>
        </PageTransitionContext.Provider>
    );
}
