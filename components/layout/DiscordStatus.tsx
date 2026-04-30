"use client";

import { useEffect, useMemo, useState } from "react";
import {
    useLanyard,
    type LanyardActivity,
    type LanyardData,
    type LanyardStatus,
} from "@/lib/useLanyard";

const STATUS_COLOR: Record<LanyardStatus, string> = {
    online: "#43b581",
    idle: "#faa61a",
    dnd: "#f04747",
    offline: "#747f8d",
};

const STATUS_LABEL: Record<LanyardStatus, string> = {
    online: "online",
    idle: "idle",
    dnd: "do not disturb",
    offline: "offline",
};

function activityVerb(type: number) {
    switch (type) {
        case 0:
            return "playing";
        case 1:
            return "streaming";
        case 2:
            return "listening to";
        case 3:
            return "watching";
        case 5:
            return "competing in";
        default:
            return "";
    }
}

function getAvatarUrl(user: LanyardData["discord_user"]): string {
    if (!user.avatar) {
        const idx = Number((BigInt(user.id) >> BigInt(22)) % BigInt(6));
        return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
    }
    const ext = user.avatar.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
}

function getActivityImage(act: LanyardActivity): string | null {
    const img = act.assets?.large_image;
    if (!img) return null;
    if (img.startsWith("mp:external/")) {
        const stripped = img.replace("mp:external/", "");
        const parts = stripped.split("/https/");
        if (parts.length === 2) return `https://${parts[1]}`;
        return null;
    }
    if (img.startsWith("spotify:")) {
        return `https://i.scdn.co/image/${img.replace("spotify:", "")}`;
    }
    if (act.application_id) {
        return `https://cdn.discordapp.com/app-assets/${act.application_id}/${img}.png`;
    }
    return null;
}

