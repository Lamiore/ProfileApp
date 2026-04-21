"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { LogOut, Image as ImageIcon, FileText, LayoutGrid, Briefcase } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAdminAuth } from "../hooks/use-admin-auth";
import { AdminLogin } from "./AdminLogin";
import AdminGalleryForm from "./AdminGalleryForm";
import AdminBlogForm from "./AdminBlogForm";
import AdminWorksForm from "./AdminWorksForm";

type TabKey = "gallery" | "blog" | "works";

const TABS: { key: TabKey; icon: React.ReactNode; label: string; subtitle: string }[] = [
    {
        key: "gallery",
        icon: <ImageIcon size={15} />,
        label: "Gallery",
        subtitle: "Media yang tampil di halaman gallery.",
    },
    {
        key: "blog",
        icon: <FileText size={15} />,
        label: "Blog",
        subtitle: "Artikel dan tulisan yang terbit di halaman blog.",
    },
    {
        key: "works",
        icon: <Briefcase size={15} />,
        label: "Works",
        subtitle: "Card pekerjaan yang tampil di section skills + works.",
    },
];

function useCollectionCount(path: string) {
    const [count, setCount] = useState<number | null>(null);
    useEffect(() => {
        const unsub = onSnapshot(collection(db, path), (snap) => setCount(snap.size));
        return () => unsub();
    }, [path]);
    return count;
}

export default function AdminWindow() {
    const [tab, setTab] = useState<TabKey>("gallery");
    const { user, login, logout } = useAdminAuth();

    const galleryCount = useCollectionCount("images");
    const blogCount = useCollectionCount("blogs");
    const worksCount = useCollectionCount("works");

    if (!user) return <AdminLogin onLogin={login} />;

    const counts: Record<TabKey, number | null> = {
        gallery: galleryCount,
        blog: blogCount,
        works: worksCount,
    };
    const active = TABS.find((t) => t.key === tab)!;
    const activeCount = counts[tab];

    return (
        <div className="adm-shell">
            {/* ── Sidebar ── */}
            <aside className="adm-sidebar">
                <div className="adm-brand">
                    <div className="adm-brand-mark">
                        <LayoutGrid size={14} />
                    </div>
                    <div className="adm-brand-text">
                        <span className="adm-brand-name">Studio</span>
                        <span className="adm-brand-tag">Admin · v1.0</span>
                    </div>
                </div>

                <nav className="adm-nav" aria-label="Admin sections">
                    <span className="adm-nav-label">Workspace</span>
                    {TABS.map((t) => {
                        const isActive = tab === t.key;
                        const c = counts[t.key];
                        return (
                            <button
                                key={t.key}
                                type="button"
                                className={`adm-nav-item ${isActive ? "adm-nav-item-active" : ""}`}
                                onClick={() => setTab(t.key)}
                            >
                                <span className="adm-nav-icon">{t.icon}</span>
                                <span className="adm-nav-text">{t.label}</span>
                                <span className="adm-nav-count">{c ?? "—"}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="adm-sidebar-footer">
                    <div className="adm-user">
                        <img src={user.photoURL || ""} alt="" className="adm-avatar" referrerPolicy="no-referrer" />
                        <div className="adm-user-info">
                            <span className="adm-user-name">{user.displayName}</span>
                            <span className="adm-user-email">{user.email}</span>
                        </div>
                    </div>
                    <button type="button" className="adm-sidebar-logout" onClick={logout} aria-label="Keluar">
                        <LogOut size={14} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* ── Content ── */}
            <main className="adm-content">
                <header className="adm-page-head">
                    <div className="adm-page-head-top">
                        <div>
                            <span className="adm-page-eyebrow">Dashboard</span>
                            <h1 className="adm-page-title">{active.label}</h1>
                        </div>
                        <div className="adm-page-stat">
                            <span className="adm-page-stat-value">
                                {activeCount === null ? "—" : String(activeCount).padStart(2, "0")}
                            </span>
                            <span className="adm-page-stat-label">
                                {tab === "gallery"
                                    ? "media"
                                    : tab === "blog"
                                        ? "artikel"
                                        : "works"}
                            </span>
                        </div>
                    </div>
                    <p className="adm-page-subtitle">{active.subtitle}</p>
                    <div className="adm-page-rule" aria-hidden="true" />
                </header>

                <div className="adm-pane">
                    {tab === "gallery" && <AdminGalleryForm />}
                    {tab === "blog" && <AdminBlogForm />}
                    {tab === "works" && <AdminWorksForm />}
                </div>
            </main>
        </div>
    );
}
