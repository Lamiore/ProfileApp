"use client";

import { useState } from "react";
import { LogOut, Image as ImageIcon, FileText } from "lucide-react";
import { useAdminAuth } from "../hooks/use-admin-auth";
import { AdminLogin } from "./AdminLogin";
import AdminGalleryForm from "./AdminGalleryForm";
import AdminBlogForm from "./AdminBlogForm";

export default function AdminWindow() {
    const [tab, setTab] = useState<"gallery" | "blog">("gallery");
    const { user, login, logout } = useAdminAuth();

    if (!user) return <AdminLogin onLogin={login} />;

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
                ] as const).map((t) => (
                    <button type="button" key={t.key} className={`adm-tab ${tab === t.key ? "adm-tab-active" : ""}`} onClick={() => setTab(t.key)}>
                        {t.icon}<span>{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="adm-content">
                {tab === "gallery" && <AdminGalleryForm />}
                {tab === "blog" && <AdminBlogForm />}
            </div>
        </div>
    );
}
