import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono, Sacramento } from "next/font/google";
import "./globals.css";
import PageTransitionProvider from "@/components/PageTransition";
import Nav from "@/components/Nav";

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
      >
        <PageTransitionProvider>
          <Nav />
          {children}
        </PageTransitionProvider>
      </body>
    </html>
  );
}
