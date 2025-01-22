import type { LlmModelConfig } from '../llm-models';

/**
 * https://platform.stepfun.com/docs/llm/text
 */
export const stepfunModelConfig: LlmModelConfig = {
  brand: 'stepfun',
  chatModels: [
    {
      contextWindowTokens: 8000,
      description: '高速模型，适合实时对话。',
      displayName: 'Step 1 Flash',
      enabled: true,
      functionCall: true,
      id: 'step-1-flash',
      pricing: {
        currency: 'CNY',
        input: 1,
        output: 4,
      },
    },
    {
      contextWindowTokens: 8000,
      description: '小型模型，适合轻量级任务。',
      displayName: 'Step 1 8K',
      enabled: true,
      functionCall: true,
      id: 'step-1-8k',
      pricing: {
        currency: 'CNY',
        input: 5,
        output: 20,
      },
    },
    {
      contextWindowTokens: 32_000,
      description: '支持中等长度的对话，适用于多种应用场景。',
      displayName: 'Step 1 32K',
      enabled: true,
      functionCall: true,
      id: 'step-1-32k',
      pricing: {
        currency: 'CNY',
        input: 15,
        output: 70,
      },
    },
    {
      contextWindowTokens: 128_000,
      description: '平衡性能与成本，适合一般场景。',
      displayName: 'Step 1 128K',
      enabled: true,
      functionCall: true,
      id: 'step-1-128k',
      pricing: {
        currency: 'CNY',
        input: 40,
        output: 200,
      },
    },
    {
      contextWindowTokens: 256_000,
      description: '具备超长上下文处理能力，尤其适合长文档分析。',
      displayName: 'Step 1 256K',
      functionCall: true,
      id: 'step-1-256k',
      pricing: {
        currency: 'CNY',
        input: 95,
        output: 300,
      },
    },
    {
      contextWindowTokens: 16_000,
      description: '支持大规模上下文交互，适合复杂对话场景。',
      displayName: 'Step 2 16K',
      enabled: true,
      functionCall: true,
      id: 'step-2-16k',
      pricing: {
        currency: 'CNY',
        input: 38,
        output: 120,
      },
    },
  ],
  defaultModels: ['step-1-flash'],
  baseUrl: 'https://api.stepfun.com/v1',
};
