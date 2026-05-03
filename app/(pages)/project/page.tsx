import ProjectGrid from "@/features/project/components/ProjectGrid";

export default function ProjectPage() {
    return (
        <div
            style={{
                margin: "0 auto",
                padding: "80px clamp(0.75rem, 1.4vw, 1.5rem) 64px",
            }}
        >
            <ProjectGrid />
        </div>
    );
}
