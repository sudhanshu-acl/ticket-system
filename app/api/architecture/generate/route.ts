import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const getDirectoryStructure = (dir: string, baseDir: string = ''): string => {
  let structure = '';
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const relativePath = path.join(baseDir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        structure += `${relativePath}/\n`;
        structure += getDirectoryStructure(fullPath, relativePath);
      } else {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          structure += `${relativePath}\n`;
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  return structure;
};

export async function GET() {
  try {
    // Basic auth check can go here if needed

    // Read local folders
    const appDir = path.join(process.cwd(), 'app');

    const apiStructure = getDirectoryStructure(path.join(appDir, 'api'), 'api');
    const actionsStructure = getDirectoryStructure(path.join(appDir, 'actions'), 'actions');
    const modelsStructure = getDirectoryStructure(path.join(appDir, 'models'), 'models');

    const combinedStructure = `
Folder Structure:
${apiStructure}
${actionsStructure}
${modelsStructure}
    `;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }); // Requires GEMINI_API_KEY in .env

    const prompt = `
You are a system architect. I will provide you with a directory structure of a Next.js application (Backend API routes, Server Actions, and Mongoose Models).

Your job is to generate a JSON representation of a ReactFlow diagram that visualizes this architecture.

Rules:
1. Create a node for each major file/route (e.g., api/ticket/route.ts, actions/tickets/getTicket.ts, models/ticket.ts).
2. Create edges to show logical dependencies (e.g., an action calls an api route, an api route uses a model).
3. The JSON must have the following structure EXACTLY:
{
  "nodes": [
    { "id": "node_id", "data": { "label": "filename.ts\\n(Description)" }, "style": { "background": "#dcfce7", "border": "2px solid #22c55e", "borderRadius": "8px", "padding": "10px", "width": 250 } }
  ],
  "edges": [
    { "id": "edge_id", "source": "source_node_id", "target": "target_node_id", "animated": true, "label": "calls" }
  ]
}
4. DO NOT include \`x\` or \`y\` position coordinates in the nodes. Our layout engine (Dagre) will handle that.
5. Use styling colors based on folder:
   - api/ = background: #dcfce7 (green)
   - actions/ = background: #fef3c7 (yellow)
   - models/ = background: #f3e8ff (purple)
6. Output ONLY valid JSON, no markdown blocks around it.

Here is the structure:
${combinedStructure}
    `;

    // We use a relatively small/fast model for this prototype
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    // Safely parse
    let parsedData = { nodes: [], edges: [] };
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response", text);
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    return NextResponse.json({ data: parsedData });
  } catch (error: any) {
    console.error('Error generating architecture:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
