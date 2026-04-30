export default function PagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="paper-texture"
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100%",
                backgroundColor: "#0d0d0d",
            }}
        >
            <main style={{ flex: 1 }}>{children}</main>
        </div>
    );
}
