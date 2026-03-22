"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";

interface BlogBlock {
    type: "text" | "image";
    content: string;
}

interface Blog {
    title: string;
    blocks?: BlogBlock[];
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

export default function BlogDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { navigateTo } = usePageTransition();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getDoc(doc(db, "blogs", id)).then((snap) => {
            if (snap.exists()) {
                setBlog(snap.data() as Blog);
            }
            setLoading(false);
        });
    }, [id]);

    return (
        <div style={{
            width: "100vw",
            minHeight: "100vh",
            background: "#0a0a0a",
            color: "#E0E0E0",
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            position: "relative",
        }}>
            {/* Back button — fixed top-left like card page */}
            <button
                onClick={() => navigateTo("/")}
                style={{
                    position: "fixed",
                    top: "32px",
                    left: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "rgba(224,224,224,0.5)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 0",
                    transition: "color 0.2s",
                    zIndex: 10,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#E0E0E0"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(224,224,224,0.5)"; }}
            >
                <ArrowLeft size={16} /> Kembali
            </button>

            <div style={{
                maxWidth: "680px",
                margin: "0 auto",
                padding: "80px 24px 80px",
            }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(224,224,224,0.4)", fontSize: "13px" }}>
                        Memuat...
                    </div>
                ) : !blog ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(224,224,224,0.4)", fontSize: "13px" }}>
                        Blog tidak ditemukan.
                    </div>
                ) : (
                    <>
                        {/* Title */}
                        <h1 style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            lineHeight: 1.3,
                            margin: "0 0 12px",
                            color: "#E0E0E0",
                        }}>
                            {blog.title}
                        </h1>

                        {/* Date */}
                        <p style={{
                            fontSize: "13px",
                            color: "rgba(224,224,224,0.4)",
                            margin: "0 0 40px",
                        }}>
                            {formatDate(blog.createdAt)}
                        </p>

                        {/* Blocks */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                            {blog.blocks?.map((block, i) => (
                                block.type === "image" ? (
                                    <img
                                        key={i}
                                        src={block.content}
                                        alt=""
                                        referrerPolicy="no-referrer"
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            display: "block",
                                        }}
                                    />
                                ) : (
                                    <p key={i} style={{
                                        fontSize: "15px",
                                        lineHeight: 1.8,
                                        color: "rgba(224,224,224,0.85)",
                                        margin: 0,
                                        whiteSpace: "pre-wrap",
                                    }}>
                                        {block.content}
                                    </p>
                                )
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
