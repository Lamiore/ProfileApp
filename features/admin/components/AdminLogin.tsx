"use client";

import { LogIn, Settings } from "lucide-react";

interface AdminLoginProps {
    onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
    return (
        <div className="adm-login-screen">
            <div className="adm-login-icon"><Settings size={32} /></div>
            <h3 className="adm-login-title">Admin Panel</h3>
            <p className="adm-login-desc">Sign in untuk mengelola konten</p>
            <button type="button" className="adm-btn-primary" onClick={onLogin} style={{ marginTop: "8px" }}>
                <LogIn size={14} /> Sign in with Google
            </button>
        </div>
    );
}
