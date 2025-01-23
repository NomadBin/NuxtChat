import type { RuntimeConfig } from 'nuxt/schema';
import type { UiBrandAvatarName } from '~~/types/chat';

export function getBaseUrlByBrand(config: RuntimeConfig, brand: UiBrandAvatarName) {
  let url = '';
  switch (brand) {
    case 'deepseek':
      url = config.deepseekUrl;
      break;
    case 'openai':
      url = config.openaiUrl;
      break;
    case 'minimax':
      url = config.minimaxUrl;
      break;
    case 'kimi':
      url = config.kimiUrl;
      break;
    case 'stepfun':
      url = config.stepfunUrl;
      break;
    case 'chatglm':
      url = config.chatglmUrl;
      break;
    case 'zeroone':
      url = config.zerooneUrl;
      break;
    case 'qwen':
      url = config.qwenUrl;
      break;
    case 'hunyuan':
      url = config.hunyuanUrl;
      break;
    case 'ollama':
      url = config.ollamaUrl;
      break;
    case 'doubao':
      url = config.doubaoUrl;
      break;
    default:
      url = config.deepseekUrl;
      break;
  }

  return url;
}
