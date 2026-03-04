import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/app/lib/mongodb';
import User from '@/app/models/user';
import Ticket from '@/app/models/ticket';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const verifyAuth = async (request: NextRequest) => {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change-me') as any;
        await connectDB();
        const user = await User.findById(decoded.userId);
        return user;
    } catch (err) {
        return null;
    }
};

export async function GET(request: NextRequest) {
    const user = await verifyAuth(request);

    if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    // Determine the time grouping requested by the client (e.g. ?range=month)
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all'; // 'week', 'month', 'year', 'all'

    try {
        await connectDB();

        let dateFilter = {};
        const now = new Date();
        if (range === 'week') {
            const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            dateFilter = { createdAt: { $gte: lastWeek } };
        } else if (range === 'month') {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            dateFilter = { createdAt: { $gte: lastMonth } };
        } else if (range === 'year') {
            const lastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            dateFilter = { createdAt: { $gte: lastYear } };
        }

        // Fetch tickets matching the filter
        const tickets = await Ticket.find(dateFilter).sort({ createdAt: 1 });

        if (tickets.length === 0) {
            return NextResponse.json({ error: 'No tickets found for the selected time range.' }, { status: 404 });
        }

        // --- Data Aggregation for Charts ---

        const statusCounts: Record<string, number> = { Open: 0, 'In Progress': 0, 'Resolved': 0, Closed: 0 };
        const priorityCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        const timeSeriesMap: Record<string, number> = {};

        tickets.forEach((t) => {
            statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
            priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;

            const dateStr = new Date(t.createdAt).toISOString().split('T')[0];
            timeSeriesMap[dateStr] = (timeSeriesMap[dateStr] || 0) + 1;
        });

        // Format for Recharts
        const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
        const priorityData = Object.entries(priorityCounts).map(([name, value]) => ({ name, value }));
        const trendData = Object.entries(timeSeriesMap).map(([date, count]) => ({ date, tickets: count }));

        // --- AI Analysis ---
        const dataSummary = `
        Total Tickets: ${tickets.length}
        Status Breakdown: ${JSON.stringify(statusCounts)}
        Priority Breakdown: ${JSON.stringify(priorityCounts)}
        Daily Creation Frequency: ${JSON.stringify(timeSeriesMap)}
        `;

        const prompt = `
        You are an expert IT Service Management (ITSM) and Incident Management analyst.
        I am providing you with the aggregated data of our ticketing system for the selected time range ('${range}').
        
        Please provide a professional, concise Markdown analysis report of this data.
        
        Focus on:
        1. Executive Summary: What does the ticket volume indicate?
        2. Status Analysis: Are there too many Open vs Resolved tickets? (Backlog health)
        3. Priority Analysis: Are there concerning amounts of High/Critical tickets?
        4. Recommendations: What should the support team focus on next based on this data?
        
        Do NOT write code or JSON. Format your output strictly in Markdown using standard headings (##, ###), bullet points, and paragraphs.
        
        Ticketing Data:
        \`\`\`
        ${dataSummary}
        \`\`\`
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const reportText = response.text || "Failed to generate text analysis.";

        return NextResponse.json({
            data: {
                analysis: reportText,
                charts: {
                    status: statusData,
                    priority: priorityData,
                    trend: trendData
                }
            }
        });

    } catch (error: any) {
        console.error('Error generating AI ticket report:', error);
        return NextResponse.json({ error: error?.message || 'Failed to generate report.' }, { status: 500 });
    }
}
