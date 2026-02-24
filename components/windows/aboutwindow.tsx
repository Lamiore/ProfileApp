"use client";

import Image from "next/image";

export default function AboutWindow() {
    const skills = ["Photoshop", "After Effects", "Visual Design", "Creative Direction"];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Top — foto + bio */}
            <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
                {/* Foto placeholder */}
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(44,44,44,0.1)",
                    flexShrink: 0,
                    overflow: "hidden",
                    border: "2px solid rgba(44,44,44,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                }}>
                    🧑‍🎨
                </div>

                {/* Bio */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#2C2C2C", margin: 0 }}>
                        Lam
                    </h2>
                    <p style={{ fontSize: "12px", color: "#2C2C2C99", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                        Designer · Creative
                    </p>
                    <p style={{ fontSize: "14px", color: "#2C2C2C", margin: 0, lineHeight: 1.7, marginTop: "4px" }}>
                        Passionate di dunia ekonomi kreatif — dari visual storytelling sampai motion.
                        Lebih suka bikin sesuatu yang kelihatan daripada yang cuma bisa dibaca.
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(44,44,44,0.1)" }} />

            {/* Skills */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#2C2C2C99", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                    Tools & Skills
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {skills.map((skill) => (
                        <span key={skill} style={{
                            padding: "5px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            color: "#2C2C2C",
                            background: "rgba(44,44,44,0.08)",
                            border: "1px solid rgba(44,44,44,0.12)",
                        }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(44,44,44,0.1)" }} />

            {/* Perjalanan */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "#2C2C2C99", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                    Perjalanan
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                        { year: "Now", desc: "Exploring the world of creative economy & visual design" },
                        { year: "2024", desc: "Mulai serius mendalami Photoshop & After Effects" },
                        { year: "—", desc: "The story is still being written..." },
                    ].map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "11px", color: "#2C2C2C60", fontVariantNumeric: "tabular-nums", width: "32px", flexShrink: 0, paddingTop: "2px" }}>
                                {item.year}
                            </span>
                            <span style={{ fontSize: "13px", color: "#2C2C2C", lineHeight: 1.6 }}>
                                {item.desc}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}