"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ProjectItem } from "@/features/admin/types";

export function useProjects() {
    const [projects, setProjects] = useState<ProjectItem[] | null>(null);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setProjects(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem))
            );
        });
        return () => unsub();
    }, []);

    return projects;
}
