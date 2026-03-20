import { NextRequest, NextResponse } from 'next/server';
import { generateResponse, AIProvider, AgentContext, ThreadContext } from '@/lib/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { apiKey, agent, thread } = body as {
      apiKey: string;
      agent: AgentContext;
      thread: ThreadContext;
    };

    if (!apiKey || !agent || !thread) {
      return NextResponse.json(
        { error: 'Missing required fields: apiKey, agent, thread' },
        { status: 400 }
      );
    }

    if (!['claude', 'gemini', 'openai'].includes(agent.provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be claude, gemini, or openai' },
        { status: 400 }
      );
    }

    const response = await generateResponse(
      agent.provider as AIProvider,
      apiKey,
      agent,
      thread
    );

    return NextResponse.json({ response });
  } catch (error: unknown) {
    console.error('Error generating response:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate response: ${message}` },
      { status: 500 }
    );
  }
}
