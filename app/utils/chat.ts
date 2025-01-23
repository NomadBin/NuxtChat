import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import { nanoid } from 'nanoid';
import configChat from '~/config/config-chat';
import { getModelBrand, getModelItem } from '~/config/llm-models';
import type {
  ChatItem,
  ChatMessage,
  ChatSession,
  CreateBotMessageParams,
  CreateSessionParams,
  CreateUserMessageParams,
  FetchChatOptions,
  FilterModelMessages,
  I18nT,
  MemoryObjItem,
  MessageRole,
  RequestMessage,
} from '~~/types/chat';

export function fetchChat(options: FetchChatOptions) {
  const brand = getModelBrand(options.modelId);
  if (brand == 'ollama') {
    ollamaStreamChat(options);
  } else {
    const ctrl = new AbortController();
    const chatStore = useChatStore();

    let finished = false;

    const finish = (err?: string) => {
      // 保证onFinish只会调用一次
      if (!finished) {
        finished = true;
        options.onFinish({
          err: err,
        });
      }
    };

    const messageNotConfigApiKey = () => {
      const errorText = getMdcConfigGuideMdText({
        type: brand,
        modelId: options.modelId,
        botMsgId: options.botMsgId,
      });
      options.onMessage(errorText);
      finish('not config apikey');
    };

    const host = chatStore.getModelConfig(options.modelId) || (getModelItem(options.modelId)?.baseUrl as string);
    const apiKey = chatStore.getModelConfig(options.modelId, 'apiKey');

    const settingStore = useSettingStore();
    // 如果是服务端代理模式，则不需要请求之前校验本地的apikey
    if (!settingStore.porxyChat && !apiKey) {
      // throw new Error('not config apikey');
      messageNotConfigApiKey();
      return;
    }

    let allMessage = '';
    /**
     * host + '/chat/completions'
     * /api/chat/completions
     */
    const reqUrl = settingStore.porxyChat ? '/api/chat/completions' : host + '/chat/completions';
    fetchEventSource(reqUrl, {
      openWhenHidden: true, // 修复无限的重复请求, from: https://github.com/Azure/fetch-event-source/issues/79
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        brand: brand,
        stream: true,
        messages: options.messages,
        model: options.modelId,
      }),
      signal: ctrl.signal,
      async onopen(response) {
        console.log('onopen', response);
        if (response.ok) {
          // everything's good
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          // client-side errors are usually non-retriable:
          if (response.statusText == 'not config apikey') {
            messageNotConfigApiKey();
          }

          throw new Error('FatalError');
        } else {
          throw new Error('RetriableError');
        }
      },
      onmessage(msg) {
        // if the server emits an error message, throw an exception
        // so it gets handled by the onerror callback below:
        if (msg.event === 'FatalError') {
          throw new Error(msg.data);
        }
        if (msg.data == '[DONE]') {
          console.log('结束返回对话内容');
          finish();
          return;
        }

        // console.log('onmessage', msg);

        const text = msg.data;

        try {
          const json = JSON.parse(text);
          const choices = json.choices as Array<{
            delta: { content: string };
          }>;
          const delta = choices[0]?.delta?.content;
          if (delta) {
            allMessage += delta;
            options.onMessage(allMessage);
          }

          // options.onMessage(json.content);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      },
      onclose() {
        console.log('onclose');
        finish();
      },
      onerror(err) {
        console.error('EventSource failed:', err);
        throw err;
      },
    });
  }
}

export function createUserMessage(params: CreateUserMessageParams) {
  let msg: ChatItem = {
    id: nanoid(),
    date: getDateString(),
    query: params.query,
    answers: [],
  };
  return msg;
}

export function createBotMessage(params: CreateBotMessageParams): ChatMessage {
  let msg: ChatMessage = {
    id: nanoid(),
    date: getDateString(),
    role: params.role,
    modeId: params.modleId,
    content: params.content,
  };
  return msg;
}

export function createEmptySession(params: CreateSessionParams): ChatSession {
  const getMemoryObj = () => {
    const memoryObj: Record<string, MemoryObjItem> = {};
    params.modelIds.forEach((modelId) => {
      memoryObj[modelId] = {
        memory: '',
        lastSummarizeIndex: 0,
      };
    });
    return memoryObj;
  };

  return {
    id: nanoid(),
    topic: params.topic,
    // memoryPrompt: '',
    modelIds: params.modelIds,
    chats: [],
    memoryObj: getMemoryObj(),
    date: getDateString(),
    // lastSummarizeIndex: 0,
  };
}

export function filterModelMessages(params: FilterModelMessages): RequestMessage[] {
  let myMessages = params.messages
    .filter((item) => !item.isError) // 过滤错误消息
    .filter((item) => item.content && (item.modeId === params.modelId || item.role == 'user')) // 过滤出只属于指定模型的消息或者用户消息
    .map((item) => {
      return {
        role: item.role,
        content: item.content,
      };
    });

  return myMessages;
}

export function getMessagesWithMemory(params: FilterModelMessages, filerMessages: RequestMessage[]) {
  const chatStore = useChatStore();
  const memoryPrompt = chatStore.getMemoryPrompt({
    session: params.session,
    modelId: params.modelId,
    t: params.t,
  });
  const { lastSummarizeIndex } = chatStore.getSummarizeMemory({
    session: params.session,
    modelId: params.modelId,
    t: params.t,
  });
  let messages = filerMessages;

  if (memoryPrompt) {
    // 去除已长期记忆的历史消息
    messages = filerMessages.slice(lastSummarizeIndex);
    // 添加长期记忆消息
    messages.unshift(memoryPrompt);
  } else {
    /**
     * 运行该逻辑可能得情况:
     * 1. 还没有长期记忆
     * 2. 总结消息失败了
     */
    messages = filerMessages.slice(-configChat.shortTermMemoryCount);
  }

  return messages;
}
