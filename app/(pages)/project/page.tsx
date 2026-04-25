import ProjectGrid from "@/features/project/components/ProjectGrid";

export default function ProjectPage() {
    return (
        <div
            style={{
                margin: "0 auto",
                padding: "80px clamp(1rem, 2.6vw, 2.5rem) 64px",
            }}
        >
            <ProjectGrid />
        </div>
    );
}
