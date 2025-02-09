import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Task {
    id: string;
    text: string;
  }
  

export async function POST(req: Request) {
  const { tasks } : {tasks: Task[]}= await req.json();
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Prioritize these tasks and suggest actionable steps. 
        Return JSON format: { prioritized: { id: string, priority: number }[], suggestions: string[] }`
      }, {
        role: "user",
        content: `Tasks: ${tasks.map(t => t.text).join(', ')}`
      }]
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');
    return NextResponse.json(result);
  } catch (error) {
        console.error('AI Processing error:', error);
        return NextResponse.json(
            { error: 'AI processing failed' },
            { status: 500 }
    );
  }
}