'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navigationItems } from '../data/navigation';
import { useAuth } from '../context/AuthContext';
import { redirect, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { User } from '../utils/type';

const Header = () => {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isTicket = pathname === '/ticket' || pathname === '/';
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState<User | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleProfile = async () => {
        const willOpen = !isProfileOpen;
        setIsProfileOpen(willOpen);
        
        if (willOpen && !profileData && !loadingProfile) {
            setLoadingProfile(true);
            try {
                const res = await fetch('/api/profile');
                const data = await res.json();
                if (data.data) setProfileData(data.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoadingProfile(false);
            }
        }
    };

    if (isAdmin && isTicket) redirect('/dashboard')

    return (
        <>
            {!isAdmin && <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
                <div className="flex flex-wrap items-center justify-between gap-5 w-full">
                    <Link href="/" className="max-sm:hidden">
                        <Image src="/logoipsum-418.png" alt="logo" width={144} height={40} />
                    </Link>
                    <Link href="/" className="hidden max-sm:block">
                        <Image src="/logoipsum-418.png" alt="logo" width={36} height={36} />
                    </Link>

                    <div id="collapseMenu"
                        className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50">
                        <button id="toggleClose" className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white w-9 h-9 flex items-center justify-center border border-gray-200 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-black" viewBox="0 0 320.591 320.591">
                                <path
                                    d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                                    data-original="#000000"></path>
                                <path
                                    d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                                    data-original="#000000"></path>
                            </svg>
                        </button>

                        <ul
                            className="lg:flex gap-x-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
                            <li className="mb-6 hidden max-lg:block">
                                <Link href="/">
                                    <Image src="/logoipsum-418.png" alt="logo" width={144} height={40} />
                                </Link>
                            </li>
                            {navigationItems.map((item) => (
                                <li key={item.href} className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3">
                                    <Link
                                        href={item.href}
                                        className="hover:text-blue-700 text-slate-900 block font-medium text-[15px]"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex items-center max-lg:ml-auto space-x-4">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <div className="flex items-center gap-3 cursor-pointer" onClick={toggleProfile}>
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 max-sm:hidden hover:text-blue-600 transition-colors">
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    <svg className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                                
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                                            <h3 className="font-semibold text-gray-800">User Profile</h3>
                                        </div>
                                        <div className="p-4">
                                            {loadingProfile ? (
                                                <div className="flex justify-center py-4">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                                </div>
                                            ) : profileData ? (
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</p>
                                                        <p className="text-sm font-medium text-gray-800">{profileData.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</p>
                                                        <p className="text-sm font-medium text-gray-800">{profileData.email}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Role</p>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 capitalize mt-1">
                                                                {profileData.role || 'User'}
                                                            </span>
                                                        </div>
                                                        {profileData.jobTitle && (
                                                            <div>
                                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Job Title</p>
                                                                <p className="text-sm font-medium text-gray-800 mt-1">{profileData.jobTitle}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-red-500">Failed to load profile.</p>
                                            )}
                                        </div>
                                        <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-end">
                                            <button
                                                onClick={() => { setIsProfileOpen(false); logout(); }}
                                                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors w-full text-left flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm rounded-full font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:bg-gray-400 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 text-sm rounded-full font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:bg-gray-400 transition-all"
                                >  Sign Up </Link>
                            </>
                        )}

                        <button id="toggleOpen" className="lg:hidden cursor-pointer">
                            <svg className="w-7 h-7" fill="#000" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>}
        </>
    )
}

export default Header
