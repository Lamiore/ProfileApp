"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Arvo');

                *, *:after, *:before { box-sizing: border-box; }

                .nf-page {
                    background: #1a1a1a;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    gap: 48px;
                    --size: min(18vw, 18vh);
                    --b-bg: #d0d2ca;
                    --c-bg: #585858;
                    font-family: 'Arvo', serif;
                }

                .nf-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: calc(var(--size) / 3);
                }

                /* ── the "4" shapes ── */
                .four {
                    position: relative;
                    color: var(--b-bg);
                    font-size: calc(var(--size) / 2.5);
                    width: 1.75em;
                    height: 1.75em;
                    border-bottom: 0.4em solid;
                    border-left: 0.4em solid;
                }
                .four:after {
                    content: '';
                    position: absolute;
                    background-color: var(--c-bg);
                    width: 0.4em;
                    height: 2em;
                    left: 50%;
                    top: 0;
                    transform: translate(-50%, 25%);
                }

                /* ── sheep body ── */
                .sheep {
                    font-size: calc(var(--size) / 2.5);
                    height: var(--size);
                    width: var(--size);
                    border-radius: 50%;
                    background: var(--b-bg);
                    position: relative;
                }
                /* wool puffs */
                .sheep:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 0;
                    transform: translate(-50%, -25%);
                    color: var(--b-bg);
                    background: currentcolor;
                    height: 1em;
                    width: 1em;
                    border-radius: 50%;
                    box-shadow: 0 2em, 1em 1em, -1em 1em, -0.75em 1.75em,
                        0.75em 1.75em, 0.75em 0.25em, -0.75em 0.25em;
                }
                /* legs */
                .sheep:before {
                    content: '';
                    position: absolute;
                    color: var(--c-bg);
                    background: currentcolor;
                    width: 0.2em;
                    height: 0.65em;
                    top: 100%;
                    left: 25%;
                    transform: translate(0, -25%);
                    box-shadow: 1em 0;
                }

                /* ── head ── */
                .sheep .head {
                    position: absolute;
                    width: 0.75em;
                    height: 1em;
                    border-radius: 0.3em;
                    background: var(--c-bg);
                    z-index: 2;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    transform-origin: 50% 5%;
                    animation: headMove 5s infinite;
                }
                /* nose */
                .sheep .head:after {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0.2em;
                    transform: translateX(-50%);
                    width: 0.2em;
                    height: 0.13em;
                    background: rgba(0,0,0,0.1);
                    border-bottom: 0.06em solid #414241;
                    border-radius: 0.05em;
                }
                /* mouth */
                .sheep .head:before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    bottom: 0.12em;
                    transform: translateX(-50%);
                    width: 0.05em;
                    height: 0.1em;
                    background: #414241;
                    border-radius: 0.02em;
                }

                /* ── ears ── */
                .sheep .head .ear {
                    position: absolute;
                    height: 0.6em;
                    width: 0.5em;
                    border-radius: 0 100%;
                    background: #494949;
                    top: -15%;
                    left: 90%;
                    transform: rotate(-10deg);
                    animation: rightEarMove 5s infinite;
                }
                .sheep .head .ear + .ear {
                    transform: rotate(90deg);
                    animation: leftEarMove 5s infinite;
                    left: auto;
                    right: 90%;
                }

                /* ── eyes ── */
                .sheep .head .eye {
                    position: absolute;
                    left: -0.15em;
                    top: -0.15em;
                    height: 0.55em;
                    width: 0.55em;
                    border-radius: 50%;
                    border: 0.1em solid var(--c-bg);
                    background: var(--c-bg) linear-gradient(var(--c-bg) 40%, #fff 0) no-repeat;
                    background-size: 100% 0.88em;
                    background-position: 0px -0.2em;
                    overflow: hidden;
                    animation: eyeShade 5s infinite;
                }
                .sheep .head .eye:before {
                    content: '';
                    position: absolute;
                    height: 0.1em;
                    width: 0.1em;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: #3e3f3e;
                    transform-origin: 50% -0.1em;
                    animation: eyeMovement 5s infinite;
                }
                .sheep .head .eye + .eye {
                    left: auto;
                    right: -0.15em;
                }

                /* ── animations ── */
                @keyframes headMove {
                    0%, 50%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                    25%           { transform: translate(-75%, -50%) rotate(5deg); }
                    75%           { transform: translate(-25%, -50%) rotate(-5deg); }
                }
                @keyframes rightEarMove {
                    0%, 50%, 100% { transform: translateX(0) rotate(-10deg); }
                    25%           { transform: translateX(0) rotate(-15deg); }
                    75%           { transform: translateX(-0.1em) rotate(-10deg); }
                }
                @keyframes leftEarMove {
                    0%, 50%, 100% { transform: translateX(0) rotate(90deg); }
                    25%           { transform: translateX(0.1em) rotate(90deg); }
                    75%           { transform: translateX(-0.1em) rotate(90deg); }
                }
                @keyframes eyeMovement {
                    0%, 50%, 100% { transform: translate(-50%, 0.05em) rotate(0deg); }
                    25%           { transform: translate(-50%, 0.05em) rotate(45deg); }
                    75%           { transform: translate(-50%, 0.05em) rotate(-45deg); }
                }
                @keyframes eyeShade {
                    0%, 50%, 100% { background-position: 0px -0.14em; }
                    25%, 75%      { background-position: 0px -0.22em; }
                }

                /* ── text section ── */
                .nf-text {
                    text-align: center;
                }
                .nf-text h3 {
                    font-size: 24px;
                    color: #d0d2ca;
                    margin: 0 0 10px;
                }
                .nf-text p {
                    color: #888;
                    font-size: 15px;
                    margin: 0 0 24px;
                }
                .nf-link {
                    color: #fff;
                    padding: 10px 24px;
                    background: #3a3a3a;
                    display: inline-block;
                    text-decoration: none;
                    border-radius: 4px;
                    border: 1px solid #555;
                    font-family: 'Arvo', serif;
                    font-size: 14px;
                    transition: background 0.2s, border-color 0.2s;
                }
                .nf-link:hover {
                    background: #4a4a4a;
                    border-color: #888;
                }
            `}</style>

            <div className="nf-page">
                <div className="nf-row">
                    <div className="four" />
                    <div className="sheep">
                        <div className="head">
                            <div className="ear" />
                            <div className="ear" />
                            <div className="eye" />
                            <div className="eye" />
                        </div>
                    </div>
                    <div className="four" />
                </div>

                <div className="nf-text">
                    <h3>Look like you&apos;re lost</h3>
                    <p>the page you are looking for is not available!</p>
                    <Link href="/" className="nf-link">Go to Home</Link>
                </div>
            </div>
        </>
    );
}
