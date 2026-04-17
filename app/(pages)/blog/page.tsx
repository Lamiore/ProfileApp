import Blog from "@/features/blog/components/BlogWindow";

export default function BlogPage() {
    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "80px clamp(1rem, 2.6vw, 2.5rem) 64px" }}>
            <Blog />
        </div>
    );
}
