import type { UiBrandAvatarName } from '~/components/ui/BrandAvatar.vue';

import { kimiModelConfig } from './models/kimi';
import { deepseekModelConfig } from './models/deepseek';
import { ollamaModelConfig } from './models/ollama';
import { minimaxModelConfig } from './models/minimax';
import { chatglmkModelConfig } from './models/chatglm';
import { stepfunModelConfig } from './models/stepfun';
import { qwenModelConfig } from './models/qwen';
import { hunyuanModelConfig } from './models/hunyuan';
import { zerooneModelConfig } from './models/zeroone';
import { openaiModelConfig } from './models/openai';

export interface ModelInfo {
  id: string;
  displayName: string;
  description?: string;
  enabled?: boolean;
  functionCall?: boolean;
  contextWindowTokens?: number;
  vision?: boolean;
  releasedAt?: string;
  maxOutput?: number;
  pricing?: ChatModelPricing;
}

type ModelPriceCurrency = 'CNY' | 'USD';

export interface ChatModelPricing {
  audioInput?: number;
  audioOutput?: number;
  cachedAudioInput?: number;
  cachedInput?: number;
  /**
   * the currency of the pricing
   * @default USD
   */
  currency?: ModelPriceCurrency;
  /**
   * the input pricing, e.g. $1 / 1M tokens
   */
  input?: number;
  /**
   * the output pricing, e.g. $2 / 1M tokens
   */
  output?: number;
  writeCacheInput?: number;
}

export interface LlmModelConfig {
  brand: UiBrandAvatarName;
  baseUrl: string;
  chatModels: ModelInfo[]; // 所有模型
  defaultModels: string[]; //默认使用的模型
}

interface LlmModel {
  model: ModelInfo;
  brand: UiBrandAvatarName;
  baseUrl: string;
}

export const modelConfigs: LlmModelConfig[] = [
  deepseekModelConfig,
  openaiModelConfig,
  minimaxModelConfig,
  kimiModelConfig,
  stepfunModelConfig,
  chatglmkModelConfig,
  zerooneModelConfig,
  qwenModelConfig,
  hunyuanModelConfig,
  ollamaModelConfig,
];

// 所有的可用模型
const getAllLLmModels = () => {
  const llmMoels: LlmModel[] = [];
  modelConfigs.map((config) => {
    const llms = config.chatModels.map((model) => {
      return {
        brand: config.brand,
        model: model,
        baseUrl: config.baseUrl,
      };
    });
    llmMoels.push(...llms);
  });
  return llmMoels;
};

export const allLlmModels: LlmModel[] = getAllLLmModels();

export function getModelBrand(modelId: string) {
  const item = allLlmModels.find((item) => modelId == item.model.id);
  return item?.brand || 'ollama';
}

export function getModelDisplayName(modelId: string) {
  const item = allLlmModels.find((item) => modelId == item.model.id);
  return item?.model.displayName || '';
}

export function getModelItem(modelId: string) {
  const item = allLlmModels.find((item) => modelId == item.model.id);
  return item;
}
