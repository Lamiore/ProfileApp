"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";

export function useAdminAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const u = onAuthStateChanged(auth, setUser);
        return () => u();
    }, []);

    const login = async () => {
        try { await signInWithPopup(auth, provider); } catch (e) { console.error(e); }
    };

    const logout = async () => {
        try { await signOut(auth); } catch (e) { console.error(e); }
    };

    return { user, login, logout };
}
