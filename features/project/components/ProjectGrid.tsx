"use client";

import { useProjects } from "../hooks/use-projects";
import { ArrowUpRight } from "lucide-react";

export default function ProjectGrid() {
    const projects = useProjects();

    const loading = projects === null;
    const empty = projects !== null && projects.length === 0;

    return (
        <div className="pj-root">
            <div className="pj-header">
                <h1 className="pj-title font-display">the project</h1>
                <p className="pj-subtitle">
                    case studies, experiments, and a few side quests.
                </p>
            </div>

            {loading && (
                <div className="pj-state pj-state-loading font-mono">
                    loading…
                </div>
            )}

            {empty && (
                <div className="pj-state font-mono">belum ada project.</div>
            )}

            <div className="pj-grid">
                {(projects ?? []).map((p) => (
                    <article key={p.id} className="pj-card">
                        <div className="pj-card-media">
                            {p.isVideo ? (
                                <video
                                    src={p.media}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                />
                            ) : (
                                <img
                                    src={p.media}
                                    alt={p.title}
                                    referrerPolicy="no-referrer"
                                />
                            )}
                        </div>
                        <div className="pj-card-body">
                            {p.tag && (
                                <span className="pj-card-tag font-mono">
                                    {p.tag}
                                </span>
                            )}
                            <h2 className="pj-card-title">{p.title}</h2>
                            {p.desc && (
                                <p className="pj-card-desc">{p.desc}</p>
                            )}
                            {p.link && (
                                <a
                                    href={p.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="pj-card-link font-mono"
                                >
                                    visit site <ArrowUpRight size={14} />
                                </a>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
