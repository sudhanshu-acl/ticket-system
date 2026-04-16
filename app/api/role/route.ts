// app/api/role/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Role from '@/app/models/role';
import { requirePermission } from '@/app/lib/permissions';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Restrict to admin role
        requirePermission(user.role, 'admin');

        await connectDB();
        const roles = await Role.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Roles fetched successfully', data: roles });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[Role] fetch failed', { error: err.message });
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

        const { name, description, permissions } = await request.json();

        if (!name || !description) {
            return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
        }

        await connectDB();

        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return NextResponse.json({ error: 'Role with this name already exists' }, { status: 409 });
        }

        const newRole = await Role.create({
            name,
            description,
            permissions: permissions || [],
        });

        logger.info('[Role] created successfully', { roleId: newRole._id, createdBy: user.email });

        return NextResponse.json({ message: 'Role created successfully', data: newRole }, { status: 201 });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[Role] creation failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}