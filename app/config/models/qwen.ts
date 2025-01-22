import type { LlmModelConfig } from '../llm-models';

/**
 * https://help.aliyun.com/zh/model-studio/getting-started/models
 */
export const qwenModelConfig: LlmModelConfig = {
  brand: 'qwen',
  chatModels: [
    {
      contextWindowTokens: 131_072,
      description: '通义千问超大规模语言模型，支持中文、英文等不同语言输入。',
      displayName: 'Qwen Turbo',
      enabled: true,
      functionCall: true,
      id: 'qwen-turbo-latest',
      pricing: {
        currency: 'CNY',
        input: 0.3,
        output: 0.6,
      },
    },
    {
      contextWindowTokens: 131_072,
      description: '通义千问超大规模语言模型增强版，支持中文、英文等不同语言输入。',
      displayName: 'Qwen Plus',
      enabled: true,
      functionCall: true,
      id: 'qwen-plus-latest',
      pricing: {
        currency: 'CNY',
        input: 0.8,
        output: 2,
      },
    },
    {
      contextWindowTokens: 32_768,
      description:
        '通义千问千亿级别超大规模语言模型，支持中文、英文等不同语言输入，当前通义千问2.5产品版本背后的API模型。',
      displayName: 'Qwen Max',
      enabled: true,
      functionCall: true,
      id: 'qwen-max-latest',
      pricing: {
        currency: 'CNY',
        input: 20,
        output: 60,
      },
    },
    {
      contextWindowTokens: 1_000_000,
      description: '通义千问超大规模语言模型，支持长文本上下文，以及基于长文档、多文档等多个场景的对话功能。',
      displayName: 'Qwen Long',
      id: 'qwen-long',
      pricing: {
        currency: 'CNY',
        input: 0.5,
        output: 2,
      },
    },
  ],
  defaultModels: ['qwen-turbo-latest'],
  baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
};
