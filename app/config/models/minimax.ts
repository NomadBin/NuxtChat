import type { LlmModelConfig } from '../llm-models';

/**
 * https://platform.minimaxi.com/document/ChatCompletion
 */
export const minimaxModelConfig: LlmModelConfig = {
  brand: 'minimax',
  chatModels: [
    {
      contextWindowTokens: 245_760,
      description: '适用于广泛的自然语言处理任务，包括文本生成、对话系统等。',
      displayName: 'Minimax abab6.5s',
      enabled: true,
      functionCall: true,
      id: 'abab6.5s-chat',
    },
    {
      displayName: 'MiniMax-Text-01',
      id: 'MiniMax-Text-01',
    },
  ],
  defaultModels: ['abab6.5s-chat'],
  baseUrl: 'https://api.minimax.chat/v1',
};
