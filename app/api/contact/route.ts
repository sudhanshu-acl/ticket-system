/*
* Contact API route for handling send email to admin
*/

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        logger.info('[Contact] fetch success', { contact: user._id });
        const response = NextResponse.json({
            message: 'Contact fetched successfully',
            data: user,
        });

        return response;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[Contact] fetch failed', { error: err.message });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}