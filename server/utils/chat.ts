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
