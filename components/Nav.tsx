"use client";

import { usePathname } from "next/navigation";
import { usePageTransition } from "@/components/PageTransition";
import StaggeredMenu from "./StaggeredMenu";

export default function Nav() {
    const { navigateTo } = usePageTransition();
    const pathname = usePathname();

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
        { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
        { label: 'Blog', ariaLabel: 'Read our blog', link: '/blog' },
        { label: 'Gallery', ariaLabel: 'View our gallery', link: '/gallery' }
    ];

    const socialItems = [
        { label: 'Twitter', link: 'https://twitter.com' },
        { label: 'Instagram', link: 'https://instagram.com/ikanguramegarorica' },
        { label: 'LinkedIn', link: 'https://linkedin.com/in/irham-aadiyaat-mohammad' }
    ];

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
            showDropShadow={pathname === "/"}
        />
    );
}
