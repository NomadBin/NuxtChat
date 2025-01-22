import type { ModelInfo } from '~/config/llm-models';

export type ChatMessage = RequestMessage & {
  id: string;
  date: string;
  modeId: string;
  isError?: boolean;
  _isLastChat?: boolean;
};

export type I18nT = (key: string) => string;

export interface FilterModelMessages {
  messages: ChatMessage[];
  modelId: string;
  session: ChatSession;
  t: I18nT;
}

export type MessageRole = 'system' | 'user' | 'assistant';

export interface RequestMessage {
  role: MessageRole;
  // string | MultimodalContent[];
  content: string;
}

// export interface MultimodalContent {
//   type: 'text' | 'image_url';
//   text?: string;
//   image_url?: {
//     url: string;
//   };
// }

export interface FetchChatOptions {
  messages: RequestMessage[];
  modelId: string;
  botMsgId: string;
  onMessage: (message: string) => void;

  onFinish: (params: { err?: string }) => void;
}

export interface ChatItem {
  id: string;
  query: string;
  date: string;
  answers: ChatMessage[];
}

export interface MemoryObjItem {
  memory: string; // 总结的长期记忆文本
  lastSummarizeIndex: number; // 最后总结的下标
}

export interface ChatSession {
  id: string;
  topic: string;
  // memoryPrompt: string; // 总结的长期记忆文本
  modelIds: string[];
  chats: ChatItem[];
  date: string;
  // lastSummarizeIndex: number; // 最后总结的下标
  memoryObj: Record<string, MemoryObjItem>;
}

export interface DropdownItem {
  content: string;
  value: string | number;
  theme?: 'error';
  prefixIcon?: any;
}

export interface CreateSessionParams {
  topic: string;
  modelIds: string[];
}

export interface CreateUserMessageParams {
  query: string;
}

export interface CreateBotMessageParams {
  role: MessageRole;
  modleId: string;
  content: string;
}

export interface SendChatParams {
  value: string;
}

export enum ModleBrands {
  deepseek = 'deepseek',
  minimax = 'minimax',
  kimi = 'kimi',
  stepfun = 'stepfun',
  chatglm = 'chatglm',
  zeroone = 'zeroone',
  ollama = 'ollama',
  qwen = 'qwen',
  hunyuan = 'hunyuan',
  openai = 'openai',
  doubao = 'doubao',
  // claude = 'claude',
}

export type UiBrandAvatarName = keyof typeof ModleBrands;