function formatElapsed(ms: number): string {
    const sec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

function pickPrimaryActivity(data: LanyardData): LanyardActivity | null {
    if (data.listening_to_spotify) {
        const spotifyAct = data.activities.find((a) => a.name === "Spotify");
        if (spotifyAct) return spotifyAct;
    }
    return data.activities.find((a) => a.type !== 4) ?? null;
}

function pickCustomStatus(data: LanyardData): LanyardActivity | null {
    return data.activities.find((a) => a.type === 4) ?? null;
}

interface DiscordStatusProps {
    userId: string;
}

export default function DiscordStatus({ userId }: DiscordStatusProps) {
    const { data, status: wsStatus } = useLanyard(userId);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    const line = useMemo(() => {
        if (!data) {
            return {
                username: wsStatus === "connecting" ? "connecting…" : "offline",
                status: "offline" as LanyardStatus,
            };
        }
        const username =
            data.discord_user.global_name ||
            data.discord_user.username ||
            "discord";
        return { username, status: data.discord_status };
    }, [data, wsStatus]);

    const primaryActivity = data ? pickPrimaryActivity(data) : null;
    const customStatus = data ? pickCustomStatus(data) : null;
    const platforms = data
        ? [
              data.active_on_discord_desktop && "desktop",
              data.active_on_discord_mobile && "mobile",
              data.active_on_discord_web && "web",
          ].filter(Boolean)
        : [];

    return (
        <a
            className="ds-trigger"
            href={`https://discord.com/users/${userId}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            <span
                className="ds-dot"
                style={{ background: STATUS_COLOR[line.status] }}
                aria-hidden
            />
            <span className="ds-label">discord</span>
            <span className="ds-username">{line.username}</span>

            <div className="ds-bubble" role="tooltip">
                <div className="ds-bubble-tail" aria-hidden />

                <div className="ds-bubble-header">
                    {data ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            className="ds-avatar"
                            src={getAvatarUrl(data.discord_user)}
                            alt={`${line.username} avatar`}
                            loading="lazy"
                        />
                    ) : (
                        <div className="ds-avatar ds-avatar-skel" />
                    )}
                    <div className="ds-heading">
                        <div className="ds-name">
                            {line.username}
                            <span
                                className="ds-name-dot"
                                style={{ background: STATUS_COLOR[line.status] }}
                            />
                        </div>
                        <div className="ds-status">
                            {STATUS_LABEL[line.status]}
                            {data?.discord_user.username && (
                                <span className="ds-handle">
                                    · @{data.discord_user.username}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {customStatus && (
                    <div className="ds-custom">
                        <span className="ds-quote">“</span>
                        <span>{customStatus.state || customStatus.name}</span>
                    </div>
                )}

                <div className="ds-divider" />

                {primaryActivity ? (
                    <div className="ds-activity">
                        <div className="ds-activity-head">
                            {activityVerb(primaryActivity.type) || "active"}
                        </div>
                        <div className="ds-activity-body">
                            {data?.listening_to_spotify && data.spotify ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    className="ds-art"
                                    src={data.spotify.album_art_url}
                                    alt={data.spotify.album}
                                    loading="lazy"
                                />
                            ) : (
                                (() => {
                                    const img = getActivityImage(primaryActivity);
                                    return img ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            className="ds-art"
                                            src={img}
                                            alt={primaryActivity.name}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="ds-art ds-art-fb">
                                            {primaryActivity.name.slice(0, 1).toUpperCase()}
                                        </div>
                                    );
                                })()
                            )}
                            <div className="ds-activity-text">
                                <div className="ds-activity-name">
                                    {data?.listening_to_spotify && data.spotify
                                        ? data.spotify.song
                                        : primaryActivity.name}
                                </div>
                                {data?.listening_to_spotify && data.spotify ? (
                                    <>
                                        <div className="ds-activity-sub">
                                            by {data.spotify.artist}
                                        </div>
                                        <div className="ds-activity-sub ds-activity-sub-muted">
                                            on {data.spotify.album}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {primaryActivity.details && (
                                            <div className="ds-activity-sub">
                                                {primaryActivity.details}
                                            </div>
                                        )}
                                        {primaryActivity.state && (
                                            <div className="ds-activity-sub ds-activity-sub-muted">
                                                {primaryActivity.state}
                                            </div>
                                        )}
                                    </>
                                )}
                                {primaryActivity.timestamps?.start && (
                                    <div className="ds-activity-time">
                                        {formatElapsed(
                                            now - primaryActivity.timestamps.start
                                        )}{" "}
                                        elapsed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="ds-empty">no activity right now.</div>
                )}

                {platforms.length > 0 && (
                    <>
                        <div className="ds-divider" />
                        <div className="ds-platform">
                            on {platforms.join(" · ")}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .ds-trigger {
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 6px 0;
                    font-size: 1.1rem;
                    font-weight: 500;
                    color: #111;
                    text-decoration: none;
                    cursor: pointer;
                    transition: opacity 0.2s ease;
                }
                .ds-trigger:hover {
                    opacity: 0.85;
                }
                .ds-dot {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.04);
                    flex-shrink: 0;
                }
                .ds-label {
                    font-size: 1.1rem;
                    color: #111;
                }
                .ds-username {
                    font-size: 0.95rem;
                    color: rgba(0, 0, 0, 0.5);
                    margin-left: 2px;
                }

                /* ── bubble ── */
                .ds-bubble {
                    position: absolute;
                    bottom: calc(100% + 14px);
                    left: 0;
                    width: 320px;
                    padding: 14px 14px 12px;
                    background: #161719;
                    color: #f2ede4;
                    border: 1px solid rgba(242, 237, 228, 0.08);
                    border-radius: 12px;
                    box-shadow:
                        0 18px 40px rgba(0, 0, 0, 0.45),
                        0 4px 12px rgba(0, 0, 0, 0.3);
                    opacity: 0;
                    transform: translateY(8px) scale(0.96);
                    transform-origin: bottom left;
                    transition:
                        opacity 0.18s ease,
                        transform 0.22s cubic-bezier(0.2, 0.85, 0.25, 1);
                    pointer-events: none;
                    z-index: 50;
                    font-family: var(--font-space-grotesk), system-ui, sans-serif;
                }
                .ds-trigger:hover .ds-bubble,
                .ds-trigger:focus-visible .ds-bubble {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }
                .ds-bubble-tail {
                    position: absolute;
                    bottom: -6px;
                    left: 24px;
                    width: 12px;
                    height: 12px;
                    background: #161719;
                    border-right: 1px solid rgba(242, 237, 228, 0.08);
                    border-bottom: 1px solid rgba(242, 237, 228, 0.08);
                    transform: rotate(45deg);
                }
                .ds-bubble-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }
                .ds-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                    background: #2a2a2e;
                    flex-shrink: 0;
                }
                .ds-avatar-skel {
                    background: linear-gradient(90deg, #2a2a2e, #3a3a40, #2a2a2e);
                    background-size: 200% 100%;
                    animation: ds-skel 1.6s linear infinite;
                }
                @keyframes ds-skel {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                .ds-heading {
                    min-width: 0;
                    flex: 1;
                }
                .ds-name {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: #f2ede4;
                    line-height: 1.2;
                }
                .ds-name-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    box-shadow: 0 0 0 2px #161719;
                }
                .ds-status {
                    font-size: 0.78rem;
                    color: #b5b3ad;
                    margin-top: 2px;
                    text-transform: lowercase;
                }
                .ds-handle {
                    margin-left: 4px;
                    color: #6f6c66;
                }
                .ds-custom {
                    margin: 4px 0 8px;
                    padding: 8px 10px;
                    background: rgba(242, 237, 228, 0.05);
                    border-left: 2px solid #d7263d;
                    border-radius: 4px;
                    font-size: 0.82rem;
                    color: #d4cec0;
                    font-style: italic;
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                }
                .ds-quote {
                    color: #d7263d;
                    font-size: 1.1rem;
                    line-height: 1;
                    font-style: normal;
                }
                .ds-divider {
                    height: 1px;
                    background: rgba(242, 237, 228, 0.08);
                    margin: 8px 0;
                }
                .ds-activity-head {
                    font-family: var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 10px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #8a857c;
                    margin-bottom: 6px;
                }
                .ds-activity-body {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                }
                .ds-art {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    background: #2a2a2e;
                    object-fit: cover;
                    flex-shrink: 0;
                }
                .ds-art-fb {
                    display: grid;
                    place-items: center;
                    color: #d7263d;
                    font-family: var(--font-climate-crisis), 'Climate Crisis', sans-serif;
                    font-size: 22px;
                }
                .ds-activity-text {
                    min-width: 0;
                    flex: 1;
                }
                .ds-activity-name {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #f2ede4;
                    line-height: 1.25;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
                .ds-activity-sub {
                    font-size: 0.75rem;
                    color: #b5b3ad;
                    margin-top: 1px;
                    line-height: 1.3;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                }
                .ds-activity-sub-muted {
                    color: #6f6c66;
                }
                .ds-activity-time {
                    margin-top: 4px;
                    font-family: var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 10px;
                    color: #6f6c66;
                    letter-spacing: 0.06em;
                }
                .ds-empty {
                    font-size: 0.78rem;
                    color: #8a857c;
                    font-style: italic;
                    padding: 4px 0;
                }
                .ds-platform {
                    font-family: var(--font-jetbrains-mono), 'JetBrains Mono', ui-monospace, monospace;
                    font-size: 10px;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    color: #6f6c66;
                }
            `}</style>
        </a>
    );
}
