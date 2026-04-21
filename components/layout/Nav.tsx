"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/layout/PageTransition";
import StaggeredMenu from "./StaggeredMenu";

const pageLabels: Record<string, string> = {
    "/blog": "BLOG",
    "/gallery": "GALLERY",
    "/shop": "SHOP",
};

export default function Nav() {
    const { navigateTo } = usePageTransition();
    const pathname = usePathname();

    if (pathname === "/admin/login") return null;

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'Blog', ariaLabel: 'Read our blog', link: '/blog' },
        { label: 'Gallery', ariaLabel: 'View our gallery', link: '/gallery' },
        { label: 'Shop', ariaLabel: 'Browse the shop', link: '/shop' }
    ];

    const socialItems = [
        { label: 'Instagram', link: 'https://www.instagram.com/lamiore_/' },
        { label: 'GitHub', link: 'https://github.com/Lamiore' },
        { label: 'LinkedIn', link: 'https://www.linkedin.com/in/irham-aadiyaat-mohammad/' }
    ];

    const logoText = pageLabels[pathname] || "";

    return (
        <StaggeredMenu
            isFixed={true}
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials
            displayItemNumbering={true}
            menuButtonColor="#ffffff"
            openMenuButtonColor="#000000"
            changeMenuColorOnOpen={true}
            colors={['#1b1b1b', '#333333', '#e9204f']}
            accentColor="#e9204f"
            onItemClick={(link) => navigateTo(link)}
            logoUrl=""
            logoText={logoText}
            showDropShadow={pathname === "/"}
        />
    );
}
