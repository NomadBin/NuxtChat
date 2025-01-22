<template>
  <div class="pageBox">
    <div class="wrapDirBox">
      <div class="dirBox" v-if="chatStore.dirSideExpand">
        <div class="topDir">
          <div class="dirBtn" @click="chatStore.dirSideExpand = !chatStore.dirSideExpand">
            <my-icon class="icon" :name="chatStore.dirSideExpand ? 'other/side-close' : 'other/side-open'"></my-icon>
            <span class="name">{{ t('chat.dir') }}</span>
          </div>
        </div>
        <div class="dirList">
          <template v-for="item in curSession.chats">
            <div class="dt" :class="{ active: item.id == curLocationId }" @click="locationChat(item.id)">
              <div class="text">{{ item.query }}</div>
            </div>
            <div
              class="dd"
              :class="{ active: citem.id == curLocationId }"
              @click="locationChat(citem.id)"
              v-for="citem in item.answers"
            >
              <UiBrandAvatar :name="getModelBrand(citem.modeId) || 'kimi'" size="small" />
              <span class="name">{{ getModelDisplayName(citem.modeId) }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="togglePane" v-if="!chatStore.dirSideExpand">
        <div class="openBtn" @click="chatStore.dirSideExpand = !chatStore.dirSideExpand">
          <my-icon class="icon" :name="chatStore.dirSideExpand ? 'other/side-close' : 'other/side-open'"></my-icon>
        </div>
      </div>
    </div>
    <div class=""></div>
    <div class="wrapPage" v-if="curSession">
      <div class="chatListBox" ref="chatListBoxRef" @scroll="onChatBodyScroll()">
        <div class="chatItem" v-for="(item, index) in messageList" :key="item.id" ref="messageRefs" :data-id="item.id">
          <AppMessageItem :item="item" @refresh-chat="() => handleRefreshChat(item)" />
        </div>
      </div>

      <div class="chatFooter">
        <UiChatInput v-model="chatText" @send-chat="handleSendChat" />
      </div>

      <div class="stbBtn" v-if="showStbBtn" @click="scrollToBottom('smooth')">
        <my-icon name="iconpark/down"></my-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage, ChatSession, FilterModelMessages, SendChatParams } from '~~/types/chat';
import { getModelBrand, getModelDisplayName, type ModelInfo } from '~/config/llm-models';

definePageMeta({
  middleware: [],
});

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const curLocationId = ref('');

const paramsId = route.params.id as string;

const session = await idb.getSessinById(paramsId);
if (!session) {
  router.replace('/');
}

const curSession = chatStore.setCurSeesion(session);

const { messageList } = useMessageList(curSession);

if (chatStore.jumpType === 'create') {
  // 通过首页选择模型-进入的模型对话

  const msg = curSession.topic;
  nextTick(() => {
    chatStore.setJumpType('');
    handleSendChat({
      value: msg,
    });
  });
}

const chatText = ref('');
const showStbBtn = ref(false);
const chatListBoxRef = ref<HTMLElement>();
const messageRefs = ref<HTMLElement[]>([]);
const fetchLock = ref(false);

onBeforeMount(() => {
  console.log('route.params', route.params);
  console.log('route.query', route.query);
  // @ts-ignore
  console.log('route.state', route.state);
  console.log('curSession', curSession);
});

onMounted(() => {
  scrollToBottom('auto');

  onChatBodyScroll(); // 初始化时判断当前激活的消息
});

const handleSendChat = (params: SendChatParams) => {
  console.log('run handleSendChat', params);
  if (!curSession) {
    return;
  }
  if (fetchLock.value) {
    showToast({
      msg: '正在请求中...',
    });
    return;
  }
  createUserChat(params);
  fetchAllModel();
};

const createUserChat = (params: SendChatParams) => {
  const userMsg = createUserMessage({
    query: params.value,
  });
  curSession.chats.push(userMsg);
  idb.updateSession(curSession);
  chatText.value = '';
};

