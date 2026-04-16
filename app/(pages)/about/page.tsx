"use client";

import dynamic from "next/dynamic";

const Keyboard = dynamic(() => import("@/components/ui/keyboard"), { 
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>Loading 3D Model...</div>
});

export default function AboutPage() {
    return (
        <div style={{ position: "relative", width: "100%", minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#0d0d0d" }}>
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <Keyboard />
            </div>
            
            <div style={{ zIndex: 1, textAlign: "center", pointerEvents: "none" }}>
                <h1 style={{ 
                    fontSize: "clamp(4rem, 15vw, 12rem)", 
                    fontWeight: 900, 
                    margin: 0, 
                    lineHeight: 1, 
                    color: "white", 
                    fontFamily: "Helvetica, Arial, sans-serif",
                    letterSpacing: "-0.05em"
                }}>
                    ABOUT
                </h1>
                <p style={{ 
                    fontSize: "clamp(1rem, 2vw, 1.5rem)", 
                    color: "rgba(255,255,255,0.5)", 
                    marginTop: "1rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase"
                }}>
                    Designer & Developer
                </p>
            </div>
        </div>
    );
}
