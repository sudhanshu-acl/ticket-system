import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const user = await verifyAuth(request);

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const { filename } = await params;
        
        if (!filename || !filename.endsWith('.json') || filename.includes('..')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'app', 'data', 'analytics', filename);
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        return NextResponse.json({ data });
    } catch (error: unknown) {
        console.error('Error fetching analytics report:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics report.' }, { status: 500 });
    }
}
