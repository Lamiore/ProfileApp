"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";

export default function LoginWindow({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                if (onLoginSuccess) onLoginSuccess();
            } else {
                setIsCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, [onLoginSuccess]);

    const handleGoogleLogin = async () => {
        setIsSigningIn(true);
        setErrorMsg("");
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            if (onLoginSuccess) onLoginSuccess();
        } catch (error: unknown) {
            console.error("Google sign in error", error);
            setErrorMsg(error instanceof Error ? error.message : "Failed to sign in with Google.");
        } finally {
            setIsSigningIn(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "260px" }}>
                <style>{`@keyframes loginSpin { to { transform: rotate(360deg); } }`}</style>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(224,224,224,0.3)" strokeWidth="2.5" style={{ animation: "loginSpin 0.8s linear infinite" }}>
                    <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
                    <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
                </svg>
            </div>
        );
    }

    return (
        <>
            <style>{`@keyframes loginSpin { to { transform: rotate(360deg); } }`}</style>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: "300px",
                padding: "8px",
                textAlign: "center",
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            }}>

                {/* Lock icon */}
                <div style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "22px",
                    background: "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "22px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(224,224,224,0.65)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                {/* Restricted badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 12px",
                    borderRadius: "999px",
                    background: "rgba(254,188,46,0.07)",
                    border: "1px solid rgba(254,188,46,0.2)",
                    marginBottom: "16px",
                }}>
                    <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FEBC2E", flexShrink: 0 }} />
                    <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(254,188,46,0.75)", fontWeight: 600 }}>
                        Restricted
                    </span>
                </div>

                {/* Heading */}
                <h2 style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#E0E0E0",
                    margin: "0 0 10px",
                    letterSpacing: "-0.01em",
                }}>
                    Admin Area
                </h2>
                <p style={{
                    fontSize: "13px",
                    color: "rgba(224,224,224,0.4)",
                    margin: "0 0 36px",
                    lineHeight: 1.7,
                    maxWidth: "230px",
                }}>
                    Sign in with your Google account to access the dashboard.
                </p>

                {/* Google Button */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={isSigningIn}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        width: "100%",
                        maxWidth: "260px",
                        padding: "14px 24px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: isSigningIn ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)",
                        color: isSigningIn ? "rgba(255,255,255,0.3)" : "#E0E0E0",
                        fontWeight: 600,
                        fontSize: "14px",
                        cursor: isSigningIn ? "not-allowed" : "pointer",
                        transition: "background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
                        fontFamily: "inherit",
                        letterSpacing: "0.01em",
                    }}
                    onMouseOver={(e) => {
                        if (!isSigningIn) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)";
                        }
                    }}
                    onMouseOut={(e) => {
                        if (!isSigningIn) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)";
                        }
                    }}
                    onMouseDown={(e) => { if (!isSigningIn) e.currentTarget.style.transform = "scale(0.97)"; }}
                    onMouseUp={(e) => { if (!isSigningIn) e.currentTarget.style.transform = "translateY(-1px)"; }}
                >
                    {isSigningIn ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "loginSpin 0.8s linear infinite", flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
                            <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    {isSigningIn ? "Signing in..." : "Continue with Google"}
                </button>

                {/* Error */}
                {errorMsg && (
                    <div style={{
                        marginTop: "16px",
                        padding: "10px 16px",
                        borderRadius: "8px",
                        background: "rgba(255, 95, 87, 0.07)",
                        border: "1px solid rgba(255, 95, 87, 0.18)",
                        color: "#FF8C88",
                        fontSize: "12px",
                        maxWidth: "260px",
                        lineHeight: 1.6,
                    }}>
                        {errorMsg}
                    </div>
                )}

                <p style={{ margin: "28px 0 0", fontSize: "11px", color: "rgba(224,224,224,0.18)", letterSpacing: "0.04em" }}>
                    Access restricted to authorized accounts
                </p>
            </div>
        </>
    );
}
