"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);
        // Simulate minimum loading time for the animation to look good
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800); // 1.8 seconds loading screen

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
                        backgroundColor: "#ffffff", // matches portfolio background
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                    }}
                >
                    <style>{`
                        /* Base variables compiled from SCSS */
                        :root {
                            --avatar-loader-size: 5rem;
                            --avatar-loader-animation-duration: 5s;
                        }

                        /* Container styling */
                        .avatar-loader {
                            overflow: hidden;
                            width: var(--avatar-loader-size);
                            height: var(--avatar-loader-size);
                            background-color: #F7E2D1;
                            border-radius: 12px; /* Smooth square corners */
                            animation: avatar-loader-background var(--avatar-loader-animation-duration) linear infinite;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                        }

                        .avatar-loader__inner {
                            display: flex;
                            width: calc(var(--avatar-loader-size) * 5);
                            animation: avatar-loader-offset var(--avatar-loader-animation-duration) linear infinite;
                        }

                        .avatar {
                            height: var(--avatar-loader-size);
                            width: var(--avatar-loader-size);
                            flex: 0 0 var(--avatar-loader-size);
                        }

                        /* Avatar 1 */
                        .avatar-1 .body, .avatar-1 .hat, .avatar-1 .hair, .avatar-1 .beard, .avatar-1 .glasses { fill: #305899; }
                        .avatar-1 .face, .avatar-1 .body-accessory { fill: #FFFFFF; }
                        /* Avatar 2 */
                        .avatar-2 .body, .avatar-2 .hat, .avatar-2 .hair, .avatar-2 .beard, .avatar-2 .glasses { fill: #111118; }
                        .avatar-2 .face, .avatar-2 .body-accessory { fill: #FF918D; }
                        /* Avatar 3 */
                        .avatar-3 .body, .avatar-3 .hat, .avatar-3 .hair, .avatar-3 .beard, .avatar-3 .glasses { fill: #F7E2D1; }
                        .avatar-3 .face, .avatar-3 .body-accessory { fill: #FFFFFF; }
                        /* Avatar 4 */
                        .avatar-4 .body, .avatar-4 .hat, .avatar-4 .hair, .avatar-4 .beard, .avatar-4 .glasses { fill: #FFD692; }
                        .avatar-4 .face, .avatar-4 .body-accessory { fill: #FFFFFF; }
                        /* Avatar 5 (Loops back to 1) */
                        .avatar-5 .body, .avatar-5 .hat, .avatar-5 .hair, .avatar-5 .beard, .avatar-5 .glasses { fill: #305899; }
                        .avatar-5 .face, .avatar-5 .body-accessory { fill: #FFFFFF; }

                        /* Animations elements */
                        .head {
                            transform-origin: bottom center;
                            animation: avatar-head var(--avatar-loader-animation-duration) linear infinite;
                        }

                        .hair, .glasses, .beard, .hat {
                            animation: avatar-accessory var(--avatar-loader-animation-duration) linear infinite;
                        }

                        /* 
                            Compiled SCSS Loops to CSS Keyframes 
                            Timing functions:
                            $ease-in-out-back: cubic-bezier(0.680, -0.550, 0.265, 1.550);
                            $ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);
                            $ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
                            $ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
                        */

                        @keyframes avatar-loader-offset {
                            15% { transform: translateX(0); animation-timing-function: cubic-bezier(0.680, -0.550, 0.265, 1.550); }
                            25% { transform: translateX(calc(var(--avatar-loader-size) * -1)); }
                            40% { transform: translateX(calc(var(--avatar-loader-size) * -1)); animation-timing-function: cubic-bezier(0.680, -0.550, 0.265, 1.550); }
                            50% { transform: translateX(calc(var(--avatar-loader-size) * -2)); }
                            65% { transform: translateX(calc(var(--avatar-loader-size) * -2)); animation-timing-function: cubic-bezier(0.680, -0.550, 0.265, 1.550); }
                            75% { transform: translateX(calc(var(--avatar-loader-size) * -3)); }
                            90% { transform: translateX(calc(var(--avatar-loader-size) * -3)); animation-timing-function: cubic-bezier(0.680, -0.550, 0.265, 1.550); }
                            100% { transform: translateX(calc(var(--avatar-loader-size) * -4)); }
                        }

                        @keyframes avatar-loader-background {
                            15% { background-color: #F7E2D1; animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            25% { background-color: #CEE2C1; }
                            40% { background-color: #CEE2C1; animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            50% { background-color: #AABDDD; }
                            65% { background-color: #AABDDD; animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            75% { background-color: #D7C7E4; }
                            90% { background-color: #D7C7E4; animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            100% { background-color: #F7E2D1; }
                        }

                        @keyframes avatar-head {
                            15% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            18% { transform: rotate(20deg); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            23% { transform: rotate(-10deg); animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                            25% { transform: rotate(0); }

                            40% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            43% { transform: rotate(20deg); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            48% { transform: rotate(-10deg); animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                            50% { transform: rotate(0); }

                            65% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            68% { transform: rotate(20deg); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            73% { transform: rotate(-10deg); animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                            75% { transform: rotate(0); }

                            90% { transform: rotate(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            93% { transform: rotate(20deg); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            98% { transform: rotate(-10deg); animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94); }
                            100% { transform: rotate(0); }
                        }

                        @keyframes avatar-accessory {
                            15% { transform: translateX(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            18% { transform: translateX(4px); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            25% { transform: translateX(0); }

                            40% { transform: translateX(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            43% { transform: translateX(4px); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            50% { transform: translateX(0); }

                            65% { transform: translateX(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            68% { transform: translateX(4px); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            75% { transform: translateX(0); }

                            90% { transform: translateX(0); animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19); }
                            93% { transform: translateX(4px); animation-timing-function: cubic-bezier(0.645, 0.045, 0.355, 1); }
                            100% { transform: translateX(0); }
                        }
                    `}</style>
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
