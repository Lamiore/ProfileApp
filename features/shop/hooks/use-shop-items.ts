"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ShopItem } from "@/features/admin/types";

export function useShopItems() {
    const [items, setItems] = useState<ShopItem[] | null>(null);

    useEffect(() => {
        const q = query(collection(db, "shop"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setItems(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as ShopItem))
            );
        });
        return () => unsub();
    }, []);

    return items;
}
