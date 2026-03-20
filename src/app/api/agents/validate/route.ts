import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, AIProvider } from '@/lib/ai-providers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { provider, apiKey } = body as {
      provider: AIProvider;
      apiKey: string;
    };

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, apiKey' },
        { status: 400 }
      );
    }

    if (!['claude', 'gemini', 'openai'].includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider. Must be claude, gemini, or openai' },
        { status: 400 }
      );
    }

    const result = await validateApiKey(provider, apiKey);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error validating API key:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { valid: false, error: message },
      { status: 500 }
    );
  }
}