const fetchAllModel = () => {
  fetchLock.value = true;

  const modelIds = curSession.modelIds;

  Promise.all(modelIds.map((modelId) => _fetchModelChat(modelId)))
    .then((results) => {
      // 处理所有 Promise 成功的结果
      console.log('all then');
    })
    .catch((error) => {
      // 处理任何一个 Promise 失败的情况
      console.error('all error', error);
    })
    .finally(() => {
      // 无论成功还是失败，都会执行的代码
      console.log('all finally');
      fetchLock.value = false;
    });
};
const _fetchModelChat = (modelId: string) => {
  return new Promise<void>((resolve, reject) => {
    let botMsg = ref(
      createBotMessage({
        content: '',
        role: 'assistant',
        modleId: modelId,
      }),
    );

    console.log('botMsg', botMsg.value);

    console.log('run _fetchModelChat', modelId);

    const brand = getModelBrand(modelId);
    const botMsgId = botMsg.value.id;

    try {
      const chatIndex = chatStore.getLastChatIndex();
      curSession.chats[chatIndex]!.answers.push(botMsg.value);
      idb.updateSession(curSession);

      nextTick(() => {
        scrollToBottom('auto');
      });

      const filterParams: FilterModelMessages = {
        messages: messageList.value,
        modelId,
        session: curSession,
        t,
      };
      let messages = filterModelMessages(filterParams);
      messages = getMessagesWithMemory(filterParams, messages);
      fetchChat({
        // url: 'http://127.0.0.1:8001/api/llm/stream_chat',
        // url: 'http://127.0.0.1:11434/api/chat',
        messages: messages,
        modelId: modelId,
        botMsgId: botMsgId,
        // brand: brand,

        onFinish(params) {
          // console.log('onFinish');

          if (params.err) {
            botMsg.value.isError = true;
          } else {
            botMsg.value.isError = false;
          }

          idb.updateSession(curSession);

          chatStore.summarizeSession({
            session: curSession,
            modelId,
            t,
          });

          resolve();
        },
        onMessage(message) {
          // console.log('onMessage', message);
          // allMessage += message;

          botMsg.value.content = message; // 直接更新 botMsg 的 content 属性

          idb.updateSession(curSession);

          nextTick(() => {
            onChatBodyScroll();
          });
        },
      });
    } catch (error) {
      console.log('error', error);
      resolve();
    }
  });
};

const scrollToBottom = (behavir: ScrollBehavior = 'smooth') => {
  if (!chatListBoxRef.value) {
    return;
  }
  console.log('scrollToBottom');

  chatListBoxRef.value.scrollTo({
    top: chatListBoxRef.value.scrollHeight,
    behavior: behavir, // 平滑滚动
  });
};

const onChatBodyScroll = () => {
  const scrollDom = chatListBoxRef.value as HTMLElement;

  // 一定的误差数量
  const mistakNum = 20;

  /**
   * scrollHeight 包含所有滚动的整个内容的高度
   * clientHeight: 元素的内部高度，可视区域的高度
   * scrollTop: 元素的内容垂直滚动的距离, 随着滚动而变化的值
   */
  const scrollTop = scrollDom.scrollTop;
  const scrollHeight = scrollDom.scrollHeight;
  const clientHeight = scrollDom.clientHeight;

  const isAtBottom = scrollHeight - clientHeight <= scrollTop + mistakNum;

  // console.log('run onChatBodyScroll', {
  //   scrollTop: scrollDom.scrollTop,
  //   clientHeight: clientHeight,
  //   scrollHeight: scrollHeight,
  // });

  // 判断滑动底部按钮是否显示
  if (isAtBottom) {
    // console.log('已滑动到底部');
    showStbBtn.value = false;
  } else {
    const hasVerticalScrollbar = scrollHeight > clientHeight;
    if (hasVerticalScrollbar) {
      showStbBtn.value = true;
    }
  }

  // 判断滑动时左侧目录的激活项
  for (let i = 0; i < messageRefs.value.length; i++) {
    const messageDom = messageRefs.value[i];
    if (messageDom) {
      const rect = messageDom.getBoundingClientRect();
      // console.log('rect', {
      //   top: rect.top,
      //   bottom: rect.bottom,
      //   clientHeight: clientHeight,
      // });
      if (rect.top >= 0 && rect.bottom <= clientHeight) {
        const locationId = messageDom.dataset.id as string;
        // console.log('找到符合定位元素', locationId);
        curLocationId.value = locationId;
        break;
      }
    }
  }
};

const locationChat = (id: string) => {
  console.log('locationChat', id);
  if (!chatListBoxRef.value) {
    return;
  }
  const messageDom = document.getElementById(`appMessageItem-${id}`);
  if (!messageDom) {
    return;
  }

  const modelNameDom = messageDom.getElementsByClassName('modelName')[0];

  if (modelNameDom) {
    modelNameDom.classList.add('flash');
    setTimeout(() => {
      modelNameDom.classList.remove('flash');
    }, 2000);
  }

  curLocationId.value = id;
  const offsetY = getElementOffsetY(messageDom, chatListBoxRef.value);
  console.log('offsetY', offsetY);

  chatListBoxRef.value.scrollTo({
    top: offsetY - 20,
    behavior: 'auto', // 平滑滚动
  });
};

