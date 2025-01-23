import type { RuntimeConfig } from 'nuxt/schema';
import type { UiBrandAvatarName } from '~~/types/chat';

export function getBaseUrlByBrand(config: RuntimeConfig, brand: UiBrandAvatarName) {
  let url = '';
  switch (brand) {
    case 'deepseek':
      url = config.deepseek.url;
      break;
    case 'openai':
      url = config.openai.url;
      break;
    case 'minimax':
      url = config.minimax.url;
      break;
    case 'kimi':
      url = config.kimi.url;
      break;
    case 'stepfun':
      url = config.stepfun.url;
      break;
    case 'chatglm':
      url = config.chatglm.url;
      break;
    case 'zeroone':
      url = config.zeroone.url;
      break;
    case 'qwen':
      url = config.qwen.url;
      break;
    case 'hunyuan':
      url = config.hunyuan.url;
      break;
    case 'ollama':
      url = config.ollama.url;
      break;
    case 'doubao':
      url = config.doubao.url;
      break;
    default:
      url = config.deepseek.url;
      break;
  }

  return url;
}

export function getApiKeyByBrand(config: RuntimeConfig, brand: UiBrandAvatarName) {
  let key = '';
  switch (brand) {
    case 'deepseek':
      key = config.deepseek.key;
      break;
    case 'openai':
      key = config.openai.key;
      break;
    case 'minimax':
      key = config.minimax.key;
      break;
    case 'kimi':
      key = config.kimi.key;
      break;
    case 'stepfun':
      key = config.stepfun.key;
      break;
    case 'chatglm':
      key = config.chatglm.key;
      break;
    case 'zeroone':
      key = config.zeroone.key;
      break;
    case 'qwen':
      key = config.qwen.key;
      break;
    case 'hunyuan':
      key = config.hunyuan.key;
      break;
    case 'doubao':
      key = config.doubao.key;
      break;
    default:
      key = config.deepseek.key;
      break;
  }

  return key;
}
