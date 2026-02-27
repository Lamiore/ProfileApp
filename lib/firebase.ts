import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAnm3N3A3D9OOLWS_RGq1kZR1cL0R4w4Kc",
    authDomain: "personalapps-48ea5.firebaseapp.com",
    projectId: "personalapps-48ea5",
    storageBucket: "personalapps-48ea5.firebasestorage.app",
    messagingSenderId: "347556985406",
    appId: "1:347556985406:web:b080b9c84754f5d7b36f6f"
};

// Prevent re-initialization in Next.js hot reload
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };
