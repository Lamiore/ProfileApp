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
import type { WorkItem } from "../types";

export function useAdminWorks() {
    const [works, setWorks] = useState<WorkItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "works"), orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setWorks(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkItem))
            );
        });
        return () => unsub();
    }, []);

    const addWork = async (data: Record<string, unknown>) => {
        await addDoc(collection(db, "works"), data);
    };

    const updateWork = async (id: string, data: Record<string, unknown>) => {
        await setDoc(doc(db, "works", id), data, { merge: true });
    };

    const deleteWork = async (id: string) => {
        try {
            await deleteDoc(doc(db, "works", id));
        } catch (e) {
            console.error(e);
        }
    };

    return { works, addWork, updateWork, deleteWork };
}
