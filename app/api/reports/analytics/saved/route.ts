import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const analyticsDir = path.join(process.cwd(), 'app', 'data', 'analytics');
        console.log('[API] Analytics Directory Path:', analyticsDir);
        
        if (!fs.existsSync(analyticsDir)) {
            console.log('[API] Analytics Directory DOES NOT EXIST at path');
            return NextResponse.json({ data: [] });
        }

        const files = fs.readdirSync(analyticsDir);
        console.log('[API] Found analytics files:', files);
        const reports = files
            .filter(file => file.endsWith('.json'))
            .map(file => {
                const filePath = path.join(analyticsDir, file);
                const stats = fs.statSync(filePath);
                
                // Extract range from filename (analytics-[range]-[date].json)
                const parts = file.split('-');
                const range = parts.length > 1 ? parts[1] : 'unknown';

                return {
                    filename: file,
                    range: range,
                    createdAt: (stats.birthtime || stats.mtime || new Date()).toISOString(),
                    size: stats.size,
                };
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        console.log('[API] Returning analytics reports count:', reports.length);

        return NextResponse.json({ data: reports });
    } catch (error: unknown) {
        console.error('Error fetching analytics list:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics list.' }, { status: 500 });
    }
}
