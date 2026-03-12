"use client";

import Image from "next/image";

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