// app/api/user/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import { verifyAuth } from '@/app/lib/auth';
import { logger } from '@/app/lib/logger';

/**
 * Update user profile
 * @param request 
 * @returns updated user profile
 */
export async function PATCH(request: NextRequest) {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    const method = request.method;

    try {
        const { name, role, jobTitle } = await request.json();
        const userAuth = await verifyAuth(request);

        if (!userAuth) {
            logger.api(pathname, method, 401, Date.now() - startTime);
            logger.warn(`Unauthorized attempt to update user profile`, {}, pathname);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const user = await User.findOneAndUpdate(
            { email: userAuth.email }, 
            { name, role, jobTitle }, 
            { new: true }
        ).select('-_id -password');

        logger.api(pathname, method, 200, Date.now() - startTime);
        logger.info(`User profile updated successfully`, { email: userAuth.email }, pathname);
        
        return NextResponse.json({ message: 'User updated successful', data: user });
    } catch (error: unknown) {
        logger.api(pathname, method, 500, Date.now() - startTime);
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error updating user profile: ${errorMessage}`, {}, pathname);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * Get all users
 * @param request 
 * @returns list of users
 */
export async function GET(request: NextRequest) {
    const startTime = Date.now();
    const pathname = request.nextUrl.pathname;
    const method = request.method;

    try {
        const user = await verifyAuth(request);

        // Require admin role for getting all users
        if (!user || user.role !== 'admin') {
            logger.api(pathname, method, 401, Date.now() - startTime);
            logger.warn(`Unauthorized attempt to fetch all users`, { email: user?.email }, pathname);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const users = await User.find().sort({ createdAt: -1 }).limit(20).select('-_id -password');

        logger.api(pathname, method, 200, Date.now() - startTime);
        logger.info(`Successfully fetched users list`, { count: users.length, by: user.email }, pathname);
        
        return NextResponse.json({ message: 'Users fetched successful', data: users });
    } catch (error: unknown) {
        logger.api(pathname, method, 500, Date.now() - startTime);
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Error fetching users: ${errorMessage}`, {}, pathname);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}