 "use client";

import Link from "next/link";
import Image from "next/image";
import { navigationItems } from "../data/navigation";
import { useAuth } from "../context/AuthContext";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isAdmin = user?.role === "admin";
    const isTicket = pathname === "/ticket" || pathname === "/";

    if (isAdmin && isTicket) redirect("/dashboard")

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {!isAdmin && (
                <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
                    <div className="flex flex-wrap items-center justify-center gap-5 w-full">
                        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
                            {/* Left: Logo */}
                            <div className="flex-shrink-0">
                                <Link href="/" className="max-sm:hidden">
                                    <Image src="/logoipsum-418.png" alt="logo" width={144} height={40} />
                                </Link>
                                <Link href="/" className="hidden max-sm:block">
                                    <Image src="/logoipsum-418.png" alt="logo" width={36} height={36} />
                                </Link>
                            </div>

                            {/* Center: Nav Menu */}
                            <nav className="hidden lg:flex flex-1 justify-center px-8">
                                <ul className="flex space-x-6">
                                    {navigationItems.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className="py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Right: Mobile Toggle + Desktop Actions */}
                            <div className="flex items-center gap-4 flex-shrink-0">
                                {/* Mobile Toggle */}
                                <button 
                                    onClick={() => setIsMobileMenuOpen(true)}
                                    className="lg:hidden p-1"
                                    aria-label="Toggle menu"
                                >
                                    <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {/* Desktop Actions */}
                                <div className="hidden lg:flex items-center gap-4">
                                    {user ? (
                                        <>
                                            <span className="text-sm font-medium text-gray-700">
                                                Hi, {user.name?.split(" ")[0]}
                                            </span>
                                            <button onClick={logout} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                                Login
                                            </Link>
                                            <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Overlay */}
                        <div className={`lg:static fixed inset-y-0 left-0 z-50 w-64 lg:w-auto bg-white lg:bg-transparent shadow-xl lg:shadow-none lg:border-0 border-r border-gray-200 lg:translate-x-0 transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                            <button 
                                onClick={closeMenu}
                                className="lg:hidden absolute top-4 right-4 p-2 rounded-full border bg-white shadow-sm z-10"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <ul className="flex-1 p-6 lg:p-0 space-y-4 mt-16 lg:mt-0 lg:flex lg:space-y-0 lg:gap-6">
                                <li className="lg:hidden mb-8">
                                    <Link href="/" onClick={closeMenu} className="block">
                                        <Image src="/logoipsum-418.png" alt="logo" width={144} height={40} />
                                    </Link>
                                </li>
                                {/* {navigationItems.map((item) => (
                                    <li key={item.href} className="lg:border-0 border-b border-gray-200 py-2 lg:py-0">
                                        <Link
                                            href={item.href}
                                            onClick={closeMenu}
                                            className="block py-2 text-base font-medium text-gray-900 hover:text-blue-600 lg:inline-block"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))} */}
                            </ul>
                        </div>

                        {/* Mobile Backdrop */}
                        {isMobileMenuOpen && (
                            <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />
                        )}
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;

