import { NextResponse, NextRequest } from 'next/server';
import { verifyAuth } from '@/app/lib/auth';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

// Initialize the SDK. It will automatically use process.env.GEMINI_API_KEY
export const ai = new GoogleGenAI({});

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);

    // Only admins can generate AI log reports
    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        // Read the local app.log file
        const logPath = path.join(process.cwd(), 'app.log');
        let logs = '';

        if (fs.existsSync(logPath)) {
            logs = fs.readFileSync(logPath, 'utf8');
        } else {
            return NextResponse.json({ error: 'No logs found to analyze.' }, { status: 404 });
        }

        // Get the last 100 lines for analysis to avoid hitting context limits or sending too much data
        const logLines = logs.split('\n').filter(line => line.trim() !== '');
        const recentLogs = logLines.slice(-100).join('\n');

        if (!recentLogs) {
            return NextResponse.json({ error: 'Log file is empty.' }, { status: 404 });
        }

        const prompt = `
        You are an expert software infrastructure and site reliability engineer.
        Please analyze the following application logs and generate a professional, formatted Markdown report.
        
        Focus on:
        1. Executive Summary: Overeall health and potential critical issues.
        2. Error Analysis: Highlight and explain any [ERROR] or [WARN] lines.
        3. Authentication/Access Issues: Summarize authentication attempts or failures.
        4. Recommendations: Actionable steps to fix any identified problems.
        5. Performance Check: Check lateny and performance issues.
        6. Security Check: Check security issues.
        
        Logs to analyze:
        \`\`\`
        ${recentLogs}
        \`\`\`
        `;

        // Call Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const reportText = response.text || "Failed to generate report text.";

        return NextResponse.json({ data: reportText });

    } catch (error: any) {
        console.error('Error generating AI report:', error);
        return NextResponse.json({ error: error?.message || 'Failed to generate AI report.' }, { status: 500 });
    }
}
