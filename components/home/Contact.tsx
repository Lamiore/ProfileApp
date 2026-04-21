"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useLanyard,
  type LanyardActivity,
  type LanyardData,
  type LanyardStatus,
} from "@/lib/useLanyard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DISCORD_USER_ID = "501362625943175199";

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

export default function Contact({ name }: { name: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { data, status: wsStatus } = useLanyard(DISCORD_USER_ID);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const discordLine = useMemo(() => {
    if (!data) {
      return {
        username: wsStatus === "connecting" ? "connecting…" : "offline",
        status: "offline" as LanyardStatus,
        meta: "",
      };
    }

    const username =
      data.discord_user.global_name ||
      data.discord_user.username ||
      "ilhmhmmd";

    let meta = STATUS_LABEL[data.discord_status];

    if (data.listening_to_spotify && data.spotify) {
      meta = `listening to ${data.spotify.song} — ${data.spotify.artist}`;
    } else {
      const act = data.activities.find((a) => a.type !== 4);
      if (act) {
        const verb = activityVerb(act.type);
        meta = verb ? `${verb} ${act.name}` : act.name;
      } else {
        const custom = data.activities.find((a) => a.type === 4);
        if (custom?.state) meta = custom.state;
      }
    }

    return { username, status: data.discord_status, meta };
  }, [data, wsStatus]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef);

      gsap.set(q(".ct-label"), { opacity: 0, x: -30 });
      gsap.set(q(".ct-title-word"), {
        opacity: 0,
        yPercent: 140,
        rotate: (i) => (i % 2 === 0 ? -6 : 6),
      });
      gsap.set(q(".ct-title-wrap"), {
        opacity: 0,
        scale: 0,
        rotate: -20,
        transformOrigin: "left center",
      });
      gsap.set(q(".ct-divider"), {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(q(".ct-item"), { opacity: 0, y: 30 });
      gsap.set(q(".ct-btn"), {
        opacity: 0,
        scale: 0,
        rotate: -30,
        transformOrigin: "center center",
      });
      gsap.set(q(".ct-footer span"), { opacity: 0, y: 10 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 65%",
          toggleActions: "play none none none",
        },
      });

      tl.to(q(".ct-label"), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .to(
          q(".ct-title-word"),
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.8)",
          },
          "-=0.3"
        )
        .to(
          q(".ct-title-wrap"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(2.2)",
          },
          ">-0.25"
        )
        .to(
          q(".ct-divider"),
          { scaleX: 1, duration: 0.9, ease: "power3.out" },
          "-=0.4"
        )
        .to(
          q(".ct-item"),
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.4"
        )
        .to(
          q(".ct-btn"),
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(2)",
          },
          "-=0.3"
        )
        .to(
          q(".ct-footer span"),
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    <section
      ref={sectionRef}
      className="section contact-section"
      style={{
        background: "var(--paper-2)",
        maxWidth: "none",
        position: "relative",
        minHeight: "90vh",
      }}
    >
      <div className="contact-inner">
        <span className="section-label ct-label">§ fin / get in touch</span>

        <h2 className="contact-big">
          <span className="ct-title-word">and</span>
          <br />
          <span className="ct-title-word">that&rsquo;s</span>{" "}
          <span className="ct-title-wrap">a wrap.</span>
        </h2>

        <div className="ct-divider" aria-hidden />

        <div className="contact-grid">
          <a
            className="ct-item"
            href="mailto:ilhamaditmohammad@gmail.com"
            target="_blank"
            rel="noreferrer"
          >
            <span className="ct-item-label">
              <span className="ct-item-num">01</span> email —
            </span>
            <span className="ct-item-value">ilhamaditmohammad@gmail.com</span>
            <span className="ct-item-meta">drop a line, any time.</span>
          </a>

          <div className="ct-item">
            <span className="ct-item-label">
              <span className="ct-item-num">02</span> phone —
            </span>
            <span className="ct-item-value ct-item-value-muted">
              +62 ••• •••• ••••
            </span>
            <span className="ct-item-meta">number coming soon.</span>
          </div>

          <a
            className="ct-item ct-item-discord"
            href={`https://discord.com/users/${DISCORD_USER_ID}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className="ct-item-label">
              <span className="ct-item-num">03</span> discord —
              <span
                className={`ct-live-dot ${
                  discordLine.status === "offline" ? "is-offline" : "is-live"
                }`}
                style={{ background: STATUS_COLOR[discordLine.status] }}
                aria-hidden
              />
              <span className="ct-live-text">
                {wsStatus === "open" ? "live" : wsStatus}
              </span>
            </span>
            <span className="ct-item-value">{discordLine.username}</span>
            <span className="ct-item-meta">{discordLine.meta || "—"}</span>

            <div className="ct-bubble" role="tooltip" aria-hidden>
              <div className="ct-bubble-tail" aria-hidden />

              <div className="ct-bubble-header">
                {data ? (
                  <img
                    className="ct-bubble-avatar"
                    src={getAvatarUrl(data.discord_user)}
                    alt={`${discordLine.username} avatar`}
                    loading="lazy"
                  />
                ) : (
                  <div className="ct-bubble-avatar ct-bubble-avatar-skeleton" />
                )}
                <div className="ct-bubble-heading">
                  <div className="ct-bubble-name">
                    {discordLine.username}
                    <span
                      className="ct-bubble-status-dot"
                      style={{ background: STATUS_COLOR[discordLine.status] }}
                    />
                  </div>
                  <div className="ct-bubble-status">
                    {STATUS_LABEL[discordLine.status]}
                    {data?.discord_user.username && (
                      <span className="ct-bubble-handle">
                        · @{data.discord_user.username}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {customStatus && (
                <div className="ct-bubble-custom">
                  <span className="ct-bubble-quote">“</span>
                  <span>{customStatus.state || customStatus.name}</span>
                </div>
              )}

              <div className="ct-bubble-divider" />

              {primaryActivity ? (
                <div className="ct-bubble-activity">
                  <div className="ct-bubble-activity-head">
                    {activityVerb(primaryActivity.type) || "active"}
                  </div>
                  <div className="ct-bubble-activity-body">
                    {data?.listening_to_spotify && data.spotify ? (
                      <img
                        className="ct-bubble-art"
                        src={data.spotify.album_art_url}
                        alt={data.spotify.album}
                        loading="lazy"
                      />
                    ) : (
                      (() => {
                        const img = getActivityImage(primaryActivity);
                        return img ? (
                          <img
                            className="ct-bubble-art"
                            src={img}
                            alt={primaryActivity.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="ct-bubble-art ct-bubble-art-fallback">
                            {primaryActivity.name.slice(0, 1).toUpperCase()}
                          </div>
                        );
                      })()
                    )}
                    <div className="ct-bubble-activity-text">
                      <div className="ct-bubble-activity-name">
                        {data?.listening_to_spotify && data.spotify
                          ? data.spotify.song
                          : primaryActivity.name}
                      </div>
                      {data?.listening_to_spotify && data.spotify ? (
                        <>
                          <div className="ct-bubble-activity-sub">
                            by {data.spotify.artist}
                          </div>
                          <div className="ct-bubble-activity-sub ct-bubble-activity-sub-muted">
                            on {data.spotify.album}
                          </div>
                        </>
                      ) : (
                        <>
                          {primaryActivity.details && (
                            <div className="ct-bubble-activity-sub">
                              {primaryActivity.details}
                            </div>
                          )}
                          {primaryActivity.state && (
                            <div className="ct-bubble-activity-sub ct-bubble-activity-sub-muted">
                              {primaryActivity.state}
                            </div>
                          )}
                        </>
                      )}
                      {primaryActivity.timestamps?.start && (
                        <div className="ct-bubble-activity-time">
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
                <div className="ct-bubble-empty">
                  no rich presence right now.
                </div>
              )}

              {platforms.length > 0 && (
                <>
                  <div className="ct-bubble-divider" />
                  <div className="ct-bubble-platform">
                    on {platforms.join(" · ")}
                  </div>
                </>
              )}
            </div>
          </a>
        </div>

        <div className="ct-cta">
          <a
            className="rough-btn ct-btn"
            href="mailto:ilhamaditmohammad@gmail.com"
            style={{ textDecoration: "none" }}
          >
            let&rsquo;s work together →
          </a>
        </div>
      </div>

      <div className="hide-mobile ct-footer">
        <span>
          © {new Date().getFullYear()} {name}
        </span>
        <span>made with ♥ + caffeine</span>
        <span>v.12.12.24 / home</span>
      </div>
    </section>
  );
}
