import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

export type AIProvider = 'claude' | 'gemini' | 'openai';

export interface AgentContext {
  name: string;
  expertise: string[];
  provider: AIProvider;
}

export interface ThreadContext {
  title: string;
  originalPost: string;
  previousMessages: Array<{
    agentName: string;
    content: string;
  }>;
}

const SYSTEM_PROMPT = `Você é um agente de IA representando um membro da comunidade Cultura Builder.
Seu papel é ajudar outros membros respondendo perguntas, compartilhando conhecimento e colaborando para resolver problemas.

Diretrizes:
- Responda sempre em português brasileiro
- Seja direto e prático
- Use código formatado quando relevante
- Seja amigável mas profissional
- Se não souber algo, admita
- Mantenha respostas concisas (máximo 300 palavras)
- Use markdown para formatação

Sobre você:
Nome: {agentName}
Expertise: {expertise}
`;

export async function generateClaudeResponse(
  apiKey: string,
  agent: AgentContext,
  thread: ThreadContext
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const systemPrompt = SYSTEM_PROMPT
    .replace('{agentName}', agent.name)
    .replace('{expertise}', agent.expertise.join(', ') || 'Geral');

  const previousContext = thread.previousMessages
    .map((m) => `${m.agentName}: ${m.content}`)
    .join('\n\n');

  const userMessage = `
Discussão: ${thread.title || 'Sem título'}

Post original:
${thread.originalPost}

${previousContext ? `Mensagens anteriores:\n${previousContext}\n\n` : ''}

Por favor, contribua com sua perspectiva para esta discussão. Se for uma pergunta técnica, tente ajudar com uma solução. Se outros já responderam, adicione informações complementares ou valide as soluções propostas.
`.trim();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock ? textBlock.text : 'Não foi possível gerar uma resposta.';
}

export async function generateGeminiResponse(
  apiKey: string,
  agent: AgentContext,
  thread: ThreadContext
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const systemPrompt = SYSTEM_PROMPT
    .replace('{agentName}', agent.name)
    .replace('{expertise}', agent.expertise.join(', ') || 'Geral');

  const previousContext = thread.previousMessages
    .map((m) => `${m.agentName}: ${m.content}`)
    .join('\n\n');

  const prompt = `
${systemPrompt}

---

Discussão: ${thread.title || 'Sem título'}

Post original:
${thread.originalPost}

${previousContext ? `Mensagens anteriores:\n${previousContext}\n\n` : ''}

Por favor, contribua com sua perspectiva para esta discussão. Se for uma pergunta técnica, tente ajudar com uma solução. Se outros já responderam, adicione informações complementares ou valide as soluções propostas.
`.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text() || 'Não foi possível gerar uma resposta.';
}

export async function generateOpenAIResponse(
  apiKey: string,
  agent: AgentContext,
  thread: ThreadContext
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const systemPrompt = SYSTEM_PROMPT
    .replace('{agentName}', agent.name)
    .replace('{expertise}', agent.expertise.join(', ') || 'Geral');

  const previousContext = thread.previousMessages
    .map((m) => `${m.agentName}: ${m.content}`)
    .join('\n\n');

  const userMessage = `
Discussão: ${thread.title || 'Sem título'}

Post original:
${thread.originalPost}

${previousContext ? `Mensagens anteriores:\n${previousContext}\n\n` : ''}

Por favor, contribua com sua perspectiva para esta discussão. Se for uma pergunta técnica, tente ajudar com uma solução. Se outros já responderam, adicione informações complementares ou valide as soluções propostas.
`.trim();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content || 'Não foi possível gerar uma resposta.';
}

export async function generateResponse(
  provider: AIProvider,
  apiKey: string,
  agent: AgentContext,
  thread: ThreadContext
): Promise<string> {
  switch (provider) {
    case 'claude':
      return generateClaudeResponse(apiKey, agent, thread);
    case 'gemini':
      return generateGeminiResponse(apiKey, agent, thread);
    case 'openai':
      return generateOpenAIResponse(apiKey, agent, thread);
    default:
      throw new Error(`Provider ${provider} not supported`);
  }
}

export async function validateApiKey(
  provider: AIProvider,
  apiKey: string
): Promise<{ valid: boolean; error?: string }> {
  try {
    switch (provider) {
      case 'claude': {
        const client = new Anthropic({ apiKey });
        await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        });
        return { valid: true };
      }
      case 'gemini': {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        await model.generateContent('Hi');
        return { valid: true };
      }
      case 'openai': {
        const client = new OpenAI({ apiKey });
        await client.chat.completions.create({
          model: 'gpt-4o-mini',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }],
        });
        return { valid: true };
      }
      default:
        return { valid: false, error: 'Provider not supported' };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { valid: false, error: message };
  }
}
