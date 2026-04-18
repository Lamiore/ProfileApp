"use client";

import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import {
    Trash2, CheckCircle, AlertCircle,
    FileText, Type, Image as ImageIcon,
    Heading2, Quote, List, Code2, Minus,
    ChevronUp, ChevronDown, Plus, Pencil, X,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import { useAdminBlog } from "../hooks/use-admin-blog";
import type { BlogBlock, BlogBlockType, BlogItem } from "../types";

/* ═══════════════════ HELPERS ═══════════════════ */

function toSlug(title: string): string {
    return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(ts: { toDate: () => Date } | undefined) {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

const BLOCK_TYPES: { type: BlogBlockType; label: string; icon: React.ReactNode; hint: string }[] = [
    { type: "text", label: "Teks", icon: <Type size={13} />, hint: "Paragraf" },
    { type: "heading", label: "Judul", icon: <Heading2 size={13} />, hint: "Heading" },
    { type: "quote", label: "Kutipan", icon: <Quote size={13} />, hint: "Blockquote" },
    { type: "list", label: "Daftar", icon: <List size={13} />, hint: "Bullet list" },
    { type: "code", label: "Kode", icon: <Code2 size={13} />, hint: "Code block" },
    { type: "image", label: "Gambar", icon: <ImageIcon size={13} />, hint: "Image" },
    { type: "divider", label: "Pembatas", icon: <Minus size={13} />, hint: "Divider" },
];

const BLOCK_ICON: Record<BlogBlockType, React.ReactNode> = {
    text: <Type size={11} />,
    heading: <Heading2 size={11} />,
    quote: <Quote size={11} />,
    list: <List size={11} />,
    code: <Code2 size={11} />,
    image: <ImageIcon size={11} />,
    divider: <Minus size={11} />,
};

/* ═══════════════════ BLOCK EDITORS ═══════════════════ */

interface BlockEditorProps {
    block: BlogBlock;
    disabled?: boolean;
    onChange: (patch: Partial<BlogBlock>) => void;
}

function BlockEditor({ block, disabled, onChange }: BlockEditorProps) {
    switch (block.type) {
        case "heading":
            return (
                <>
                    <div className="adm-meta-row">
                        <label className="adm-radio">
                            <input
                                type="radio"
                                name={`heading-${block.id}`}
                                checked={(block.meta ?? "h2") === "h2"}
                                onChange={() => onChange({ meta: "h2" })}
                                disabled={disabled}
                            />
                            <span>H2</span>
                        </label>
                        <label className="adm-radio">
                            <input
                                type="radio"
                                name={`heading-${block.id}`}
                                checked={block.meta === "h3"}
                                onChange={() => onChange({ meta: "h3" })}
                                disabled={disabled}
                            />
                            <span>H3</span>
                        </label>
                    </div>
                    <input
                        type="text"
                        className="adm-input"
                        placeholder="Tulis judul bagian..."
                        value={block.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        disabled={disabled}
                    />
                </>
            );

        case "quote":
            return (
                <>
                    <textarea
                        className="adm-input adm-textarea"
                        placeholder="Tulis kutipan..."
                        value={block.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        disabled={disabled}
                        rows={2}
                    />
                    <input
                        type="text"
                        className="adm-input adm-input-sub"
                        placeholder="Atribusi — opsional (mis. Steve Jobs)"
                        value={block.meta ?? ""}
                        onChange={(e) => onChange({ meta: e.target.value })}
                        disabled={disabled}
                    />
                </>
            );

        case "list":
            return (
                <>
                    <div className="adm-meta-row">
                        <label className="adm-radio">
                            <input
                                type="radio"
                                name={`list-${block.id}`}
                                checked={(block.meta ?? "bullet") === "bullet"}
                                onChange={() => onChange({ meta: "bullet" })}
                                disabled={disabled}
                            />
                            <span>• Bullet</span>
                        </label>
                        <label className="adm-radio">
                            <input
                                type="radio"
                                name={`list-${block.id}`}
                                checked={block.meta === "numbered"}
                                onChange={() => onChange({ meta: "numbered" })}
                                disabled={disabled}
                            />
                            <span>1. Bernomor</span>
                        </label>
                    </div>
                    <textarea
                        className="adm-input adm-textarea"
                        placeholder={"Satu baris = satu item\nItem berikutnya..."}
                        value={block.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        disabled={disabled}
                        rows={3}
                    />
                </>
            );

        case "code":
            return (
                <>
                    <input
                        type="text"
                        className="adm-input adm-input-sub"
                        placeholder="Bahasa — opsional (mis. typescript)"
                        value={block.meta ?? ""}
                        onChange={(e) => onChange({ meta: e.target.value })}
                        disabled={disabled}
                    />
                    <textarea
                        className="adm-input adm-textarea adm-code-area"
                        placeholder="// kode di sini"
                        value={block.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        disabled={disabled}
                        rows={4}
                        spellCheck={false}
                    />
                </>
            );

        case "image":
            return (
                <>
                    <input
                        type="url"
                        className="adm-input"
                        placeholder="https://example.com/image.jpg"
                        value={block.content}
                        onChange={(e) => onChange({ content: e.target.value })}
                        disabled={disabled}
                    />
                    {block.content.trim() && (
                        <img
                            src={block.content}
                            alt=""
                            referrerPolicy="no-referrer"
                            style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "160px", objectFit: "cover" }}
                        />
                    )}
                    <input
                        type="text"
                        className="adm-input adm-input-sub"
                        placeholder="Caption — opsional"
                        value={block.meta ?? ""}
                        onChange={(e) => onChange({ meta: e.target.value })}
                        disabled={disabled}
                    />
                </>
            );

        case "divider":
            return (
                <div className="adm-divider-preview" aria-hidden="true">
                    <span /><span /><span />
                </div>
            );

        case "text":
        default:
            return (
                <textarea
                    className="adm-input adm-textarea"
                    placeholder="Tulis konten..."
                    value={block.content}
                    onChange={(e) => onChange({ content: e.target.value })}
                    disabled={disabled}
                    rows={3}
                />
            );
    }
}

/* ═══════════════════ MAIN FORM ═══════════════════ */

const newBlock = (type: BlogBlockType): BlogBlock => {
    const base: BlogBlock = { id: Date.now() + Math.random(), type, content: "" };
    if (type === "heading") return { ...base, meta: "h2" };
    if (type === "list") return { ...base, meta: "bullet" };
    return base;
};

export default function AdminBlogForm() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { blogs, saveBlog, deleteBlog } = useAdminBlog();
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailBroken, setThumbnailBroken] = useState(false);
    const [blocks, setBlocks] = useState<BlogBlock[]>([newBlock("text")]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const addBlock = (type: BlogBlockType) => setBlocks((p) => [...p, newBlock(type)]);
    const patchBlock = (id: number, patch: Partial<BlogBlock>) =>
        setBlocks((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    const removeBlock = (id: number) => setBlocks((p) => p.filter((b) => b.id !== id));
    const moveBlock = (i: number, dir: number) => {
        const n = [...blocks]; const t = i + dir;
        if (t < 0 || t >= n.length) return;
        [n[i], n[t]] = [n[t], n[i]]; setBlocks(n);
    };

    const resetForm = () => {
        setTitle("");
        setThumbnail("");
        setThumbnailBroken(false);
        setBlocks([newBlock("text")]);
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (blog: BlogItem) => {
        setEditingId(blog.id);
        setTitle(blog.title);
        setThumbnail(blog.thumbnail ?? "");
        setThumbnailBroken(false);
        if (blog.blocks && blog.blocks.length > 0) {
            setBlocks(
                blog.blocks.map((b, i) => ({
                    id: Date.now() + i,
                    type: (b.type as BlogBlockType) ?? "text",
                    content: b.content ?? "",
                    ...(b.meta ? { meta: b.meta } : {}),
                }))
            );
        } else {
            setBlocks([newBlock("text")]);
        }
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true); setError("");
        const fallback = blocks.find((b) => b.type === "image" && b.content.trim())?.content.trim();
        const finalThumbnail = thumbnail.trim() || fallback || null;
        try {
            const docId = editingId || toSlug(title);
            if (!docId) { setError("Judul tidak valid untuk URL."); setSubmitting(false); return; }
            const data: Record<string, unknown> = {
                title: title.trim(),
                slug: docId,
                blocks: blocks.map((b) => {
                    const content = b.type === "divider" ? "" : b.content.trim();
                    const out: { type: string; content: string; meta?: string } = { type: b.type, content };
                    if (b.meta && b.meta.trim()) out.meta = b.meta.trim();
                    return out;
                }),
                thumbnail: finalThumbnail,
            };
            if (!editingId) data.createdAt = serverTimestamp();
            await saveBlog(docId, data, !!editingId);
            setSuccess(true); resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch { setError("Gagal menyimpan blog."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        await deleteBlog(id);
    };

    return (
        <div className="adm-form">
            {showForm ? (
                <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="adm-card-label">{editingId ? "Edit Blog" : "Tulis Blog"}</span>
                        <button type="button" className="adm-btn-ghost" onClick={resetForm}>Batal</button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div className="adm-field">
                            <label className="adm-label">Judul</label>
                            <input type="text" className="adm-input" placeholder="Masukkan judul blog..." value={title}
                                onChange={(e) => { setTitle(e.target.value); setError(""); }} disabled={submitting} />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Thumbnail</label>
                            <div className="adm-thumbnail-picker">
                                {thumbnail.trim() && !thumbnailBroken ? (
                                    <div className="adm-thumbnail-preview">
                                        <img
                                            src={thumbnail}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            onError={() => setThumbnailBroken(true)}
                                            onLoad={() => setThumbnailBroken(false)}
                                        />
                                        <button
                                            type="button"
                                            className="adm-thumbnail-remove"
                                            onClick={() => { setThumbnail(""); setThumbnailBroken(false); }}
                                            disabled={submitting}
                                            aria-label="Hapus thumbnail"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="adm-thumbnail-empty">
                                        <ImageIcon size={22} />
                                        <span>
                                            {thumbnail.trim() && thumbnailBroken
                                                ? "URL gambar tidak dapat dimuat"
                                                : "Belum ada thumbnail"}
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="url"
                                    className="adm-input"
                                    placeholder="https://example.com/cover.jpg"
                                    value={thumbnail}
                                    onChange={(e) => { setThumbnail(e.target.value); setThumbnailBroken(false); }}
                                    disabled={submitting}
                                />
                                <span className="adm-field-hint">
                                    Opsional. Jika kosong, gambar pertama dari konten akan dipakai.
                                </span>
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Konten</label>
                            <div className="adm-blocks">
                                {blocks.map((block, i) => (
                                    <div key={block.id} className="adm-block-item">
                                        <div className="adm-block-controls">
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0}><ChevronUp size={14} /></button>
                                            <div className="adm-block-type" title={block.type}>{BLOCK_ICON[block.type]}</div>
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}><ChevronDown size={14} /></button>
                                        </div>
                                        <div className="adm-block-content">
                                            <BlockEditor
                                                block={block}
                                                disabled={submitting}
                                                onChange={(patch) => patchBlock(block.id, patch)}
                                            />
                                        </div>
                                        <button type="button" className="adm-block-remove" onClick={() => removeBlock(block.id)}><Trash2 size={13} /></button>
                                    </div>
                                ))}
                            </div>

                            <div className="adm-block-inserter" role="group" aria-label="Tambah blok">
                                {BLOCK_TYPES.map((bt) => (
                                    <button
                                        key={bt.type}
                                        type="button"
                                        className="adm-inserter-btn"
                                        onClick={() => addBlock(bt.type)}
                                        title={bt.hint}
                                    >
                                        <span className="adm-inserter-icon">{bt.icon}</span>
                                        <span className="adm-inserter-label">{bt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <div className="adm-toast adm-toast-error"><AlertCircle size={14} /> {error}</div>}

                        <button type="submit" className="adm-btn-primary" disabled={submitting || !title.trim()}>
                            <FileText size={14} /> {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Publikasikan"}
                        </button>
                    </form>
                </div>
            ) : (
                <button type="button" className="adm-btn-outline" onClick={() => { setEditingId(null); setShowForm(true); }} style={{ width: "100%" }}>
                    <Plus size={14} /> Tulis Blog Baru
                </button>
            )}

            {success && <div className="adm-toast adm-toast-success"><CheckCircle size={14} /> {editingId ? "Blog berhasil diperbarui!" : "Blog berhasil dipublikasikan!"}</div>}

            {/* List */}
            <div className="adm-list-header">
                <span>Blog ({blogs.length})</span>
            </div>

            {blogs.length > 0 ? (
                <div className="adm-list">
                    {blogs.map((blog) => (
                        <SwipeDeleteItem key={blog.id} onDelete={() => handleDelete(blog.id)}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }} onClick={() => startEdit(blog)}>
                                <div className="adm-list-thumb">
                                    {blog.thumbnail ? (
                                        <img src={blog.thumbnail} alt="" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="adm-list-thumb-empty"><FileText size={16} /></div>
                                    )}
                                </div>
                                <div className="adm-list-info">
                                    <span className="adm-list-name">{blog.title}</span>
                                    <span className="adm-list-date">{formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                            <button type="button" className="adm-list-edit" onClick={(e) => { e.stopPropagation(); startEdit(blog); }}>
                                <Pencil size={13} />
                            </button>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada blog.</div>
            )}
        </div>
    );
}
