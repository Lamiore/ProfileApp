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
import type { ProjectItem } from "../types";

export function useAdminProjects() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            setProjects(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectItem))
            );
        });
        return () => unsub();
    }, []);

    const addProject = async (data: Record<string, unknown>) => {
        await addDoc(collection(db, "projects"), data);
    };

    const updateProject = async (id: string, data: Record<string, unknown>) => {
        await setDoc(doc(db, "projects", id), data, { merge: true });
    };

    const deleteProject = async (id: string) => {
        try {
            await deleteDoc(doc(db, "projects", id));
        } catch (e) {
            console.error(e);
        }
    };

    return { projects, addProject, updateProject, deleteProject };
}
