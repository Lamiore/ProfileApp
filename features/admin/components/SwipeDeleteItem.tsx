"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export function SwipeDeleteItem({ onDelete, children }: { onDelete: () => void; children: React.ReactNode }) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleConfirmDelete = () => {
        setConfirming(true);
    };

    const handleFinalDelete = async () => {
        setDeleting(true);
        try {
            await onDelete();
        } finally {
            setDeleting(false);
            setConfirming(false);
        }
    };

    const handleCancel = () => {
        setConfirming(false);
    };

    if (deleting) {
        return (
            <div className="adm-list-item adm-list-item-deleting">
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Menghapus...</span>
            </div>
        );
    }

    if (confirming) {
        return (
            <div className="adm-list-item adm-list-item-confirm">
                <span style={{ fontSize: "13px", color: "#f87171", fontWeight: 500 }}>Hapus item ini?</span>
                <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
                    <button type="button" className="adm-confirm-cancel" onClick={handleCancel}>Batal</button>
                    <button type="button" className="adm-confirm-delete" onClick={handleFinalDelete}>
                        <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                        <span style={{ pointerEvents: 'none' }}>Hapus</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="adm-list-item">
            {children}
            <button type="button" className="adm-list-delete" onClick={(e) => { e.stopPropagation(); handleConfirmDelete(); }}>
                <Trash2 size={13} style={{ pointerEvents: 'none' }} />
                <span style={{ pointerEvents: 'none' }}>Hapus</span>
            </button>
        </div>
    );
}
