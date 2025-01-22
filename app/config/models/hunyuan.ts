import type { LlmModelConfig } from '../llm-models';

/**
 * https://cloud.tencent.com/document/product/1729/104753
 */
export const hunyuanModelConfig: LlmModelConfig = {
  brand: 'hunyuan',
  chatModels: [
    {
      contextWindowTokens: 256_000,
      description: '升级为 MOE 结构，上下文窗口为 256k ，在 NLP，代码，数学，行业等多项评测集上领先众多开源模型。',
      displayName: 'Hunyuan Lite',
      enabled: true,
      id: 'hunyuan-lite',
      maxOutput: 6000,
      pricing: {
        currency: 'CNY',
        input: 0,
        output: 0,
      },
    },
    {
      contextWindowTokens: 32_000,
      description:
        '采用更优的路由策略，同时缓解了负载均衡和专家趋同的问题。长文方面，大海捞针指标达到99.9%。MOE-32K 性价比相对更高，在平衡效果、价格的同时，可对实现对长文本输入的处理。',
      displayName: 'Hunyuan Standard',
      enabled: true,
      id: 'hunyuan-standard',
      maxOutput: 2000,
      pricing: {
        currency: 'CNY',
        input: 4.5,
        output: 5,
      },
    },
    {
      contextWindowTokens: 32_000,
      description:
        '混元全新一代大语言模型的预览版，采用全新的混合专家模型（MoE）结构，相比hunyuan-pro推理效率更快，效果表现更强。',
      displayName: 'Hunyuan Turbo',
      enabled: true,
      functionCall: true,
      id: 'hunyuan-turbo',
      maxOutput: 4000,
      pricing: {
        currency: 'CNY',
        input: 15,
        output: 50,
      },
    },
  ],
  defaultModels: ['hunyuan-lite'],
  baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
};
