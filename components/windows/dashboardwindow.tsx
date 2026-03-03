"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function DashboardWindow() {
    const [activeTab, setActiveTab] = useState("Image");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navItems = ["Image", "Blog", "Project"];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ display: "flex", height: "100%", margin: "-24px" }}>
            {/* Sidebar Navigation */}
            <div style={{
                width: "200px",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                padding: "24px 16px",
                background: "rgba(0, 0, 0, 0.2)"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {navItems.map(item => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: "none",
                                background: activeTab === item ? "rgba(255, 255, 255, 0.1)" : "transparent",
                                color: activeTab === item ? "#FFF" : "rgba(224, 224, 224, 0.6)",
                                cursor: "pointer",
                                textAlign: "left",
                                fontSize: "14px",
                                fontWeight: activeTab === item ? 600 : 400,
                                transition: "background 0.2s, color 0.2s"
                            }}
                        >
                            {/* Simple Icons placeholder based on text */}
                            {item === "Image" && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                            )}
                            {item === "Blog" && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            )}
                            {item === "Project" && (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                </svg>
                            )}
                            {item}
                        </button>
                    ))}
                </div>

                {/* Profile Section at Bottom Left */}
                <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "transparent",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            color: "#FFF",
                            transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                    >
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "gray", overflow: "hidden", flexShrink: 0 }}>
                            <img src="/profile.jpg" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 500, flex: 1, textAlign: "left" }}>Lam</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
                            <path d="M18 15l-6-6-6 6" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div style={{
                            position: "absolute",
                            bottom: "100%",
                            left: 0,
                            marginBottom: "8px",
                            width: "100%",
                            background: "rgba(20, 20, 20, 0.95)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "8px",
                            padding: "4px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                            zIndex: 10
                        }}>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "8px 12px",
                                    border: "none",
                                    background: "transparent",
                                    color: "#FF5F57",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    fontSize: "13px",
                                    textAlign: "left"
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 95, 87, 0.1)"}
                                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: "32px", overflowY: "auto", background: "rgba(255,255,255, 0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: 700, margin: 0, color: "#FFF" }}>
                        {activeTab}
                    </h1>
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    border: "2px dashed rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "rgba(224, 224, 224, 0.5)"
                }}>
                    Isi konten kosong dulu
                </div>
            </div>
        </div>
    );
}
