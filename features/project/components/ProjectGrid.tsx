"use client";

import { useProjects } from "../hooks/use-projects";
import { resolveProjectMedia } from "../lib/microlink";
import { ArrowUpRight } from "lucide-react";

export default function ProjectGrid() {
    const projects = useProjects();

    const loading = projects === null;
    const empty = projects !== null && projects.length === 0;

    return (
        <div className="pj-root">
            <div className="pj-header">
                <h1 className="pj-title">curated project</h1>
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
                {(projects ?? []).map((p) => {
                    const resolved = resolveProjectMedia(p);
                    return (
                    <article key={p.id} className="pj-card">
                        <div className="pj-card-media">
                            {resolved ? (
                                resolved.isVideo ? (
                                    <video
                                        src={resolved.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        preload="metadata"
                                    />
                                ) : (
                                    <img
                                        src={resolved.src}
                                        alt={p.title}
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                )
                            ) : (
                                <div className="pj-card-media-empty" />
                            )}

                            <div className="pj-card-overlay">
                                <div className="pj-card-overlay-text">
                                    {p.tag && (
                                        <span className="pj-card-tag font-mono">
                                            {p.tag}
                                        </span>
                                    )}
                                    <h2 className="pj-card-title">{p.title}</h2>
                                    {p.desc && (
                                        <p className="pj-card-desc">{p.desc}</p>
                                    )}
                                </div>
                                {p.link && (
                                    <a
                                        href={p.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="pj-card-link"
                                        aria-label={`visit ${p.title}`}
                                    >
                                        <ArrowUpRight size={22} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </article>
                    );
                })}
            </div>
        </div>
    );
}
