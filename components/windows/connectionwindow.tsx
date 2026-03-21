"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const DarkMap = dynamic(() => import("@/components/DarkMap"), { ssr: false });

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
        value: "@lam.webp",
        href: "https://www.instagram.com/lam.webp/",
        icon: "📸",
    },
    {
        label: "LinkedIn",
        value: "Irham Aadiyaat Mohammad",
        href: "https://www.linkedin.com/in/irham-aadiyaat-mohammad/",
        icon: "💼",
    },
];

export default function ConnectionWindow() {
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

                // op 1 = Hello → start heartbeat + subscribe
                if (msg.op === 1) {
                    const interval: number = msg.d.heartbeat_interval;
                    heartbeatTimer = setInterval(() => {
                        ws?.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ op: 3 }));
                    }, interval);

                    ws?.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
                }

                // op 0 = Event (INIT_STATE or PRESENCE_UPDATE)
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
    const activity = lanyard?.activities?.find((a) => a.type !== 4); // skip custom status

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "13px", color: "rgba(224, 224, 224, 0.5)", margin: 0, lineHeight: 1.6 }}>
                Terbuka untuk kolaborasi, project kreatif, atau sekadar ngobrol.
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
                    marginTop: "4px",
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
                {/* Avatar + status dot */}
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
                    {/* Status indicator dot */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: "-1px",
                            right: "-1px",
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: "#F5F0E8",
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
                                <circle cx="3.5" cy="3" r="3" fill="#F5F0E8" />
                            </svg>
                        )}
                        {status === "dnd" && (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <circle cx="5" cy="5" r="5" fill={statusColor} />
                                <rect x="2.5" y="4" width="5" height="2" rx="1" fill="#F5F0E8" />
                            </svg>
                        )}
                        {status === "offline" && (
                            <svg width="10" height="10" viewBox="0 0 10 10">
                                <circle cx="5" cy="5" r="5" fill={statusColor} />
                                <circle cx="5" cy="5" r="2.5" fill="#F5F0E8" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Info */}
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

                {/* Discord logo + arrow */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                    <svg width="20" height="15" viewBox="0 0 127.14 96.36" fill="#5865F2">
                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                    </svg>
                    <span style={{ color: "#5865F280", fontSize: "14px" }}>↗</span>
                </div>
            </a>

            {/* Other connections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
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
                            background: "rgba(255,255,255,0.1)",
                            textDecoration: "none",
                            transition: "background 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
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

            {/* Location Map */}
            <div style={{
                borderRadius: "10px",
                overflow: "hidden",
                height: "300px",
                border: "1px solid rgba(255,255,255,0.08)",
                position: "relative",
                marginTop: "4px",
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
    );
}