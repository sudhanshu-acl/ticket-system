// app/api/category/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Category from '@/app/models/category';
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
        const catId = resolvedParams.id;

        const { name, code, description } = await request.json();

        if (!name || !code || !description) {
            return NextResponse.json({ error: 'Name, code, and description are required' }, { status: 400 });
        }

        await connectDB();

        const targetCategory = await Category.findById(catId);
        if (!targetCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        if (targetCategory.isSystem) {
            return NextResponse.json({ error: 'Cannot modify system-protected records' }, { status: 403 });
        }

        const existingCategory = await Category.findOne({ 
            $or: [{ name }, { code }], 
            _id: { $ne: catId } 
        });
        if (existingCategory) {
            return NextResponse.json({ error: 'Category with this name or code already exists' }, { status: 409 });
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            catId,
            { $set: { name, code, description } },
            { new: true }
        );

        logger.info('[Category] updated successfully', { catId, updatedBy: user.email });

        return NextResponse.json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (err: any) {
        logger.error('[Category] update failed', { error: err.message });
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
        const catId = resolvedParams.id;

        await connectDB();

        const targetCategory = await Category.findById(catId);
        if (!targetCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }
        if (targetCategory.isSystem) {
            return NextResponse.json({ error: 'Cannot delete system-protected records' }, { status: 403 });
        }

        const deletedCategory = await Category.findByIdAndDelete(catId);

        logger.info('[Category] deleted successfully', { catId, deletedBy: user.email });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (err: any) {
        logger.error('[Category] deletion failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
