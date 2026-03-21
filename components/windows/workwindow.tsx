"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Image as ImageIcon } from "lucide-react";

interface Work {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    createdAt?: { toDate: () => Date };
}

export default function WorkWindow() {
    const [works, setWorks] = useState<Work[]>([]);

    useEffect(() => {
        const q = query(collection(db, "works"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setWorks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Work)));
        });
        return () => unsub();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {works.length > 0 ? (
                <div className="wnd-work-grid">
                    {works.map((work) => (
                        <div key={work.id} className="wnd-work-card">
                            <div className="wnd-work-card-img">
                                {work.imageUrl ? (
                                    <img src={work.imageUrl} alt={work.title} referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="wnd-work-card-img-empty">
                                        <ImageIcon size={28} />
                                    </div>
                                )}
                                {/* Hover overlay with description */}
                                <div className="wnd-work-card-overlay">
                                    <p className="wnd-work-card-desc">{work.description || "No description"}</p>
                                </div>
                            </div>
                            <div className="wnd-work-card-info">
                                <h3 className="wnd-work-card-title">{work.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: "center", padding: "2rem 1rem", color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                    Belum ada work yang ditambahkan.
                </div>
            )}
        </div>
    );
}
