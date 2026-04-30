"use client";

import { useEffect, useRef, useState } from "react";

export type LanyardStatus = "online" | "idle" | "dnd" | "offline";

export type LanyardActivity = {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
};

export type LanyardData = {
  discord_user: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    discriminator: string;
  };
  discord_status: LanyardStatus;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
  active_on_discord_web: boolean;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    track_id: string;
    timestamps: { start: number; end: number };
  } | null;
};

const WS_URL = "wss://api.lanyard.rest/socket";
const OP_EVENT = 0;
const OP_HELLO = 1;
const OP_INITIALIZE = 2;
const OP_HEARTBEAT = 3;

export function useLanyard(userId: string) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [status, setStatus] = useState<"connecting" | "open" | "closed">(
    "connecting"
  );

  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    const clearTimers = () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
    };

    const connect = () => {
      if (cancelled) return;
      setStatus("connecting");

      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.addEventListener("message", (e) => {
        let msg: { op: number; t?: string; d?: unknown };
        try {
          msg = JSON.parse(e.data as string);
        } catch {
          return;
        }

        if (msg.op === OP_HELLO) {
          const d = msg.d as { heartbeat_interval?: number } | undefined;
          ws.send(
            JSON.stringify({
              op: OP_INITIALIZE,
              d: { subscribe_to_id: userId },
            })
          );
          const interval = d?.heartbeat_interval ?? 30_000;
          heartbeatRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: OP_HEARTBEAT }));
            }
          }, interval);
          return;
        }

        if (msg.op === OP_EVENT) {
          if (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE") {
            setData(msg.d as LanyardData);
            setStatus("open");
          }
        }
      });

      ws.addEventListener("close", () => {
        clearTimers();
        setStatus("closed");
        if (!cancelled) {
          reconnectRef.current = setTimeout(connect, 4000);
        }
      });

      ws.addEventListener("error", () => {
        try {
          ws.close();
        } catch {
          // ignore
        }
      });
    };

    connect();

    return () => {
      cancelled = true;
      clearTimers();
      try {
        wsRef.current?.close();
      } catch {
        // ignore
      }
    };
  }, [userId]);

  return { data, status };
}
