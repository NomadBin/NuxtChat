import {
  ModleBrands,
  type ChatMessage,
  type ChatSession,
  type CreateSessionParams,
  type I18nT,
  type RequestMessage,
  type UiBrandAvatarName,
} from '~~/types/chat';
import { createEmptySession } from '~/utils/chat';
import { allLlmModels, getModelBrand, modelConfigs } from '~/config/llm-models';

import configChat from '~/config/config-chat';
import { pa } from 'element-plus/es/locale/index.mjs';

type JumpType = 'create' | ''; // create 通过首页选择模型-进入的模型对话

interface AccessConfig {
  apiKey: string;
  baseUrl: string;
  brand: UiBrandAvatarName;
  myModles: string[];
}
interface ChatStoreType {
  session: ChatSession | null;
  jumpType: JumpType;
  accessConfig: Record<UiBrandAvatarName, AccessConfig>;
  modleTabs: string[]; // 当前勾选的模型
  dirSideExpand: boolean;
  localeCode: string;
}

interface SetSummarizeMemory {
  session: ChatSession;
  modelId: string;
  prop: 'memory' | 'lastSummarizeIndex';
  value: any;
}

interface SummarizeSession {
  session: ChatSession;
  modelId: string;
  t: I18nT;
}

const getDefaultAccessConfig = () => {
  const obj: any = {};
  modelConfigs.map((item) => {
    const setObj: AccessConfig = {
      apiKey: '',
      baseUrl: '',
      brand: item.brand,
      myModles: item.defaultModels,
    };
    obj[item.brand] = setObj;
  });
  console.log('obj', obj);
  return obj;
};

export const useChatStore = defineStore('chatStore', {
  state: (): ChatStoreType => {
    return {
      session: null,
      jumpType: '',
      accessConfig: getDefaultAccessConfig(),
      modleTabs: [],
      dirSideExpand: true,
      localeCode: 'zh-CN',
    };
  },
  actions: {
    setCurSeesion(session: ChatSession) {
      this.session = session;
      return this.session;
    },
    getLastChatIndex() {
      return this.session.chats.length - 1;
    },
    deleteSession(sessionId: string) {
      idb.deleteSession(sessionId);
    },
    async newSession(params: CreateSessionParams) {
      console.log('newSession');
      const session = createEmptySession(params);
      await idb.insertSession(session);
      this.session = session;
      return this.session;
    },
    renameSession(sessionId: string, topic: string) {
      idb.renameSession(sessionId, topic);
    },

    getMemoryPrompt({ session, modelId, t }: SummarizeSession): RequestMessage | undefined {
      if (session.memoryObj[modelId]?.memory) {
        return {
          role: 'system',
          content: t('chat.prompt.history') + session.memoryObj[modelId].memory,
        };
      }
    },

    getSummarizeMemory({ session, modelId, t }: SummarizeSession) {
      const memoryObj = session.memoryObj?.[modelId] || {
        memory: '',
        lastSummarizeIndex: 0,
      };
      return memoryObj;
    },
    setSummarizeMemory(params: SetSummarizeMemory) {
      const memoryObj = params.session.memoryObj?.[params.modelId];
      if (memoryObj) {
        // @ts-ignore
        memoryObj[params.prop] = params.value;

        idb.updateSession(params.session);
      }
    },
    summarizeSession({ session, modelId, t }: SummarizeSession) {
      const { messageList } = useMessageList(session);
      const messages = filterModelMessages({
        messages: messageList.value,
        modelId: modelId,
        session: session,
        t,
      });

      const { lastSummarizeIndex: summarizeIndex } = this.getSummarizeMemory({
        session,
        modelId,
        t,
      });

      let toBeSummarizedMsgs = messages.slice(summarizeIndex);

      const memoryPrompt = this.getMemoryPrompt({
        session,
        modelId,
        t,
      });
      if (memoryPrompt) {
        toBeSummarizedMsgs.unshift(memoryPrompt);
      }

      const messagesCount = messages.length;
      // 待总结的消息数量小于阈值时不总结消息
      if (messagesCount - 1 - summarizeIndex < configChat.shortTermMemoryCount) {
        return;
      }

      let sumMsg = '';
      fetchChat({
        messages: toBeSummarizedMsgs.concat({
          role: 'system',
          content: t('chat.prompt.summarize'),
          // content: 'summarize the conversation to a single sentence',
        }),
        modelId: modelId,
        botMsgId: session.id,
        onMessage: (message) => {
          sumMsg = message;
          this.setSummarizeMemory({
            session: session,
            modelId: modelId,
            prop: 'memory',
            value: sumMsg,
          });

          console.log('summarizeMemory', message);
        },
        onFinish: (params) => {
          if (!params.err) {
            if (sumMsg) {
              this.setSummarizeMemory({
                session: session,
                modelId,
                prop: 'lastSummarizeIndex',
                value: messagesCount,
              });
            }
          }
        },
      });
    },

    setJumpType(jumpType: JumpType) {
      this.jumpType = jumpType;
    },

    getModelConfig(modelId: string, prop: 'baseUrl' | 'apiKey' = 'baseUrl') {
      const brand = getModelBrand(modelId);
      const config = this.accessConfig[brand];

      if (config && config[prop]) {
        return config[prop];
      } else {
        return '';
      }
    },
  },

  persist: {
    key: 'chatStore',
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['accessConfig', 'modleTabs', 'dirSideExpand', 'localeCode'],
  },
});
