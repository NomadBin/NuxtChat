import type { LlmModelConfig } from '../llm-models';

/**
 * https://api-docs.deepseek.com/zh-cn/quick_start/pricing/
 */
export const deepseekModelConfig: LlmModelConfig = {
  brand: 'deepseek',
  chatModels: [
    {
      id: 'deepseek-chat',
      displayName: 'DeepSeek V3',
    },
  ],
  defaultModels: ['deepseek-chat'],
  baseUrl: 'https://api.deepseek.com/v1',
};
