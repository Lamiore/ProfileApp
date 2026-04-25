"use client";

import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    setDoc,
    doc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ShopItem } from "../types";

export function useAdminShop() {
    const [items, setItems] = useState<ShopItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "shop"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setItems(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as ShopItem))
            );
        });
        return () => unsub();
    }, []);

    const addItem = async (data: Record<string, unknown>) => {
        await addDoc(collection(db, "shop"), data);
    };

    const updateItem = async (id: string, data: Record<string, unknown>) => {
        await setDoc(doc(db, "shop", id), data, { merge: true });
    };

    const deleteItem = async (id: string) => {
        try {
            await deleteDoc(doc(db, "shop", id));
        } catch (e) {
            console.error(e);
        }
    };

    return { items, addItem, updateItem, deleteItem };
}
