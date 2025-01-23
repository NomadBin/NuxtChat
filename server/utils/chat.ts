import type { RuntimeConfig } from 'nuxt/schema';
import type { UiBrandAvatarName } from '~~/types/chat';

export function getEnvValueByBrand(config: RuntimeConfig, brand: UiBrandAvatarName, prop: 'url' | 'key' = 'url') {
  let value = '';
  switch (brand) {
    case 'deepseek':
      value = config.deepseek[prop];
      break;
    case 'openai':
      value = config.openai[prop];
      break;
    case 'minimax':
      value = config.minimax[prop];
      break;
    case 'kimi':
      value = config.kimi[prop];
      break;
    case 'stepfun':
      value = config.stepfun[prop];
      break;
    case 'chatglm':
      value = config.chatglm[prop];
      break;
    case 'zeroone':
      value = config.zeroone[prop];
      break;
    case 'qwen':
      value = config.qwen[prop];
      break;
    case 'hunyuan':
      value = config.hunyuan[prop];
      break;
    case 'ollama':
      // @ts-ignore
      value = config.ollama[prop] ?? '';
      break;
    case 'doubao':
      value = config.doubao[prop];
      break;
    default:
      value = config.deepseek[prop];
      break;
  }

  return value;
}
