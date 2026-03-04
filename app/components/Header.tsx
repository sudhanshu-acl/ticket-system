'use client';

import Link from 'next/link';
import Image from 'next/image';
import { navigationItems } from '../data/navigation';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

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
                            <>
                                <span className="text-sm font-medium text-slate-700 max-sm:hidden">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-medium tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer disabled:bg-gray-400 transition-all"
                                >
                                    Logout
                                </button>
                            </>
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
