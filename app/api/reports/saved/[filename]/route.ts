import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
    const user = await verifyAuth(request);

    // Only admins can view AI log reports
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const { filename } = await params;
        
        if (!filename || !filename.endsWith('.md') || filename.includes('..')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'app', 'data', 'reports', filename);
        
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf8');

        return NextResponse.json({ data: content });
    } catch (error: unknown) {
        console.error('Error fetching report content:', error);
        return NextResponse.json({ error: 'Failed to fetch report content.' }, { status: 500 });
    }
}
