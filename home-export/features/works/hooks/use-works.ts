"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { WorkItem } from "../types";

export function useWorks() {
    const [works, setWorks] = useState<WorkItem[] | null>(null);

    useEffect(() => {
        const q = query(collection(db, "works"), orderBy("createdAt", "asc"));
        const unsub = onSnapshot(q, (snap) => {
            setWorks(
                snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkItem))
            );
        });
        return () => unsub();
    }, []);

    return works;
}
