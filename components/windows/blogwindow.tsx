"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";
import { FileText } from "lucide-react";

interface BlogBlock {
    id: number;
    type: "text" | "image";
    content: string;
}

interface Blog {
    id: string;
    title: string;
    blocks?: BlogBlock[];
    thumbnail?: string;
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

export default function BlogWindow() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const { navigateTo } = usePageTransition();

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Blog)));
        });
        return () => unsub();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {blogs.length > 0 ? (
                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "#E0E0E0" }}>Semua Blog</span>
                        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{blogs.length} artikel</span>
                    </div>
                    <div className="wnd-blog-grid">
                        {blogs.map((blog) => (
                            <div
                                key={blog.id}
                                className="wnd-blog-card"
                                onClick={() => navigateTo(`/blog/${blog.id}`)}
                            >
                                <div className="wnd-blog-card-thumb">
                                    {blog.thumbnail ? (
                                        <img src={blog.thumbnail} alt={blog.title} referrerPolicy="no-referrer" />
                                    ) : (
                                        <div className="wnd-blog-card-thumb-empty">
                                            <FileText size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="wnd-blog-card-body">
                                    <h3 className="wnd-blog-card-title">{blog.title}</h3>
                                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{formatDate(blog.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "2rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                    Belum ada tulisan yang dipublikasikan.
                </div>
            )}
        </div>
    );
}
