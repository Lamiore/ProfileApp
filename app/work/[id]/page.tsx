"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { usePageTransition } from "@/components/PageTransition";
import ImageComparison from "@/components/ImageComparison";
import { ArrowLeft } from "lucide-react";

interface WorkBlock {
    type: "text" | "image" | "comparison";
    content: string;
}

interface Work {
    title: string;
    description?: string;
    imageUrl?: string;
    blocks?: WorkBlock[];
    createdAt?: { toDate: () => Date };
}

const formatDate = (ts: { toDate: () => Date } | undefined) => {
    if (!ts || typeof ts.toDate !== "function") return "";
    return ts.toDate().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
};

function parseComparison(content: string) {
    try {
        const data = JSON.parse(content);
        return {
            beforeUrl: data.beforeUrl || "",
            afterUrl: data.afterUrl || "",
            beforeLabel: data.beforeLabel || "Before",
            afterLabel: data.afterLabel || "After",
        };
    } catch {
        return null;
    }
}

export default function WorkDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { navigateTo } = usePageTransition();
    const [work, setWork] = useState<Work | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getDoc(doc(db, "works", id)).then((snap) => {
            if (snap.exists()) {
                setWork(snap.data() as Work);
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
                ) : !work ? (
                    <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(224,224,224,0.4)", fontSize: "13px" }}>
                        Work tidak ditemukan.
                    </div>
                ) : (
                    <>
                        {/* Cover image */}
                        {work.imageUrl && (
                            <img
                                src={work.imageUrl}
                                alt={work.title}
                                referrerPolicy="no-referrer"
                                style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    display: "block",
                                    marginBottom: "28px",
                                    maxHeight: "360px",
                                    objectFit: "cover",
                                }}
                            />
                        )}

                        {/* Title */}
                        <h1 style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            lineHeight: 1.3,
                            margin: "0 0 12px",
                            color: "#E0E0E0",
                        }}>
                            {work.title}
                        </h1>

                        {/* Date */}
                        <p style={{
                            fontSize: "13px",
                            color: "rgba(224,224,224,0.4)",
                            margin: "0 0 32px",
                        }}>
                            {formatDate(work.createdAt)}
                        </p>

                        {/* Description (for legacy works without blocks) */}
                        {work.description && !work.blocks?.length && (
                            <p style={{
                                fontSize: "15px",
                                lineHeight: 1.8,
                                color: "rgba(224,224,224,0.85)",
                                margin: 0,
                                whiteSpace: "pre-wrap",
                            }}>
                                {work.description}
                            </p>
                        )}

                        {/* Content blocks */}
                        {work.blocks && work.blocks.length > 0 && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                                {work.blocks.map((block, i) => {
                                    if (block.type === "comparison") {
                                        const cmp = parseComparison(block.content);
                                        if (!cmp || !cmp.beforeUrl || !cmp.afterUrl) return null;
                                        return (
                                            <ImageComparison
                                                key={i}
                                                beforeUrl={cmp.beforeUrl}
                                                afterUrl={cmp.afterUrl}
                                                beforeLabel={cmp.beforeLabel}
                                                afterLabel={cmp.afterLabel}
                                            />
                                        );
                                    }
                                    if (block.type === "image") {
                                        return (
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
                                        );
                                    }
                                    return (
                                        <p key={i} style={{
                                            fontSize: "15px",
                                            lineHeight: 1.8,
                                            color: "rgba(224,224,224,0.85)",
                                            margin: 0,
                                            whiteSpace: "pre-wrap",
                                        }}>
                                            {block.content}
                                        </p>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
