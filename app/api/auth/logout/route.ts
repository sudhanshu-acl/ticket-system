import { NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';

export async function POST() {
    try {
        logger.info('[LOGOUT] Logout attempt');

        const response = NextResponse.json({
            message: 'Logout successful'
        });

        response.cookies.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 0,
        });

        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[LOGOUT] Logout failed', { error: err.message });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}