// app/api/permission/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Permission from '@/app/models/permission';
import { requirePermission } from '@/app/lib/permissions';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        requirePermission(user.role, 'admin');

        const resolvedParams = await params;
        const permId = resolvedParams.id;

        const { name, code, description } = await request.json();

        if (!name || !code || !description) {
            return NextResponse.json({ error: 'Name, code, and description are required' }, { status: 400 });
        }

        await connectDB();

        // Prevent modification of system permissions
        const targetPermToEdit = await Permission.findById(permId);
        if (!targetPermToEdit) {
            return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
        }
        if (targetPermToEdit.isSystem) {
            return NextResponse.json({ error: 'Cannot modify system-protected records' }, { status: 403 });
        }

        const existingPerm = await Permission.findOne({ 
            $or: [{ name }, { code }], 
            _id: { $ne: permId } 
        });
        if (existingPerm) {
            return NextResponse.json({ error: 'Permission with this name or code already exists' }, { status: 409 });
        }

        const updatedPerm = await Permission.findByIdAndUpdate(
            permId,
            { $set: { name, code, description } },
            { new: true }
        );

        logger.info('[Permission] updated successfully', { permId, updatedBy: user.email });

        return NextResponse.json({ message: 'Permission updated successfully', data: updatedPerm });
    } catch (err: any) {
        logger.error('[Permission] update failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        requirePermission(user.role, 'admin');

        const resolvedParams = await params;
        const permId = resolvedParams.id;

        await connectDB();

        // Prevent deletion of system permissions
        const permToDelete = await Permission.findById(permId);
        if (!permToDelete) {
            return NextResponse.json({ error: 'Permission not found' }, { status: 404 });
        }
        if (permToDelete.isSystem) {
            return NextResponse.json({ error: 'Cannot delete system-protected records' }, { status: 403 });
        }

        await Permission.findByIdAndDelete(permId);

        logger.info('[Permission] deleted successfully', { permId, deletedBy: user.email });

        return NextResponse.json({ message: 'Permission deleted successfully' });
    } catch (err: any) {
        logger.error('[Permission] deletion failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
