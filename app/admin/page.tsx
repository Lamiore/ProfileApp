"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Admin from "@/features/admin/components/AdminWindow";

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (!u) {
                router.replace("/admin/login");
            } else {
                setUser(u);
                setChecking(false);
            }
        });
        return () => unsub();
    }, [router]);

    useEffect(() => {
        document.documentElement.classList.add("adm-scroll");
        document.body.classList.add("adm-scroll");
        return () => {
            document.documentElement.classList.remove("adm-scroll");
            document.body.classList.remove("adm-scroll");
        };
    }, []);

    if (checking || !user) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Loading...</span>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", padding: "clamp(1rem, 2.4vw, 2rem) clamp(1rem, 2.4vw, 2rem) 3rem" }}>
            <div style={{ width: "100%", maxWidth: "1180px", margin: "0 auto" }}>
                <Admin />
            </div>
        </div>
    );
}
