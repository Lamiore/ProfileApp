"use client";

import Image from "next/image";
import { usePageTransition } from "@/components/PageTransition";

const skills = ["Photoshop", "After Effects", "Visual Design"];

const timeline = [
    { year: "2025", desc: "Mulai menemukan ritme. Lumayan paham cara mainnya dan siap eksplor lebih jauh." },
    { year: "2024", desc: "Ekspansi skill ke dunia logika dengan mempelajari bahasa pemrograman." },
    { year: "2023", desc: "Menyusun fondasi digital lewat eksplorasi pembuatan website." },
    { year: "2022", desc: "Mengasah insting visual dan terjun langsung lewat PKL di studio foto." },
    { year: "2021", desc: "Menghidupkan imajinasi visual melalui Photoshop dan After Effects." },
    { year: "2020", desc: "Langkah pertama merangkai jejak digital. Awal mula eksplorasi di ekosistem Windows." },
];

export default function AboutWindow() {
    const { navigateTo } = usePageTransition();

    return (
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Top — foto + bio */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Foto profil */}
                <div
                    style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        overflow: "hidden",
                        border: "2px solid rgba(255,255,255,0.1)",
                        position: "relative",
                    }}
                >
                    <Image
                        src="/profile.jpg"
                        alt="Profile photo"
                        fill
                        style={{ objectFit: "cover" }}
                    />
                </div>

                {/* Bio */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#E0E0E0", margin: 0 }}>
                        Lam
                    </h2>
                    <p style={{ fontSize: "12px", color: "rgba(224, 224, 224, 0.6)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        Designer · Creative
                    </p>
                    <p style={{ fontSize: "14px", color: "#E0E0E0", margin: 0, lineHeight: 1.7, marginTop: "4px" }}>
                        Passionate di dunia ekonomi kreatif — dari visual storytelling sampai motion.
                        Lebih suka bikin sesuatu yang kelihatan daripada yang cuma bisa dibaca.
                    </p>
                </div>
            </div>

            {/* Name Card button */}
            <button
                onClick={() => navigateTo("/card")}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "background 0.2s, border-color 0.2s",
                    width: "100%",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <circle cx="9" cy="11" r="2.5" />
                        <path d="M5 18c0-2.2 1.8-4 4-4s4 1.8 4 4" />
                        <line x1="16" y1="9" x2="20" y2="9" />
                        <line x1="16" y1="13" x2="20" y2="13" />
                    </svg>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0" }}>Name Card</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(224,224,224,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
            </button>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

            {/* Skills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(224, 224, 224, 0.6)", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                    Tools & Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {skills.map((skill) => (
                        <span key={skill} style={{
                            padding: "5px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            color: "#E0E0E0",
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

            {/* Perjalanan */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(224, 224, 224, 0.6)", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                    Perjalanan
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {timeline.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "11px", color: "rgba(224, 224, 224, 0.4)", fontVariantNumeric: "tabular-nums", width: "32px", flexShrink: 0, paddingTop: "2px" }}>
                                {item.year}
                            </span>
                            <span style={{ fontSize: "13px", color: "#E0E0E0", lineHeight: 1.6 }}>
                                {item.desc}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}