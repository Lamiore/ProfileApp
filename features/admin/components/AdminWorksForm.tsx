"use client";

import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import {
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    Film,
    Briefcase,
    Plus,
    Pencil,
    X,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import { useAdminWorks } from "../hooks/use-admin-works";
import type { WorkItem } from "../types";

function formatDate(ts: { toDate: () => Date } | undefined) {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts
        .toDate()
        .toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
}

function guessIsVideo(url: string): boolean {
    const lower = url.toLowerCase().split("?")[0];
    return /\.(mp4|webm|mov|m4v|ogg)$/.test(lower);
}

export default function AdminWorksForm() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { works, addWork, updateWork, deleteWork } = useAdminWorks();

    const [title, setTitle] = useState("");
    const [media, setMedia] = useState("");
    const [mediaBroken, setMediaBroken] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const resetForm = () => {
        setTitle("");
        setMedia("");
        setMediaBroken(false);
        setIsVideo(false);
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (w: WorkItem) => {
        setEditingId(w.id);
        setTitle(w.title ?? "");
        setMedia(w.media ?? "");
        setMediaBroken(false);
        setIsVideo(!!w.isVideo);
        setShowForm(true);
        setError("");
    };

    const handleMediaChange = (value: string) => {
        setMedia(value);
        setMediaBroken(false);
        if (value.trim()) setIsVideo(guessIsVideo(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !media.trim()) {
            setError("Judul dan URL media wajib diisi.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const data: Record<string, unknown> = {
                title: title.trim(),
                media: media.trim(),
                isVideo,
            };
            if (editingId) {
                await updateWork(editingId, data);
            } else {
                data.createdAt = serverTimestamp();
                await addWork(data);
            }
            setSuccess(true);
            resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Gagal menyimpan works.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteWork(id);
    };

    return (
        <div className="adm-form">
            {showForm ? (
                <div
                    className="adm-card"
                    style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <span className="adm-card-label">
                            {editingId ? "Edit Works" : "Tambah Works"}
                        </span>
                        <button
                            type="button"
                            className="adm-btn-ghost"
                            onClick={resetForm}
                        >
                            Batal
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                    >
                        <div className="adm-field">
                            <label className="adm-label">Judul</label>
                            <input
                                type="text"
                                className="adm-input"
                                placeholder="Contoh: scroll-stoppers"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setError("");
                                }}
                                disabled={submitting}
                                maxLength={80}
                            />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Media (URL gambar / video)</label>
                            <div className="adm-thumbnail-picker">
                                {media.trim() && !mediaBroken ? (
                                    <div className="adm-thumbnail-preview">
                                        {isVideo ? (
                                            <video
                                                src={media}
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                                preload="metadata"
                                                onError={() => setMediaBroken(true)}
                                            />
                                        ) : (
                                            <img
                                                src={media}
                                                alt=""
                                                referrerPolicy="no-referrer"
                                                onError={() => setMediaBroken(true)}
                                                onLoad={() => setMediaBroken(false)}
                                            />
                                        )}
                                        <button
                                            type="button"
                                            className="adm-thumbnail-remove"
                                            onClick={() => {
                                                setMedia("");
                                                setMediaBroken(false);
                                            }}
                                            disabled={submitting}
                                            aria-label="Hapus media"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="adm-thumbnail-empty">
                                        {isVideo ? <Film size={22} /> : <ImageIcon size={22} />}
                                        <span>
                                            {media.trim() && mediaBroken
                                                ? "URL media tidak dapat dimuat"
                                                : "Belum ada media"}
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="url"
                                    className="adm-input"
                                    placeholder="https://example.com/cover.jpg atau .mp4"
                                    value={media}
                                    onChange={(e) => handleMediaChange(e.target.value)}
                                    disabled={submitting}
                                />
                                <label
                                    className="adm-radio"
                                    style={{ marginTop: 4 }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isVideo}
                                        onChange={(e) => setIsVideo(e.target.checked)}
                                        disabled={submitting}
                                    />
                                    <span>File ini berupa video (mp4/webm)</span>
                                </label>
                                <span className="adm-field-hint">
                                    Auto-deteksi dari ekstensi URL — ubah manual bila perlu.
                                </span>
                            </div>
                        </div>

                        {error && (
                            <div className="adm-toast adm-toast-error">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="adm-btn-primary"
                            disabled={submitting || !title.trim() || !media.trim()}
                        >
                            <Briefcase size={14} />{" "}
                            {submitting
                                ? "Menyimpan..."
                                : editingId
                                    ? "Simpan Perubahan"
                                    : "Publikasikan"}
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    type="button"
                    className="adm-btn-outline"
                    onClick={() => {
                        setEditingId(null);
                        setShowForm(true);
                    }}
                    style={{ width: "100%" }}
                >
                    <Plus size={14} /> Tambah Works Baru
                </button>
            )}

            {success && (
                <div className="adm-toast adm-toast-success">
                    <CheckCircle size={14} />{" "}
                    {editingId
                        ? "Works berhasil diperbarui!"
                        : "Works berhasil dipublikasikan!"}
                </div>
            )}

            <div className="adm-list-header">
                <span>Works ({works.length})</span>
            </div>

            {works.length > 0 ? (
                <div className="adm-list">
                    {works.map((w) => (
                        <SwipeDeleteItem
                            key={w.id}
                            onDelete={() => handleDelete(w.id)}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flex: 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => startEdit(w)}
                            >
                                <div className="adm-list-thumb">
                                    {w.media ? (
                                        w.isVideo ? (
                                            <video
                                                src={w.media}
                                                muted
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <img
                                                src={w.media}
                                                alt=""
                                                referrerPolicy="no-referrer"
                                            />
                                        )
                                    ) : (
                                        <div className="adm-list-thumb-empty">
                                            <Briefcase size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="adm-list-info">
                                    <span className="adm-list-name">{w.title}</span>
                                    <span className="adm-list-date">
                                        {formatDate(w.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="adm-list-edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(w);
                                }}
                            >
                                <Pencil size={13} />
                            </button>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada works.</div>
            )}
        </div>
    );
}
