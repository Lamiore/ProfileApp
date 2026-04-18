"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    CheckCircle, AlertCircle,
    Image as ImageIcon, FileText,
    Link2, Plus, Copy, Check,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import type { GalleryItem } from "../types";

/* ═══════════════════ HELPERS ═══════════════════ */

function getYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname === "/watch") return u.searchParams.get("v");
        if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
        if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1]?.split("?")[0] || null;
        if ((u.hostname === "www.youtube.com" || u.hostname === "youtube.com") && u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1]?.split("?")[0] || null;
    } catch { return null; }
    return null;
}

function getYouTubeThumbnail(id: string) { return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }

function getGDriveId(url: string): string | null {
    try {
        if (!url.includes("drive.google.com")) return null;
        const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        return m ? m[1] : null;
    } catch { return null; }
}

function getUrlType(url: string): "youtube" | "gdrive" | "image" {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("drive.google.com")) return "gdrive";
    return "image";
}

function formatDate(ts: { toDate: () => Date } | undefined) {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminGalleryForm() {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [gdriveType, setGdriveType] = useState<"image" | "video">("image");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyUrl = async (id: string, value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setCopiedId(id);
            setTimeout(() => setCopiedId((curr) => (curr === id ? null : curr)), 1400);
        } catch {
            // Fallback: select + copy via hidden input
            const ta = document.createElement("textarea");
            ta.value = value;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand("copy"); setCopiedId(id); setTimeout(() => setCopiedId(null), 1400); } catch { /* noop */ }
            document.body.removeChild(ta);
        }
    };

    useEffect(() => {
        const q = query(collection(db, "images"), orderBy("createdAt", "desc"));
        let fallback: (() => void) | null = null;
        const unsub = onSnapshot(q, (snap) => {
            setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
        }, () => {
            fallback = onSnapshot(collection(db, "images"), (snap) => {
                setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
            });
        });
        return () => { unsub(); fallback?.(); };
    }, []);

    const valid = (s: string) => { try { new URL(s); return true; } catch { return false; } };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim() || !valid(url)) { setError("URL tidak valid."); return; }
        setSubmitting(true); setError("");
        try {
            const t = getUrlType(url);
            let finalUrl = url, name = "Media", thumb: string | null = null;
            if (t === "youtube") {
                const id = getYouTubeId(url);
                if (!id) { setError("YouTube ID tidak ditemukan."); setSubmitting(false); return; }
                finalUrl = `https://www.youtube.com/embed/${id}`; thumb = getYouTubeThumbnail(id); name = `YouTube-${id}`;
            } else if (t === "gdrive") {
                const id = getGDriveId(url);
                if (!id) { setError("Google Drive ID tidak ditemukan."); setSubmitting(false); return; }
                finalUrl = gdriveType === "video" ? `https://drive.google.com/file/d/${id}/preview` : `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
                name = `GDrive-${id.substring(0, 8)}`;
            }
            await addDoc(collection(db, "images"), {
                url: finalUrl, originalUrl: url, name, type: (t === "youtube" || (t === "gdrive" && gdriveType === "video")) ? "video" : "image",
                source: t, ...(thumb && { thumbnailUrl: thumb }), createdAt: serverTimestamp(),
            });
            setSuccess(true); setUrl(""); setGdriveType("image"); setShowForm(false);
            setTimeout(() => setSuccess(false), 3000);
        } catch { setError("Gagal menyimpan."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await deleteDoc(doc(db, "images", id)); } catch (e) { console.error(e); }
    };

    const urlType = url && valid(url) ? getUrlType(url) : null;
    const youtubeId = urlType === "youtube" ? getYouTubeId(url) : null;
    const gdriveId = urlType === "gdrive" ? getGDriveId(url) : null;

    return (
        <div className="adm-form">
            {/* Add button / form */}
            {showForm ? (
                <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="adm-card-label">Tambah Media</span>
                        <button type="button" className="adm-btn-ghost" onClick={() => { setShowForm(false); setUrl(""); setError(""); }}>Batal</button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input type="url" className="adm-input" placeholder="Paste image, YouTube, atau Google Drive link..."
                            value={url} onChange={(e) => { setUrl(e.target.value); setError(""); }} disabled={submitting} />

                        {gdriveId && (
                            <div className="adm-radio-group">
                                <label className="adm-radio"><input type="radio" name="gdt" checked={gdriveType === "image"} onChange={() => setGdriveType("image")} /><span><ImageIcon size={12} /> Image</span></label>
                                <label className="adm-radio"><input type="radio" name="gdt" checked={gdriveType === "video"} onChange={() => setGdriveType("video")} /><span><FileText size={12} /> Video</span></label>
                            </div>
                        )}

                        {youtubeId && (
                            <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                                <img src={getYouTubeThumbnail(youtubeId)} alt="" style={{ width: "100%", display: "block" }} />
                                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
                                    <div style={{ width: "48px", height: "34px", background: "#FF0000", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && <div className="adm-toast adm-toast-error"><AlertCircle size={14} /> {error}</div>}

                        <button type="submit" className="adm-btn-primary" disabled={submitting || !url.trim()}>
                            <Link2 size={14} /> {submitting ? "Menambahkan..." : "Tambah"}
                        </button>
                    </form>
                </div>
            ) : (
                <button type="button" className="adm-btn-outline" onClick={() => setShowForm(true)} style={{ width: "100%" }}>
                    <Plus size={14} /> Tambah Media
                </button>
            )}

            {success && <div className="adm-toast adm-toast-success"><CheckCircle size={14} /> Berhasil ditambahkan!</div>}

            {/* List */}
            <div className="adm-list-header">
                <span>Media ({items.length})</span>
            </div>

            {items.length > 0 ? (
                <div className="adm-list">
                    {items.map((item) => {
                        const displayUrl = item.originalUrl || item.url;
                        const isCopied = copiedId === item.id;
                        const sourceLabel = item.source === "youtube" ? "YouTube"
                            : item.source === "gdrive" ? "Drive"
                                : item.source ? "Image" : null;
                        return (
                            <SwipeDeleteItem key={item.id} onDelete={() => handleDelete(item.id)}>
                                <div className="adm-list-thumb">
                                    <img src={item.url} alt="" referrerPolicy="no-referrer"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                                </div>
                                <div className="adm-list-info">
                                    <div className="adm-list-name-row">
                                        <span className="adm-list-name">{item.name || "Media"}</span>
                                        {sourceLabel && (
                                            <span className={`adm-list-badge adm-list-badge-${item.source}`}>
                                                {sourceLabel}
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={displayUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="adm-list-url"
                                        onClick={(e) => e.stopPropagation()}
                                        title={displayUrl}
                                    >
                                        <Link2 size={11} />
                                        <span>{displayUrl}</span>
                                    </a>
                                    <span className="adm-list-date">{formatDate(item.createdAt)}</span>
                                </div>
                                <button
                                    type="button"
                                    className={`adm-list-copy ${isCopied ? "adm-list-copy-done" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); copyUrl(item.id, displayUrl); }}
                                    aria-label={isCopied ? "URL disalin" : "Salin URL"}
                                    title={isCopied ? "Disalin!" : "Salin URL"}
                                >
                                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                                </button>
                            </SwipeDeleteItem>
                        );
                    })}
                </div>
            ) : (
                <div className="adm-empty">Belum ada media.</div>
            )}
        </div>
    );
}
