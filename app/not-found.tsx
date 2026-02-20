import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6">

            <div className="text-center max-w-xl">

                {/* 404 Number */}
                <h1 className="text-8xl font-extrabold text-amber-500 drop-shadow-lg">
                    404
                </h1>

                {/* Title */}
                <h2 className="mt-6 text-3xl font-bold tracking-tight">
                    Page Not Found
                </h2>

                {/* Description */}
                <p className="mt-4 text-gray-400">
                    Sorry, we couldn’t find the page you’re looking for.
                    It might have been moved, deleted, or never existed.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 transition-all duration-300 font-medium shadow-lg hover:scale-105"
                    >
                        Return Home
                    </Link>

                    <Link
                        href="/support"
                        className="px-6 py-3 rounded-xl border border-gray-600 hover:border-amber-500 hover:text-amber-400 transition-all duration-300 font-medium"
                    >
                        Contact Support
                    </Link>
                </div>

            </div>
        </div>
    )
}