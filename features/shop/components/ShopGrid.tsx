"use client";

import { useShopItems } from "../hooks/use-shop-items";
import type { ShopStatus } from "@/features/admin/types";

const STATUS_LABEL: Record<ShopStatus, string> = {
    "available": "available",
    "sold-out": "sold out",
    "coming-soon": "coming soon",
};

export default function ShopGrid() {
    const items = useShopItems();

    if (items === null) {
        return (
            <div className="sp-state sp-state-loading font-mono">loading…</div>
        );
    }

    if (items.length === 0) {
        return <div className="sp-state font-mono">belum ada item.</div>;
    }

    return (
        <div className="sp-root">
            <div className="sp-header">
                <span className="section-label">shop · objects</span>
                <h1 className="sp-title font-display">the shop</h1>
                <p className="sp-subtitle">
                    prints, zines, and a couple of weird objects.
                </p>
            </div>

            <div className="sp-grid">
                {items.map((s) => {
                    const status = s.status ?? "available";
                    const isUnavailable =
                        status === "sold-out" || status === "coming-soon";
                    return (
                        <article
                            key={s.id}
                            className={`sp-card ${isUnavailable ? "sp-card-muted" : ""
                                }`}
                        >
                            <div className="sp-card-media">
                                <img
                                    src={s.image}
                                    alt={s.title}
                                    referrerPolicy="no-referrer"
                                />
                                <span
                                    className={`sp-badge sp-badge-${status} font-mono`}
                                >
                                    {STATUS_LABEL[status]}
                                </span>
                            </div>
                            <div className="sp-card-body">
                                {s.category && (
                                    <span className="sp-card-category font-mono">
                                        {s.category}
                                    </span>
                                )}
                                <h2 className="sp-card-title">{s.title}</h2>
                                {s.desc && (
                                    <p className="sp-card-desc">{s.desc}</p>
                                )}
                                <div className="sp-card-price">{s.price}</div>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}
