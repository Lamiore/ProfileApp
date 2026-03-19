"use client";

import { ArrowLeft } from 'lucide-react';
import { usePageTransition } from '@/components/PageTransition';

export default function CardPage() {
    const { navigateTo } = usePageTransition();

    return (
        <div style={{
            width: "100vw",
            height: "100vh",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#E0E0E0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            position: "relative",
        }}>
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
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#E0E0E0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; }}
            >
                <ArrowLeft size={16} /> Kembali
            </button>
            <p style={{ fontSize: "14px", color: "rgba(224,224,224,0.5)" }}>
                Coming soon...
            </p>
        </div>
    );
}