function handleRefreshChat(item: ChatMessage) {
  console.log('run page refreshChat', item);
  let modelId = item.modeId;
  item.content = '';

  const brand = getModelBrand(modelId);
  nextTick(() => {
    scrollToBottom('auto');
  });

  const filterParams: FilterModelMessages = {
    messages: messageList.value,
    modelId,
    session: curSession,
    t,
  };
  let messages = filterModelMessages(filterParams);
  messages = getMessagesWithMemory(filterParams, messages);

  fetchChat({
    messages: messages,
    modelId: modelId,
    botMsgId: item.id,

    onFinish(params) {
      // console.log('onFinish');
      if (params.err) {
        item.isError = true;
      } else {
        item.isError = false;
      }

      chatStore.summarizeSession({
        session: curSession,
        modelId,
        t,
      });
    },
    onMessage(message) {
      // console.log('onMessage', message);
      item.isError = false;
      item.content = message;

      nextTick(() => {
        onChatBodyScroll();
      });
    },
  });
}
</script>

<style lang="scss" scoped>
.pageBox {
  width: 100%;
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  .wrapDirBox {
    flex-shrink: 0;
    display: flex;

    .dirBox {
      width: $s-20;
      height: 100%;
      margin-top: $s-8;
      padding-left: $s-3;
      display: flex;
      flex-direction: column;
      .topDir {
        display: flex;
        align-items: center;
        user-select: none;
        flex-shrink: 0;
        padding-bottom: $s-2;
        .dirBtn {
          cursor: pointer;
          color: $color-text-0;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: $s-2;
          .icon {
            font-size: $text-base;
          }
        }
      }
      .dirList {
        padding-bottom: $s-10;
        display: flex;
        flex-direction: column;
        flex: 1;
        // height: 80vh;
        overflow-y: auto;
        .dt {
          width: 100%;
          margin-top: $s-5;
          &:first-child {
            margin-top: $s-3;
          }
          &.active {
            .text {
              color: $color-primary-text;
            }
          }

          .text {
            cursor: pointer;
            font-size: $text-sm;
            font-weight: bold;
            color: $color-text-0;
            @include ellipsis-single();
          }
        }
        .dd {
          width: 100%;
          cursor: pointer;
          font-size: $text-xs;
          font-weight: bold;
          color: $color-text-2;
          display: flex;
          align-items: center;
          gap: $s-2;
          margin-top: $s-3;
          margin-left: $s-3;

          &.active {
            color: $color-primary-text;
          }
          .name {
            max-width: $s-15;
            @include ellipsis-single();
          }
        }
      }
    }

    .togglePane {
      // background-color: red;
      width: $s-8;
      height: $s-13;
      padding-top: $s-5;

      &:hover {
        .openBtn {
          display: flex;
        }
      }
      .openBtn {
        cursor: pointer;
        // display: flex;
        display: none;
        align-items: center;
        justify-content: center;
        width: $s-6;
        height: $s-9;
        background-color: $color-bg-gray-light;
        color: $color-text-0;
        border-top-right-radius: $s-3;
        border-bottom-right-radius: $s-3;
        border: 1px solid $color-bg-gray;
        border-left-color: transparent;
        &:hover {
          background-color: $color-bg-gray;
        }
        .icon {
          font-size: $text-sm;
          color: $color-text-2;
        }
      }
    }
  }

  .wrapPage {
    flex: 1;
    padding-top: $s-6;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
    position: relative;

    .chatListBox {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      flex: 1;

      padding-bottom: $s-10;
      .chatItem {
        padding: 0 $s-5;
        width: 100%;
      }
    }

    .chatFooter {
      width: 100%;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 $s-4 $s-3 $s-4;
      max-width: 880px;
    }

    .stbBtn {
      position: absolute;
      z-index: 1000;
      left: 50%;
      transform: translateX(-50%);
      bottom: $s-15;
      border-radius: $radius-full;
      width: $s-9;
      height: $s-9;
      color: $color-primary;
      font-size: $text-2xl;
      background-color: $color-bg-chat;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: $shadow-md;
      cursor: pointer;
      &:hover {
        box-shadow: $shadow-lg;
      }
    }
  }
}
</style>
