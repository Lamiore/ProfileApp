"use client";

import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import {
    Trash2, CheckCircle, AlertCircle,
    FileText, Type, Image,
    ChevronUp, ChevronDown, Plus, Pencil,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import { useAdminBlog } from "../hooks/use-admin-blog";
import type { BlogBlock, BlogItem } from "../types";

/* ═══════════════════ HELPERS ═══════════════════ */

function toSlug(title: string): string {
    return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(ts: { toDate: () => Date } | undefined) {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminBlogForm() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { blogs, saveBlog, deleteBlog } = useAdminBlog();
    const [title, setTitle] = useState("");
    const [blocks, setBlocks] = useState<BlogBlock[]>([{ id: Date.now(), type: "text", content: "" }]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const addBlock = (type: "text" | "image") => setBlocks(p => [...p, { id: Date.now(), type, content: "" }]);
    const updateBlock = (id: number, content: string) => setBlocks(p => p.map(b => b.id === id ? { ...b, content } : b));
    const removeBlock = (id: number) => setBlocks(p => p.filter(b => b.id !== id));
    const moveBlock = (i: number, dir: number) => {
        const n = [...blocks]; const t = i + dir;
        if (t < 0 || t >= n.length) return;
        [n[i], n[t]] = [n[t], n[i]]; setBlocks(n);
    };

    const resetForm = () => {
        setTitle(""); setBlocks([{ id: Date.now(), type: "text", content: "" }]);
        setEditingId(null); setShowForm(false); setError("");
    };

    const startEdit = (blog: BlogItem) => {
        setEditingId(blog.id);
        setTitle(blog.title);
        if (blog.blocks && blog.blocks.length > 0) {
            setBlocks(blog.blocks.map((b, i) => ({ id: Date.now() + i, type: b.type as "text" | "image", content: b.content })));
        } else {
            setBlocks([{ id: Date.now(), type: "text", content: "" }]);
        }
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true); setError("");
        const thumbnail = blocks.find(b => b.type === "image" && b.content.trim())?.content.trim() || null;
        try {
            const docId = editingId || toSlug(title);
            if (!docId) { setError("Judul tidak valid untuk URL."); setSubmitting(false); return; }
            const data: Record<string, unknown> = {
                title: title.trim(), slug: docId,
                blocks: blocks.map(({ type, content }) => ({ type, content: content.trim() })),
                thumbnail,
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
                <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="adm-card-label">{editingId ? "Edit Blog" : "Tulis Blog"}</span>
                        <button type="button" className="adm-btn-ghost" onClick={resetForm}>Batal</button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div className="adm-field">
                            <label className="adm-label">Judul</label>
                            <input type="text" className="adm-input" placeholder="Masukkan judul blog..." value={title}
                                onChange={(e) => { setTitle(e.target.value); setError(""); }} disabled={submitting} />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Konten</label>
                            <div className="adm-blocks">
                                {blocks.map((block, i) => (
                                    <div key={block.id} className="adm-block-item">
                                        <div className="adm-block-controls">
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0}><ChevronUp size={14} /></button>
                                            <div className="adm-block-type">{block.type === "image" ? <Image size={11} /> : <Type size={11} />}</div>
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}><ChevronDown size={14} /></button>
                                        </div>
                                        <div className="adm-block-content">
                                            {block.type === "text" ? (
                                                <textarea className="adm-input adm-textarea" placeholder="Tulis konten..." value={block.content}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)} disabled={submitting} rows={3} />
                                            ) : (
                                                <>
                                                    <input type="url" className="adm-input" placeholder="https://example.com/image.jpg" value={block.content}
                                                        onChange={(e) => updateBlock(block.id, e.target.value)} disabled={submitting} />
                                                    {block.content.trim() && <img src={block.content} alt="" referrerPolicy="no-referrer"
                                                        style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "140px", objectFit: "cover" }} />}
                                                </>
                                            )}
                                        </div>
                                        <button type="button" className="adm-block-remove" onClick={() => removeBlock(block.id)}><Trash2 size={13} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="adm-block-actions">
                                <button type="button" className="adm-btn-outline" onClick={() => addBlock("text")}><Type size={13} /> Teks</button>
                                <button type="button" className="adm-btn-outline" onClick={() => addBlock("image")}><Image size={13} /> Gambar</button>
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
