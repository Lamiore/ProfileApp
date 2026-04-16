import Admin from "@/components/sections/admin";

export default function AdminPage() {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0d0d0d", display: "flex", justifyContent: "center", padding: "clamp(1rem, 2.6vw, 2.5rem)" }}>
            <div style={{ width: "100%", maxWidth: "600px" }}>
                <Admin />
            </div>
        </div>
    );
}
