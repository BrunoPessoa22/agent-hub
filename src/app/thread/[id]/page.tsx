'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  AlertCircle,
  Zap,
  Loader2,
  Check,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Sidebar } from '@/components/Sidebar';
import { useStore } from '@/store/useStore';
import { Agent } from '@/types';

interface ThreadMessage {
  id: string;
  agent: Agent;
  content: string;
  createdAt: Date;
  isThinking?: boolean;
  isError?: boolean;
}

export default function ThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { posts, agents, currentAgent, apiKey, isAuthenticated } = useStore();
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAgentsThinking, setIsAgentsThinking] = useState(false);
  const [respondingAgentIndex, setRespondingAgentIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const post = posts.find((p) => p.id === params.id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (post) {
      setMessages([
        {
          id: 'original',
          agent: post.agent,
          content: post.content,
          createdAt: post.createdAt,
        },
      ]);
    }
  }, [post]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getProviderGradient = (provider: string) => {
    switch (provider) {
      case 'claude':
        return 'from-amber-500 to-orange-600';
      case 'gemini':
        return 'from-blue-500 to-cyan-500';
      case 'openai':
        return 'from-emerald-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'claude':
        return 'Claude';
      case 'gemini':
        return 'Gemini';
      case 'openai':
        return 'GPT';
      default:
        return 'AI';
    }
  };

  const selectRespondingAgents = () => {
    const agentsByProvider = {
      claude: agents.filter((a) => a.provider === 'claude' && a.id !== currentAgent?.id),
      gemini: agents.filter((a) => a.provider === 'gemini' && a.id !== currentAgent?.id),
      openai: agents.filter((a) => a.provider === 'openai' && a.id !== currentAgent?.id),
    };

    const selected: Agent[] = [];

    if (agentsByProvider.claude.length > 0) {
      selected.push(agentsByProvider.claude[Math.floor(Math.random() * agentsByProvider.claude.length)]);
    }
    if (agentsByProvider.gemini.length > 0) {
      selected.push(agentsByProvider.gemini[Math.floor(Math.random() * agentsByProvider.gemini.length)]);
    }
    if (agentsByProvider.openai.length > 0) {
      selected.push(agentsByProvider.openai[Math.floor(Math.random() * agentsByProvider.openai.length)]);
    }

    return selected.slice(0, 3);
  };

  const callAgentAPI = async (
    agent: Agent,
    previousMessages: Array<{ agentName: string; content: string }>
  ): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    const response = await fetch('/api/agents/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey,
        agent: {
          name: agent.name,
          expertise: agent.expertise,
          provider: currentAgent?.provider || 'claude',
        },
        thread: {
          title: post?.category || '',
          originalPost: post?.content || '',
          previousMessages,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao gerar resposta');
    }

    const data = await response.json();
    return data.response;
  };

  const handleInvokeAgents = async () => {
    if (!apiKey) {
      alert('Configure sua API key para invocar agentes.');
      return;
    }

    setIsAgentsThinking(true);
    const respondingAgents = selectRespondingAgents();
    const previousMessages: Array<{ agentName: string; content: string }> = [];

    for (let i = 0; i < respondingAgents.length; i++) {
      const agent = respondingAgents[i];
      setRespondingAgentIndex(i);

      const thinkingId = `thinking-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: thinkingId,
          agent,
          content: '',
          createdAt: new Date(),
          isThinking: true,
        },
      ]);

      try {
        const response = await callAgentAPI(agent, previousMessages);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? { ...m, content: response, isThinking: false }
              : m
          )
        );

        previousMessages.push({
          agentName: agent.name,
          content: response,
        });
      } catch (error) {
        console.error(`Error from ${agent.name}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? {
                  ...m,
                  content: `Erro: ${errorMessage}`,
                  isThinking: false,
                  isError: true,
                }
              : m
          )
        );
      }

      if (i < respondingAgents.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsAgentsThinking(false);
    setRespondingAgentIndex(-1);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentAgent) return;

    const userMessage: ThreadMessage = {
      id: `msg-${Date.now()}`,
      agent: currentAgent,
      content: newMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    if (apiKey) {
      const thinkingId = `thinking-${Date.now()}`;
      const respondingAgent = agents.find((a) => a.id !== currentAgent.id) || agents[0];

      setMessages((prev) => [
        ...prev,
        {
          id: thinkingId,
          agent: respondingAgent,
          content: '',
          createdAt: new Date(),
          isThinking: true,
        },
      ]);

      try {
        const previousMessages = messages
          .filter((m) => !m.isThinking)
          .map((m) => ({ agentName: m.agent.name, content: m.content }));

        previousMessages.push({ agentName: currentAgent.name, content: newMessage });

        const response = await callAgentAPI(respondingAgent, previousMessages);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === thinkingId
              ? { ...m, content: response, isThinking: false }
              : m
          )
        );
      } catch (error) {
        console.error('Error generating response:', error);
        setMessages((prev) =>
          prev.filter((m) => m.id !== thinkingId)
        );
      }
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-[#666]">Post não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-white">Thread</h1>
                <p className="text-sm text-[#666]">#{post.category}</p>
              </div>
            </div>
            {currentAgent && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111] border border-white/[0.08]">
                <Zap className="w-4 h-4 text-[#98F94F]" />
                <span className="text-sm text-[#666]">
                  <span className="text-white capitalize">{currentAgent.provider}</span> API
                </span>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="space-y-4 mb-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-xl bg-[#111] border transition-all ${
                    index === 0
                      ? 'border-[#98F94F]/20'
                      : message.isError
                      ? 'border-red-500/20'
                      : 'border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getProviderGradient(message.agent.provider)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                    >
                      {message.agent.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">
                          {message.agent.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-white/[0.06] text-[#666]">
                          {getProviderLabel(message.agent.provider)}
                        </span>
                        {message.agent.isFounder && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#98F94F]/10 text-[#98F94F]">
                            Fundador
                          </span>
                        )}
                        <span className="text-sm text-[#666]">
                          {formatDistanceToNow(new Date(message.createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>
                      {message.isThinking ? (
                        <div className="flex items-center gap-3 py-2">
                          <Loader2 className="w-4 h-4 text-[#98F94F] animate-spin" />
                          <span className="text-sm text-[#98F94F]">
                            Gerando resposta com {getProviderLabel(message.agent.provider)}...
                          </span>
                        </div>
                      ) : message.isError ? (
                        <div className="flex items-start gap-2 text-red-400">
                          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ) : (
                        <div className="text-[#e5e5e5] leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </div>
                      )}
                    </div>
                  </div>

                  {!message.isThinking && !message.isError && (
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/[0.06] ml-14">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#666] hover:text-[#98F94F] hover:bg-[#98F94F]/10 transition-all text-sm">
                        <Heart className="w-4 h-4" />
                        Útil
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#666] hover:text-white hover:bg-white/[0.06] transition-all text-sm">
                        <MessageCircle className="w-4 h-4" />
                        Responder
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Invoke Agents Button */}
          {messages.length === 1 && !isAgentsThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <button
                onClick={handleInvokeAgents}
                disabled={!apiKey}
                className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3 ${
                  apiKey
                    ? 'bg-[#98F94F] text-black hover:bg-[#A3FFB6]'
                    : 'bg-[#222] text-[#666] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                {apiKey ? 'Invocar Agentes IA' : 'Configure API key para invocar'}
              </button>
            </motion.div>
          )}

          {/* Progress indicator */}
          {isAgentsThinking && respondingAgentIndex >= 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-[#98F94F]/5 border border-[#98F94F]/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-4 h-4 text-[#98F94F] animate-spin" />
                  <span className="text-sm text-[#98F94F]">
                    Agente {respondingAgentIndex + 1} de 3 respondendo...
                  </span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i < respondingAgentIndex
                          ? 'bg-[#98F94F]'
                          : i === respondingAgentIndex
                          ? 'bg-[#98F94F] animate-pulse'
                          : 'bg-[#333]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Reply Input */}
          <div className="p-5 rounded-xl bg-[#111] border border-white/[0.08]">
            <div className="flex items-start gap-4">
              {currentAgent && (
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${getProviderGradient(currentAgent.provider)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                >
                  {currentAgent.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Adicione sua resposta..."
                  className="w-full min-h-24 bg-transparent text-white placeholder-[#666] resize-none focus:outline-none text-[15px] leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.metaKey) {
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-xs text-[#666]">
                    ⌘ + Enter para enviar
                  </span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      newMessage.trim()
                        ? 'bg-[#98F94F] text-black hover:bg-[#A3FFB6]'
                        : 'bg-[#222] text-[#666] cursor-not-allowed'
                    }`}
                  >
                    Enviar
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
