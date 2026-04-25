"use client";

import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import {
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    Film,
    FolderGit2,
    Plus,
    Pencil,
    X,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import { useAdminProjects } from "../hooks/use-admin-projects";
import type { ProjectItem } from "../types";

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

export default function AdminProjectsForm() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { projects, addProject, updateProject, deleteProject } =
        useAdminProjects();

    const [tag, setTag] = useState("");
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [media, setMedia] = useState("");
    const [mediaBroken, setMediaBroken] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [link, setLink] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const resetForm = () => {
        setTag("");
        setTitle("");
        setDesc("");
        setMedia("");
        setMediaBroken(false);
        setIsVideo(false);
        setLink("");
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (p: ProjectItem) => {
        setEditingId(p.id);
        setTag(p.tag ?? "");
        setTitle(p.title ?? "");
        setDesc(p.desc ?? "");
        setMedia(p.media ?? "");
        setMediaBroken(false);
        setIsVideo(!!p.isVideo);
        setLink(p.link ?? "");
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
        if (!title.trim() || !tag.trim() || !media.trim()) {
            setError("Tag, judul, dan URL media wajib diisi.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const data: Record<string, unknown> = {
                tag: tag.trim(),
                title: title.trim(),
                desc: desc.trim(),
                media: media.trim(),
                isVideo,
                link: link.trim(),
            };
            if (editingId) {
                await updateProject(editingId, data);
            } else {
                data.createdAt = serverTimestamp();
                await addProject(data);
            }
            setSuccess(true);
            resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Gagal menyimpan project.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteProject(id);
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
                            {editingId ? "Edit Project" : "Tambah Project"}
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
                            <label className="adm-label">Tag</label>
                            <input
                                type="text"
                                className="adm-input"
                                placeholder="Contoh: 01 · web"
                                value={tag}
                                onChange={(e) => {
                                    setTag(e.target.value);
                                    setError("");
                                }}
                                disabled={submitting}
                                maxLength={40}
                            />
                            <span className="adm-field-hint">
                                Label kecil di atas judul — misal kategori, nomor, atau keduanya.
                            </span>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Judul</label>
                            <input
                                type="text"
                                className="adm-input"
                                placeholder="Contoh: portfolio site"
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
                            <label className="adm-label">Deskripsi singkat</label>
                            <textarea
                                className="adm-input adm-textarea"
                                placeholder="1–2 kalimat pendek yang muncul di card."
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                disabled={submitting}
                                rows={3}
                                maxLength={220}
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

                        <div className="adm-field">
                            <label className="adm-label">Link website (opsional)</label>
                            <input
                                type="url"
                                className="adm-input"
                                placeholder="https://projectku.com"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                disabled={submitting}
                            />
                            <span className="adm-field-hint">
                                Kalau diisi, di card muncul tombol &quot;visit site →&quot;.
                            </span>
                        </div>

                        {error && (
                            <div className="adm-toast adm-toast-error">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="adm-btn-primary"
                            disabled={
                                submitting ||
                                !title.trim() ||
                                !tag.trim() ||
                                !media.trim()
                            }
                        >
                            <FolderGit2 size={14} />{" "}
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
                    <Plus size={14} /> Tambah Project Baru
                </button>
            )}

            {success && (
                <div className="adm-toast adm-toast-success">
                    <CheckCircle size={14} />{" "}
                    {editingId
                        ? "Project berhasil diperbarui!"
                        : "Project berhasil dipublikasikan!"}
                </div>
            )}

            <div className="adm-list-header">
                <span>Projects ({projects.length})</span>
            </div>

            {projects.length > 0 ? (
                <div className="adm-list">
                    {projects.map((p) => (
                        <SwipeDeleteItem
                            key={p.id}
                            onDelete={() => handleDelete(p.id)}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flex: 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => startEdit(p)}
                            >
                                <div className="adm-list-thumb">
                                    {p.media ? (
                                        p.isVideo ? (
                                            <video
                                                src={p.media}
                                                muted
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <img
                                                src={p.media}
                                                alt=""
                                                referrerPolicy="no-referrer"
                                            />
                                        )
                                    ) : (
                                        <div className="adm-list-thumb-empty">
                                            <FolderGit2 size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="adm-list-info">
                                    <span className="adm-list-name">{p.title}</span>
                                    <span className="adm-list-date">
                                        {p.tag ? `${p.tag} · ` : ""}
                                        {formatDate(p.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="adm-list-edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(p);
                                }}
                            >
                                <Pencil size={13} />
                            </button>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada project.</div>
            )}
        </div>
    );
}
