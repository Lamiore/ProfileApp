"use client";

import { useEffect, useRef, useState } from "react";
import { collection, addDoc, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { db, auth, provider } from "@/lib/firebase";
import {
    Trash2, CheckCircle, AlertCircle,
    Briefcase, LogIn, LogOut, Image as ImageIcon,
    Copy, FileText, Type, Image, Columns,
    ChevronUp, ChevronDown, Link2, Settings, Plus, Pencil,
} from "lucide-react";

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

function toSlug(title: string): string {
    return title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function formatDate(ts: { toDate: () => Date } | undefined) {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

/* ═══════════════════ SWIPE DELETE ITEM ═══════════════════ */

function SwipeDeleteItem({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleConfirmDelete = () => {
        setConfirming(true);
    };

    const handleFinalDelete = async () => {
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
            setConfirming(false);
        }
    };

    const handleCancel = () => {
        setConfirming(false);
    };

    if (deleting) {
        return (
            <div className="adm-list-item adm-list-item-deleting">
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Menghapus...</span>
            </div>
        );
    }

    if (confirming) {
        return (
            <div className="adm-list-item adm-list-item-confirm">
                <span style={{ fontSize: "13px", color: "#f87171", fontWeight: 500 }}>Hapus item ini?</span>
                <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                    <button type="button" className="adm-confirm-cancel" onClick={handleCancel}>Batal</button>
                    <button type="button" className="adm-confirm-delete" onClick={handleFinalDelete}>
                        <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                        <span style={{ pointerEvents: 'none' }}>Hapus</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="adm-list-item">
            {children}
            <button type="button" className="adm-list-delete" onClick={(e) => { e.stopPropagation(); handleConfirmDelete(); }}>
                <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                <span style={{ pointerEvents: 'none' }}>Hapus</span>
            </button>
        </div>
    );
}

/* ═══════════════════ GALLERY TAB ═══════════════════ */

interface GalleryItem { id: string; url: string; name?: string; createdAt?: { toDate: () => Date }; }

function GalleryTab() {
    const [showForm, setShowForm] = useState(false);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [url, setUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [gdriveType, setGdriveType] = useState<"image" | "video">("image");

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
                    {items.map((item) => (
                        <SwipeDeleteItem key={item.id} onDelete={() => handleDelete(item.id)}>
                            <div className="adm-list-thumb">
                                <img src={item.url} alt="" referrerPolicy="no-referrer"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <div className="adm-list-info">
                                <span className="adm-list-name">{item.name || "Media"}</span>
                                <span className="adm-list-date">{formatDate(item.createdAt)}</span>
                            </div>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada media.</div>
            )}
        </div>
    );
}

/* ═══════════════════ BLOG TAB ═══════════════════ */

interface BlogBlock { id: number; type: "text" | "image"; content: string; }
interface BlogItem { id: string; title: string; thumbnail?: string; blocks?: { type: string; content: string }[]; createdAt?: { toDate: () => Date }; }

function BlogTab() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [title, setTitle] = useState("");
    const [blocks, setBlocks] = useState<BlogBlock[]>([{ id: Date.now(), type: "text", content: "" }]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogItem)));
        });
        return () => unsub();
    }, []);

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
            await setDoc(doc(db, "blogs", docId), data, { merge: editingId ? true : false });
            setSuccess(true); resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch { setError("Gagal menyimpan blog."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await deleteDoc(doc(db, "blogs", id)); } catch (e) { console.error(e); }
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

/* ═══════════════════ WORK TAB ═══════════════════ */

interface WorkBlock { id: number; type: "text" | "image" | "comparison"; content: string; }
interface WorkItem { id: string; title: string; imageUrl?: string; description?: string; blocks?: WorkBlock[]; createdAt?: { toDate: () => Date }; }

function WorkTab() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [works, setWorks] = useState<WorkItem[]>([]);
    const [title, setTitle] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [blocks, setBlocks] = useState<WorkBlock[]>([{ id: Date.now(), type: "text", content: "" }]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setWorks(snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkItem)));
        });
        return () => unsub();
    }, []);

    const addBlock = (type: "text" | "image" | "comparison") => {
        const content = type === "comparison" ? JSON.stringify({ beforeUrl: "", afterUrl: "", beforeLabel: "Before", afterLabel: "After" }) : "";
        setBlocks(p => [...p, { id: Date.now(), type, content }]);
    };
    const updateBlock = (id: number, content: string) => setBlocks(p => p.map(b => b.id === id ? { ...b, content } : b));
    const updateComparisonField = (id: number, field: string, value: string) => {
        setBlocks(p => p.map(b => {
            if (b.id !== id) return b;
            try {
                const data = JSON.parse(b.content);
                data[field] = value;
                return { ...b, content: JSON.stringify(data) };
            } catch { return b; }
        }));
    };
    const removeBlock = (id: number) => setBlocks(p => p.filter(b => b.id !== id));
    const moveBlock = (i: number, dir: number) => {
        const n = [...blocks]; const t = i + dir;
        if (t < 0 || t >= n.length) return;
        [n[i], n[t]] = [n[t], n[i]]; setBlocks(n);
    };

    const resetForm = () => {
        setTitle(""); setImageUrl(""); setBlocks([{ id: Date.now(), type: "text", content: "" }]);
        setEditingId(null); setShowForm(false); setError("");
    };

    const startEdit = (work: WorkItem) => {
        setEditingId(work.id);
        setTitle(work.title);
        setImageUrl(work.imageUrl || "");
        if (work.blocks && work.blocks.length > 0) {
            setBlocks(work.blocks.map((b, i) => ({ id: Date.now() + i, type: b.type as "text" | "image" | "comparison", content: b.content })));
        } else {
            const initialBlocks: WorkBlock[] = [];
            if (work.description) initialBlocks.push({ id: Date.now(), type: "text", content: work.description });
            if (initialBlocks.length === 0) initialBlocks.push({ id: Date.now(), type: "text", content: "" });
            setBlocks(initialBlocks);
        }
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        setSubmitting(true); setError("");
        try {
            const docId = editingId || toSlug(title);
            if (!docId) { setError("Judul tidak valid untuk URL."); setSubmitting(false); return; }
            const description = blocks.find(b => b.type === "text" && b.content.trim())?.content.trim() || "";
            const data: Record<string, unknown> = {
                title: title.trim(), slug: docId,
                imageUrl: imageUrl.trim() || null,
                description,
                blocks: blocks.map(({ type, content }) => ({ type, content: content.trim() })),
            };
            if (!editingId) data.createdAt = serverTimestamp();
            await setDoc(doc(db, "works", docId), data, { merge: editingId ? true : false });
            setSuccess(true); resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch { setError("Gagal menyimpan."); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await deleteDoc(doc(db, "works", id)); } catch (e) { console.error(e); }
    };

    return (
        <div className="adm-form">
            {showForm ? (
                <div className="adm-card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className="adm-card-label">{editingId ? "Edit Work" : "Tambah Work"}</span>
                        <button type="button" className="adm-btn-ghost" onClick={resetForm}>Batal</button>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div className="adm-field">
                            <label className="adm-label">Cover Image</label>
                            <input type="url" className="adm-input" placeholder="https://example.com/image.jpg" value={imageUrl}
                                onChange={(e) => { setImageUrl(e.target.value); setError(""); }} disabled={submitting} />
                            {imageUrl.trim() && <img src={imageUrl} alt="" referrerPolicy="no-referrer"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                style={{ width: "100%", borderRadius: "8px", marginTop: "8px", maxHeight: "140px", objectFit: "cover" }} />}
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Judul</label>
                            <input type="text" className="adm-input" placeholder="Nama project..." value={title}
                                onChange={(e) => { setTitle(e.target.value); setError(""); }} disabled={submitting} />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Konten</label>
                            <div className="adm-blocks">
                                {blocks.map((block, i) => {
                                    const cmpData = block.type === "comparison" ? (() => { try { return JSON.parse(block.content); } catch { return { beforeUrl: "", afterUrl: "", beforeLabel: "Before", afterLabel: "After" }; } })() : null;
                                    return (
                                    <div key={block.id} className="adm-block-item">
                                        <div className="adm-block-controls">
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, -1)} disabled={i === 0}><ChevronUp size={14} /></button>
                                            <div className="adm-block-type">{block.type === "comparison" ? <Columns size={11} /> : block.type === "image" ? <Image size={11} /> : <Type size={11} />}</div>
                                            <button type="button" className="adm-block-btn" onClick={() => moveBlock(i, 1)} disabled={i === blocks.length - 1}><ChevronDown size={14} /></button>
                                        </div>
                                        <div className="adm-block-content">
                                            {block.type === "text" ? (
                                                <textarea className="adm-input adm-textarea" placeholder="Tulis konten..." value={block.content}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)} disabled={submitting} rows={3} />
                                            ) : block.type === "comparison" && cmpData ? (
                                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <input type="text" className="adm-input" placeholder="Label before" value={cmpData.beforeLabel}
                                                            onChange={(e) => updateComparisonField(block.id, "beforeLabel", e.target.value)} disabled={submitting}
                                                            style={{ flex: 1 }} />
                                                        <input type="text" className="adm-input" placeholder="Label after" value={cmpData.afterLabel}
                                                            onChange={(e) => updateComparisonField(block.id, "afterLabel", e.target.value)} disabled={submitting}
                                                            style={{ flex: 1 }} />
                                                    </div>
                                                    <input type="url" className="adm-input" placeholder="Before image URL..." value={cmpData.beforeUrl}
                                                        onChange={(e) => updateComparisonField(block.id, "beforeUrl", e.target.value)} disabled={submitting} />
                                                    <input type="url" className="adm-input" placeholder="After image URL..." value={cmpData.afterUrl}
                                                        onChange={(e) => updateComparisonField(block.id, "afterUrl", e.target.value)} disabled={submitting} />
                                                    {cmpData.beforeUrl && cmpData.afterUrl && (
                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginTop: "4px" }}>
                                                            <div style={{ position: "relative" }}>
                                                                <img src={cmpData.beforeUrl} alt="" referrerPolicy="no-referrer"
                                                                    style={{ width: "100%", borderRadius: "6px", maxHeight: "80px", objectFit: "cover", display: "block" }} />
                                                                <span style={{ position: "absolute", top: "4px", left: "4px", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.5)", color: "#fff" }}>{cmpData.beforeLabel}</span>
                                                            </div>
                                                            <div style={{ position: "relative" }}>
                                                                <img src={cmpData.afterUrl} alt="" referrerPolicy="no-referrer"
                                                                    style={{ width: "100%", borderRadius: "6px", maxHeight: "80px", objectFit: "cover", display: "block" }} />
                                                                <span style={{ position: "absolute", top: "4px", left: "4px", fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: "rgba(0,0,0,0.5)", color: "#fff" }}>{cmpData.afterLabel}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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
                                    );
                                })}
                            </div>
                            <div className="adm-block-actions">
                                <button type="button" className="adm-btn-outline" onClick={() => addBlock("text")}><Type size={13} /> Teks</button>
                                <button type="button" className="adm-btn-outline" onClick={() => addBlock("image")}><Image size={13} /> Gambar</button>
                                <button type="button" className="adm-btn-outline" onClick={() => addBlock("comparison")}><Columns size={13} /> Comparison</button>
                            </div>
                        </div>

                        {error && <div className="adm-toast adm-toast-error"><AlertCircle size={14} /> {error}</div>}

                        <button type="submit" className="adm-btn-primary" disabled={submitting || !title.trim()}>
                            <Briefcase size={14} /> {submitting ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Work"}
                        </button>
                    </form>
                </div>
            ) : (
                <button type="button" className="adm-btn-outline" onClick={() => { setEditingId(null); setShowForm(true); }} style={{ width: "100%" }}>
                    <Plus size={14} /> Tambah Work
                </button>
            )}

            {success && <div className="adm-toast adm-toast-success"><CheckCircle size={14} /> {editingId ? "Work berhasil diperbarui!" : "Work berhasil ditambahkan!"}</div>}

            {/* List */}
            <div className="adm-list-header">
                <span>Work ({works.length})</span>
            </div>

            {works.length > 0 ? (
                <div className="adm-list">
                    {works.map((work) => (
                        <SwipeDeleteItem key={work.id} onDelete={() => handleDelete(work.id)}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, cursor: "pointer" }} onClick={() => startEdit(work)}>
                                <div className="adm-list-thumb">
                                    {work.imageUrl ? (
                                        <img src={work.imageUrl} alt="" referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="adm-list-thumb-empty"><Briefcase size={16} /></div>
                                    )}
                                </div>
                                <div className="adm-list-info">
                                    <span className="adm-list-name">{work.title}</span>
                                    <span className="adm-list-date">{work.description || formatDate(work.createdAt)}</span>
                                </div>
                            </div>
                            <button type="button" className="adm-list-edit" onClick={(e) => { e.stopPropagation(); startEdit(work); }}>
                                <Pencil size={13} />
                            </button>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada work.</div>
            )}
        </div>
    );
}

/* ═══════════════════ MAIN ═══════════════════ */

export default function AdminWindow() {
    const [tab, setTab] = useState<"gallery" | "blog" | "work">("gallery");
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => { const u = onAuthStateChanged(auth, setUser); return () => u(); }, []);

    const login = async () => { try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); } };
    const logout = async () => { try { await signOut(auth); } catch (e) { console.error(e); } };

    if (!user) {
        return (
            <div className="adm-login-screen">
                <div className="adm-login-icon"><Settings size={32} /></div>
                <h3 className="adm-login-title">Admin Panel</h3>
                <p className="adm-login-desc">Sign in untuk mengelola konten</p>
                <button type="button" className="adm-btn-primary" onClick={login} style={{ marginTop: "8px" }}>
                    <LogIn size={14} /> Sign in with Google
                </button>
            </div>
        );
    }

    return (
        <div className="adm-container">
            <div className="adm-header">
                <div className="adm-user">
                    <img src={user.photoURL || ""} alt="" className="adm-avatar" referrerPolicy="no-referrer" />
                    <div className="adm-user-info">
                        <span className="adm-user-name">{user.displayName}</span>
                        <span className="adm-user-email">{user.email}</span>
                    </div>
                </div>
                <button type="button" className="adm-btn-ghost" onClick={logout}><LogOut size={13} /> Keluar</button>
            </div>

            <div className="adm-tabs">
                {([
                    { key: "gallery", icon: <ImageIcon size={14} />, label: "Gallery" },
                    { key: "blog", icon: <FileText size={14} />, label: "Blog" },
                    { key: "work", icon: <Briefcase size={14} />, label: "Work" },
                ] as const).map((t) => (
                    <button type="button" key={t.key} className={`adm-tab ${tab === t.key ? "adm-tab-active" : ""}`} onClick={() => setTab(t.key)}>
                        {t.icon}<span>{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="adm-content">
                {tab === "gallery" && <GalleryTab />}
                {tab === "blog" && <BlogTab />}
                {tab === "work" && <WorkTab />}
            </div>
        </div>
    );
}
