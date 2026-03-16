import { sendEmail } from "@/app/lib/sendEmail"
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

export async function GET() {
    try {
        // read logs from app.log
        const logsPath = path.join(process.cwd(), 'app.log');
        let logs = "";
        
        if (fs.existsSync(logsPath)) {
            logs = fs.readFileSync(logsPath, 'utf-8');
        } else {
            return Response.json({
                statusCode: 404,
                success: false,
                message: "app.log not found"
            }, { status: 404 });
        }
        
        // Split logs into lines and filter for [warn] or [error]
        const logLines = logs.split('\n');
        const errorAndWarnLogs = logLines.filter(line => 
            line.toLowerCase().includes('[error]') || line.toLowerCase().includes('[warn]')
        );

        let aiAnalysis = "No warnings or errors found in logs.";

        if (errorAndWarnLogs.length > 0) {
            // Join lines (pick the last 100 logs to keep the prompt reasonable)
            const recentLogs = errorAndWarnLogs.slice(-100).join('\n');
            
            const promptStr = `Analyze the following application logs containing [warn] and [error] events. Provide a structured report identifying the potential root causes, severity, and suggested remedies or fixes for them. Keep it clear, concise, and formatted for an email to a system administrator.\n\nLogs:\n${recentLogs}`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: promptStr,
            });
            
            aiAnalysis = response.text || "Failed to generate AI analysis based on logs.";
        } else {
            console.log("No warn/error logs found to analyze.");
            return Response.json({
                statusCode: 200,
                success: true,
                message: "No current issues detected in logs"
            });
        }

        // Send remedies via email to admin
        const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
        const emailSubject = `System Alert: Log Analysis & Suggested Remedies`;
        
        console.log("Email sent successfully", await sendEmail(adminEmail, emailSubject, aiAnalysis));

        return Response.json({
            statusCode: 200,
            success: true,
            message: "Autoheal log analysis completed",
            data: {
                aiAnalysis,
                logsAnalyzed: errorAndWarnLogs.length
            }
        });
    } catch (error: any) {
        console.error("Remedies API Error:", error);
        return Response.json({
            statusCode: 500,
            success: false,
            message: error.message || "Failed to process logs",
        }, { status: 500 });
    }
}
