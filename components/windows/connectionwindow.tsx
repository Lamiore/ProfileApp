"use client";

const connections = [
    {
        label: "Email",
        value: "ilhamaditmohammad@gmail.com",
        href: "mailto:ilhamaditmohammad@gmail.com",
        icon: "✉️",
    },
    {
        label: "Instagram",
        value: "@lam.webp",
        href: "https://www.instagram.com/lam.webp/",
        icon: "📸",
    },
    {
        label: "LinkedIn",
        value: "Irham Aadiyaat Mohammad",
        href: "https://www.linkedin.com/in/irham-aadiyaat-mohammad/",
        icon: "💼",
    },
];

export default function ConnectionWindow() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ fontSize: "13px", color: "#2C2C2C80", margin: 0, lineHeight: 1.6 }}>
                Terbuka untuk kolaborasi, project kreatif, atau sekadar ngobrol.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                {connections.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "14px 16px",
                            borderRadius: "10px",
                            border: "1px solid rgba(44,44,44,0.08)",
                            background: "rgba(255,255,255,0.3)",
                            textDecoration: "none",
                            transition: "background 0.2s ease, transform 0.2s ease",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.6)";
                            e.currentTarget.style.transform = "translateX(4px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.3)";
                            e.currentTarget.style.transform = "translateX(0)";
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>{item.icon}</span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            <p style={{ fontSize: "11px", color: "#2C2C2C60", margin: 0, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                                {item.label}
                            </p>
                            <p style={{ fontSize: "13px", fontWeight: 500, color: "#2C2C2C", margin: 0 }}>
                                {item.value}
                            </p>
                        </div>
                        <span style={{ marginLeft: "auto", color: "#2C2C2C30", fontSize: "14px" }}>↗</span>
                    </a>
                ))}
            </div>
        </div>
    );
}