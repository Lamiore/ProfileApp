import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
import "./globals.css";
import PageTransitionProvider from "@/components/PageTransition";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/Satoshi-Variable.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Lam",
  description: "created by ilham",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${satoshi.variable} ${geistSans.variable} ${geistMono.variable} ${sacramento.variable} antialiased`}
        style={{ 
          background: "#111", 
          padding: "16px", 
          height: "100dvh", 
          overflow: "hidden", 
          boxSizing: "border-box",
          position: "relative"
        }}
      >
        <PageTransitionProvider>
          {/* Global Frame */}
          <div 
            style={{ 
              width: "100%", 
              height: "100%", 
              borderRadius: "2rem", 
              overflow: "hidden", 
              position: "relative",
              background: "#0A0A0A"
            }}
          >
            {children}
          </div>

          {/* Global LAM badge — outside the radius-clipped area for concave effect */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 100,
              lineHeight: 0.7,
              background: "#111",
              borderTopRightRadius: "1.5rem",
              padding: `1.1rem 1.5rem 16px 16px`,
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "16px",
                width: "1.5rem",
                height: "1.5rem",
                background: "radial-gradient(circle at 100% 100%, transparent calc(100% - 1px), #111 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                left: "100%",
                width: "1.5rem",
                height: "1.5rem",
                background: "radial-gradient(circle at 0 0, transparent calc(100% - 1px), #111 100%)",
              }}
            />
            <span
              className="font-black text-white select-none"
              style={{ 
                fontSize: "clamp(6rem, 22vw, 24rem)", 
                display: "block", 
                letterSpacing: "-0.04em", 
                fontFamily: "Helvetica, Arial, sans-serif" 
              }}
            >
              LAM.
            </span>
          </div>
        </PageTransitionProvider>
      </body>
    </html>
  );
}
