"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Initial load block triggering a synchronous re-sync so React handles state updates in correct sequence.
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsLoading(true);
    }

    useEffect(() => {
        // Simulate minimum loading time for the animation to look good
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200); // loading screen

        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100vh" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} /* Custom fluid cubic-bezier for a snappy roll up */
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 9999999,
                        backgroundColor: "#1A1A1A", // matches dark theme background
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
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
    );
}
