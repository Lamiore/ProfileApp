"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePageTransition } from "@/components/PageTransition";

const DarkMap = dynamic(() => import("@/components/DarkMap"), { ssr: false });

const skills = ["Photoshop", "After Effects", "Visual Design"];

const timeline = [
    { year: "2025", desc: "Mulai menemukan ritme. Lumayan paham cara mainnya dan siap eksplor lebih jauh." },
    { year: "2024", desc: "Ekspansi skill ke dunia logika dengan mempelajari bahasa pemrograman." },
    { year: "2023", desc: "Menyusun fondasi digital lewat eksplorasi pembuatan website." },
    { year: "2022", desc: "Mengasah insting visual dan terjun langsung lewat PKL di studio foto." },
    { year: "2021", desc: "Menghidupkan imajinasi visual melalui Photoshop dan After Effects." },
    { year: "2020", desc: "Langkah pertama merangkai jejak digital. Awal mula eksplorasi di ekosistem Windows." },
];

const DISCORD_USER_ID = "501362625943175199";
const DISCORD_SERVER_INVITE = "https://discord.com/users/501362625943175199";

interface LanyardData {
    discord_user: {
        username: string;
        display_name: string | null;
        avatar: string | null;
        id: string;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: { name: string; type: number; state?: string; details?: string }[];
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
    online: { color: "#23A55A", label: "Online" },
    idle: { color: "#F0B232", label: "Idle" },
    dnd: { color: "#F23F43", label: "Do Not Disturb" },
    offline: { color: "#80848E", label: "Offline" },
};

const connections = [
    {
        label: "Email",
        value: "ilhamaditmohammad@gmail.com",
        href: "mailto:ilhamaditmohammad@gmail.com",
        icon: "✉️",
    },
    {
        label: "Instagram",
        value: "@ikanguramegarorica",
        href: "https://www.instagram.com/ikanguramegarorica/",
        icon: "📸",
    },
    {
        label: "LinkedIn",
        value: "Irham Aadiyaat Mohammad",
        href: "https://www.linkedin.com/in/irham-aadiyaat-mohammad/",
        icon: "💼",
    },
];

export default function AboutWindow() {
    const { navigateTo } = usePageTransition();
    const [lanyard, setLanyard] = useState<LanyardData | null>(null);

    useEffect(() => {
        let ws: WebSocket | null = null;
        let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
        let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
        let alive = true;

        const connect = () => {
            if (!alive) return;
            ws = new WebSocket("wss://api.lanyard.rest/socket");

            ws.onmessage = (event) => {
                const msg = JSON.parse(event.data);

                if (msg.op === 1) {
                    const interval: number = msg.d.heartbeat_interval;
                    heartbeatTimer = setInterval(() => {
                        ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ op: 3 }));
                    }, interval);

                    ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
                }

                if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
                    setLanyard(msg.d);
                }
            };

            ws.onclose = () => {
                if (heartbeatTimer) clearInterval(heartbeatTimer);
                if (alive) {
                    reconnectTimer = setTimeout(connect, 3000);
                }
            };

