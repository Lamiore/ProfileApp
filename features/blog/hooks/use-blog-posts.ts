"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { BlogPost } from "../types";

export function useBlogPosts() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BlogPost)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const filteredBlogs = useMemo(() => {
        if (!searchQuery.trim()) return blogs;
        const q = searchQuery.toLowerCase();
        return blogs.filter((blog) =>
            blog.title.toLowerCase().includes(q) ||
            blog.blocks?.some(b => b.type === "text" && b.content.toLowerCase().includes(q))
        );
    }, [blogs, searchQuery]);

    return { blogs, loading, searchQuery, setSearchQuery, filteredBlogs };
}
