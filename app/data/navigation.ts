export interface NavItem {
    label: string;
    href: string;
}

export const navigationItems: NavItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Tickets', href: '/ticket' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];
