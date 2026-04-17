// app/api/ai/ticket/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { connectDB } from '@/app/lib/mongodb';
import Ticket from '@/app/models/ticket';
import { verifyAuth } from '@/app/lib/auth';
import { GoogleGenAI } from '@google/genai';
import { ticketGeneratePrompt } from '@/app/lib/prompt';
import { logger } from '@/app/lib/logger';

// Initialize the SDK. It will automatically use process.env.GEMINI_API_KEY
export const ai = new GoogleGenAI({});

export async function POST(request: NextRequest) {
    const user = await verifyAuth(request);
    logger.info('[AI] Ticket generation request', { user });
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const userQuery = body.useQuery || body.userQuery || body.query; // handle typos from client

        if (!userQuery) {
            return NextResponse.json({ error: 'No user query provided in the body as "useQuery" or "userQuery"' }, { status: 400 });
        }

        await connectDB();

        // Format prompt with actual user values
        const promptStr = ticketGeneratePrompt
            .replace('{{USER_QUERY}}', userQuery)
            .replace('{{NAME}}', user.name || 'Unknown User')
            .replace('{{EMAIL}}', user.email || 'unknown@example.com')
            .replace('{{DEPARTMENT}}', user.jobTitle || 'IT');

        // Call Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptStr,
        });
        logger.info('[AI] Ticket generated successfully', { response });

        let reportText = response.text || "{}";

        // Remove markdown formatting if present
        if (reportText.includes('```json')) {
            const match = reportText.match(/```json\n([\s\S]*?)\n```/);
            if (match) reportText = match[1];
        } else if (reportText.includes('```')) {
            const match = reportText.match(/```\n([\s\S]*?)\n```/);
            if (match) reportText = match[1];
        }

        // Parse the JSON object from the AI
        const aiTicketData = JSON.parse(reportText);

        logger.info('[AI] Ticket generated successfully', { aiTicketData });


        // Return generated ticket data for frontend to review
        return NextResponse.json({
            message: 'Ticket generated successful',
            data: {
                title: aiTicketData.title || "Untitled Ticket",
                category: aiTicketData.category || "Other",
                priority: aiTicketData.priority || "medium",
                description: userQuery // keep original prompt as description if none exists
            }
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        logger.error('[AI] Ticket generation failed', { error });
        return NextResponse.json({ error: error.message || 'Failed to generate ticket' }, { status: 500 });
    }
}