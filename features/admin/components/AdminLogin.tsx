"use client";

import { LogIn, Settings } from "lucide-react";

interface AdminLoginProps {
    onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
    return (
        <div className="adm-login-screen">
            <div className="adm-login-icon"><Settings size={28} /></div>
            <h3 className="adm-login-title">Admin Studio</h3>
            <p className="adm-login-desc">Sign in untuk mengelola gallery dan blog.</p>
            <button type="button" className="adm-btn-primary" onClick={onLogin}>
                <LogIn size={14} /> Sign in with Google
            </button>
        </div>
    );
}