            ws.onerror = () => ws?.close();
        };

        connect();

        return () => {
            alive = false;
            if (heartbeatTimer) clearInterval(heartbeatTimer);
            if (reconnectTimer) clearTimeout(reconnectTimer);
            ws?.close();
        };
    }, []);

    const status = lanyard?.discord_status ?? "offline";
    const { color: statusColor, label: statusLabel } = STATUS_CONFIG[status];
    const avatarUrl = lanyard?.discord_user.avatar
        ? `https://cdn.discordapp.com/avatars/${DISCORD_USER_ID}/${lanyard.discord_user.avatar}.webp?size=128`
        : null;
    const displayName = lanyard?.discord_user.display_name || lanyard?.discord_user.username || "User";
    const username = lanyard?.discord_user.username || "";
    const activity = lanyard?.activities?.find((a) => a.type !== 4);

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

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

            {/* Connect Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(224, 224, 224, 0.6)", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>
                    Connect
                </p>
                
                {/* Discord Status Card */}
                <a
                    href={DISCORD_SERVER_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        padding: "16px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.06))",
                        border: "1px solid rgba(88,101,242,0.2)",
                        textDecoration: "none",
                        transition: "background 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(88,101,242,0.2), rgba(88,101,242,0.1))";
                        e.currentTarget.style.borderColor = "rgba(88,101,242,0.4)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "linear-gradient(135deg, rgba(88,101,242,0.12), rgba(88,101,242,0.06))";
                        e.currentTarget.style.borderColor = "rgba(88,101,242,0.2)";
                        e.currentTarget.style.transform = "translateY(0)";
                    }}
                >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        <div
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "50%",
                                background: avatarUrl ? "transparent" : "#5865F2",
                                overflow: "hidden",
                            }}
                        >
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={displayName}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                <div style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                }}>
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "-1px",
                                right: "-1px",
                                width: "16px",
                                height: "16px",
                                borderRadius: "50%",
                                background: "#0A0A0A",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {status === "online" && (
                                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: statusColor }} />
                            )}
                            {status === "idle" && (
                                <svg width="10" height="10" viewBox="0 0 10 10">
                                    <circle cx="5" cy="5" r="5" fill={statusColor} />
                                    <circle cx="3.5" cy="3" r="3" fill="#0A0A0A" />
                                </svg>
                            )}
                            {status === "dnd" && (
                                <svg width="10" height="10" viewBox="0 0 10 10">
                                    <circle cx="5" cy="5" r="5" fill={statusColor} />
                                    <rect x="2.5" y="4" width="5" height="2" rx="1" fill="#0A0A0A" />
                                </svg>
                            )}
                            {status === "offline" && (
                                <svg width="10" height="10" viewBox="0 0 10 10">
                                    <circle cx="5" cy="5" r="5" fill={statusColor} />
                                    <circle cx="5" cy="5" r="2.5" fill="#0A0A0A" />
                                </svg>
                            )}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: "#E0E0E0", margin: 0 }}>
                                {displayName}
                            </p>
                            <span
                                style={{
                                    fontSize: "9px",
                                    fontWeight: 600,
                                    color: statusColor,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.08em",
                                    padding: "1px 6px",
                                    borderRadius: "4px",
                                    background: `${statusColor}18`,
                                }}
                            >
                                {statusLabel}
                            </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "rgba(224, 224, 224, 0.4)", margin: 0 }}>
                            {username}
                        </p>
                        {activity && (
                            <p style={{
                                fontSize: "11px",
                                color: "#5865F2",
                                margin: "2px 0 0 0",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}>
                                {activity.type === 0 ? "Playing" : activity.type === 2 ? "Listening to" : ""}
                                {" "}
                                <strong>{activity.name}</strong>
                                {activity.details && ` — ${activity.details}`}
                            </p>
                        )}
                    </div>
                </a>

                {/* Connections List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {connections.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "14px",
                                padding: "14px 16px",
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: "rgba(255,255,255,0.06)",
                                textDecoration: "none",
                                transition: "background 0.2s ease, transform 0.2s ease",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                                e.currentTarget.style.transform = "translateX(4px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                e.currentTarget.style.transform = "translateX(0)";
                            }}
                        >
                            <span style={{ fontSize: "20px" }}>{item.icon}</span>
                            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                <p style={{ fontSize: "11px", color: "rgba(224, 224, 224, 0.4)", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                    {item.label}
                                </p>
                                <p style={{ fontSize: "13px", fontWeight: 500, color: "#E0E0E0", margin: 0 }}>
                                    {item.value}
                                </p>
                            </div>
                            <span style={{ marginLeft: "auto", color: "rgba(224, 224, 224, 0.2)", fontSize: "14px" }}>↗</span>
                        </a>
                    ))}
                </div>

                {/* Map */}
                <div style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    height: "200px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    position: "relative",
                }}>
                    <DarkMap lat={1.4848} lng={124.8421} zoom={12} />
                    <div style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "5px 10px",
                        borderRadius: "6px",
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 1000,
                    }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span style={{ fontSize: "11px", color: "#E0E0E0", fontWeight: 500 }}>Manado, Sulawesi Utara</span>
                    </div>
                </div>
            </div>

        </div>
    );
}