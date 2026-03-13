import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from './app/lib/logger';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    // Log the current request URL and method using the custom logger
    logger.middleware(request.nextUrl.pathname, request.method, { url: request.url });

    const response = NextResponse.next();

    // You can also add custom headers or do more advanced routing here if needed.
    return response;
}

// Configure which paths this middleware applies to.
// By default, let's log everything except static files and images.
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
