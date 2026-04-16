"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import { LoginPage } from "@/components/ui/animated-characters-login-page";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.replace("/admin");
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  return <LoginPage onGoogleLogin={handleGoogleLogin} />;
}
