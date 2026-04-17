"use client";

import { useEffect, useState } from "react";
import { collection, setDoc, doc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogItem } from "../types";

export function useAdminBlog() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogItem)));
        });
        return () => unsub();
    }, []);

    const saveBlog = async (docId: string, data: Record<string, unknown>, merge: boolean) => {
        await setDoc(doc(db, "blogs", docId), data, { merge });
    };

    const deleteBlog = async (id: string) => {
        try { await deleteDoc(doc(db, "blogs", id)); } catch (e) { console.error(e); }
    };

    return { blogs, saveBlog, deleteBlog };
}
