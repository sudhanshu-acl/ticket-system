// app/api/permission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Permission from '@/app/models/permission';
import { requirePermission } from '@/app/lib/permissions';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        requirePermission(user.role, 'admin');

        await connectDB();
        const permissions = await Permission.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Permissions fetched successfully', data: permissions });
    } catch (err: any) {
        logger.error('[Permission] fetch failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        requirePermission(user.role, 'admin');

        const { name, code, description } = await request.json();

        if (!name || !code || !description) {
            return NextResponse.json({ error: 'Name, code, and description are required' }, { status: 400 });
        }

        await connectDB();

        const existingPerm = await Permission.findOne({ $or: [{ name }, { code }] });
        if (existingPerm) {
            return NextResponse.json({ error: 'Permission with this name or code already exists' }, { status: 409 });
        }

        const newPerm = await Permission.create({
            name,
            code,
            description,
        });

        logger.info('[Permission] created successfully', { permId: newPerm._id, createdBy: user.email });

        return NextResponse.json({ message: 'Permission created successfully', data: newPerm }, { status: 201 });
    } catch (err: any) {
        logger.error('[Permission] creation failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
