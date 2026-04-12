"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css?family=Arvo');

                .page_404 {
                    padding: 40px 0;
                    background: #fff;
                    font-family: 'Arvo', serif;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    filter: grayscale(1);
                }

                .page_404 .container {
                    width: 100%;
                    max-width: 960px;
                    margin: 0 auto;
                    padding: 0 15px;
                    text-align: center;
                }

                .four_zero_four_bg {
                    background-image: url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif);
                    height: 400px;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: contain;
                }

                .four_zero_four_bg h1 {
                    font-size: 80px;
                    color: #000;
                }

                .contant_box_404 {
                    margin-top: -50px;
                }

                .contant_box_404 h3 {
                    font-size: 28px;
                    font-family: 'Arvo', serif;
                    color: #000;
                }

                .contant_box_404 p {
                    color: #555;
                    font-size: 16px;
                    margin: 12px 0 24px;
                }

                .link_404 {
                    color: #fff;
                    padding: 10px 20px;
                    background: #39ac31;
                    margin: 20px 0;
                    display: inline-block;
                    text-decoration: none;
                    border-radius: 4px;
                    font-family: 'Arvo', serif;
                    transition: background 0.2s;
                }

                .link_404:hover {
                    background: #2e8f27;
                }
            `}</style>

            <section className="page_404">
                <div className="container">
                    <div className="four_zero_four_bg">
                        <h1 className="text-center">404</h1>
                    </div>
                    <div className="contant_box_404">
                        <h3>Look like you&apos;re lost</h3>
                        <p>the page you are looking for is not available!</p>
                        <Link href="/" className="link_404">Go to Home</Link>
                    </div>
                </div>
            </section>
        </>
    );
}
