import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);

    // Only admins can view AI log reports
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const reportsDir = path.join(process.cwd(), 'app', 'data', 'reports');
        console.log('[API] Fetching log reports from:', reportsDir);
        
        if (!fs.existsSync(reportsDir)) {
            console.log('[API] Log reports directory not found:', reportsDir);
            return NextResponse.json({ data: [] });
        }

        const files = fs.readdirSync(reportsDir);
        console.log('[API] Found log files:', files);
        const reports = files
            .filter(file => file.endsWith('.md'))
            .map(file => {
                const filePath = path.join(reportsDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    createdAt: (stats.birthtime || stats.mtime || new Date()).toISOString(),
                    size: stats.size,
                };
            })
            // Sort by newest first
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log('[API] Returning log reports count:', reports.length);

        return NextResponse.json({ data: reports });
    } catch (error: unknown) {
        console.error('Error fetching reports list:', error);
        return NextResponse.json({ error: 'Failed to fetch reports list.' }, { status: 500 });
    }
}
