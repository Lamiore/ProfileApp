import Nav from "@/components/Nav";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <Nav />
            <main style={{ flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
