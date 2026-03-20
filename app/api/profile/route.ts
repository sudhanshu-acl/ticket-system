// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
    
  try {

    const user = await verifyAuth(request);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.info('[Profile] fetch success', { profile: user._id });
    const response = NextResponse.json({
      message: 'Profile fetched successfully',
      data: user,
    });

    return response;
  } catch (err: any) {
    logger.error('[Profile] fetch failed', { error: err.message });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}