// app/api/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { verifyAuth } from '@/app/lib/auth';
import { connectDB } from '@/app/lib/mongodb';
import Category from '@/app/models/category';
import { requirePermission } from '@/app/lib/permissions';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const categories = await Category.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Categories fetched successfully', data: categories });
    } catch (err: any) {
        logger.error('[Category] fetch failed', { error: err.message });
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

        const existingCategory = await Category.findOne({ $or: [{ name }, { code }] });
        if (existingCategory) {
            return NextResponse.json({ error: 'Category with this name or code already exists' }, { status: 409 });
        }

        const newCategory = await Category.create({
            name,
            code,
            description,
        });

        logger.info('[Category] created successfully', { catId: newCategory._id, createdBy: user.email });

        return NextResponse.json({ message: 'Category created successfully', data: newCategory }, { status: 201 });
    } catch (err: any) {
        logger.error('[Category] creation failed', { error: err.message });
        return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
    }
}
