// app/api/role/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Role from '@/app/models/role';
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
        const roleId = resolvedParams.id;

        const { name, description, permissions } = await request.json();

        if (!name || !description) {
            return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
        }

        await connectDB();

        // Prevent modification of system roles
        const targetRoleToEdit = await Role.findById(roleId);
        if (!targetRoleToEdit) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
        if (targetRoleToEdit.isSystem) {
            return NextResponse.json({ error: 'Cannot modify system-protected records' }, { status: 403 });
        }

        // Ensure name is unique if changed
        const existingRole = await Role.findOne({ name, _id: { $ne: roleId } });
        if (existingRole) {
            return NextResponse.json({ error: 'Role with this name already exists' }, { status: 409 });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { $set: { name, description, permissions: permissions || [] } },
            { new: true }
        );

        if (!updatedRole) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        logger.info('[Role] updated successfully', { roleId, updatedBy: user.email });

        return NextResponse.json({ message: 'Role updated successfully', data: updatedRole });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[Role] update failed', { error: err.message });
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
        const roleId = resolvedParams.id;

        await connectDB();

        const targetRoleToDelete = await Role.findById(roleId);
        if (!targetRoleToDelete) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }
        if (targetRoleToDelete.isSystem) {
            return NextResponse.json({ error: 'Cannot delete system-protected records' }, { status: 403 });
        }

        const deletedRole = await Role.findByIdAndDelete(roleId);

        if (!deletedRole) {
            return NextResponse.json({ error: 'Role not found' }, { status: 404 });
        }

        logger.info('[Role] deleted successfully', { roleId, deletedBy: user.email });

        return NextResponse.json({ message: 'Role deleted successfully' });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        logger.error('[Role] deletion failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
