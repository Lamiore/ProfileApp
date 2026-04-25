"use client";

import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import {
    CheckCircle,
    AlertCircle,
    Image as ImageIcon,
    ShoppingBag,
    Plus,
    Pencil,
    X,
} from "lucide-react";
import { SwipeDeleteItem } from "./SwipeDeleteItem";
import { useAdminShop } from "../hooks/use-admin-shop";
import type { ShopItem, ShopStatus } from "../types";

const STATUS_OPTIONS: { value: ShopStatus; label: string }[] = [
    { value: "available", label: "Tersedia" },
    { value: "sold-out", label: "Habis" },
    { value: "coming-soon", label: "Segera Hadir" },
];

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

export default function AdminShopForm() {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { items, addItem, updateItem, deleteItem } = useAdminShop();

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [imageBroken, setImageBroken] = useState(false);
    const [price, setPrice] = useState("");
    const [desc, setDesc] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState<ShopStatus>("available");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const resetForm = () => {
        setTitle("");
        setImage("");
        setImageBroken(false);
        setPrice("");
        setDesc("");
        setCategory("");
        setStatus("available");
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    const startEdit = (s: ShopItem) => {
        setEditingId(s.id);
        setTitle(s.title ?? "");
        setImage(s.image ?? "");
        setImageBroken(false);
        setPrice(s.price ?? "");
        setDesc(s.desc ?? "");
        setCategory(s.category ?? "");
        setStatus(s.status ?? "available");
        setShowForm(true);
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !image.trim() || !price.trim()) {
            setError("Judul, gambar, dan harga wajib diisi.");
            return;
        }
        setSubmitting(true);
        setError("");
        try {
            const data: Record<string, unknown> = {
                title: title.trim(),
                image: image.trim(),
                price: price.trim(),
                desc: desc.trim(),
                category: category.trim(),
                status,
            };
            if (editingId) {
                await updateItem(editingId, data);
            } else {
                data.createdAt = serverTimestamp();
                await addItem(data);
            }
            setSuccess(true);
            resetForm();
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            setError("Gagal menyimpan item.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        await deleteItem(id);
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
                            {editingId ? "Edit Item" : "Tambah Item"}
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
                                placeholder="Contoh: riso print — moonlight"
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
                            <label className="adm-label">Gambar (URL)</label>
                            <div className="adm-thumbnail-picker">
                                {image.trim() && !imageBroken ? (
                                    <div className="adm-thumbnail-preview">
                                        <img
                                            src={image}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            onError={() => setImageBroken(true)}
                                            onLoad={() => setImageBroken(false)}
                                        />
                                        <button
                                            type="button"
                                            className="adm-thumbnail-remove"
                                            onClick={() => {
                                                setImage("");
                                                setImageBroken(false);
                                            }}
                                            disabled={submitting}
                                            aria-label="Hapus gambar"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="adm-thumbnail-empty">
                                        <ImageIcon size={22} />
                                        <span>
                                            {image.trim() && imageBroken
                                                ? "URL gambar tidak dapat dimuat"
                                                : "Belum ada gambar"}
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="url"
                                    className="adm-input"
                                    placeholder="https://example.com/product.jpg"
                                    value={image}
                                    onChange={(e) => {
                                        setImage(e.target.value);
                                        setImageBroken(false);
                                    }}
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Harga</label>
                            <input
                                type="text"
                                className="adm-input"
                                placeholder="Contoh: Rp 120.000"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    setError("");
                                }}
                                disabled={submitting}
                                maxLength={40}
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
                            <label className="adm-label">Kategori</label>
                            <input
                                type="text"
                                className="adm-input"
                                placeholder="Contoh: print / zine / merch"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                disabled={submitting}
                                maxLength={40}
                            />
                        </div>

                        <div className="adm-field">
                            <label className="adm-label">Status</label>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 8,
                                }}
                            >
                                {STATUS_OPTIONS.map((opt) => (
                                    <label key={opt.value} className="adm-radio">
                                        <input
                                            type="radio"
                                            name="shop-status"
                                            value={opt.value}
                                            checked={status === opt.value}
                                            onChange={() => setStatus(opt.value)}
                                            disabled={submitting}
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
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
                            disabled={
                                submitting ||
                                !title.trim() ||
                                !image.trim() ||
                                !price.trim()
                            }
                        >
                            <ShoppingBag size={14} />{" "}
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
                    <Plus size={14} /> Tambah Item Baru
                </button>
            )}

            {success && (
                <div className="adm-toast adm-toast-success">
                    <CheckCircle size={14} />{" "}
                    {editingId
                        ? "Item berhasil diperbarui!"
                        : "Item berhasil dipublikasikan!"}
                </div>
            )}

            <div className="adm-list-header">
                <span>Items ({items.length})</span>
            </div>

            {items.length > 0 ? (
                <div className="adm-list">
                    {items.map((s) => (
                        <SwipeDeleteItem
                            key={s.id}
                            onDelete={() => handleDelete(s.id)}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    flex: 1,
                                    cursor: "pointer",
                                }}
                                onClick={() => startEdit(s)}
                            >
                                <div className="adm-list-thumb">
                                    {s.image ? (
                                        <img
                                            src={s.image}
                                            alt=""
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="adm-list-thumb-empty">
                                            <ShoppingBag size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="adm-list-info">
                                    <span className="adm-list-name">{s.title}</span>
                                    <span className="adm-list-date">
                                        {s.price ? `${s.price} · ` : ""}
                                        {formatDate(s.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="adm-list-edit"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startEdit(s);
                                }}
                            >
                                <Pencil size={13} />
                            </button>
                        </SwipeDeleteItem>
                    ))}
                </div>
            ) : (
                <div className="adm-empty">Belum ada item.</div>
            )}
        </div>
    );
}
