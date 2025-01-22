<template>
  <div class="pageBox">
    <div class="topTitle">{{ t('history_page.title') }}</div>
    <div class="searchBox">
      <UiSearchInput v-model="searchVal" :placeholder="t('history_page.search_placeholder')" @search="handleSearch" />
    </div>

    <el-empty v-if="messageCount == 0" :description="t('common.empty_result')" />
    <div v-else class="searchList">
      <div class="gruop" v-for="item in messageGroups">
        <template v-if="item.list.length">
          <span class="title">{{ item.title }}</span>
          <div class="item" v-for="citem in item.list" @click="gotoChat(citem)">
            <div class="topBox">
              <div class="left">
                <div class="leftText" v-html="citem._matchTitle"></div>
              </div>
              <div class="right">
                <div class="time">{{ citem.date }}</div>
                <div class="operateList">
                  <my-icon class="icon" name="iconpark/pencil" @click.stop="clickOperate('rename', citem)"></my-icon>
                  <my-icon
                    class="icon delete"
                    name="iconpark/delete"
                    @click.stop="clickOperate('delete', citem)"
                  ></my-icon>
                </div>
              </div>
            </div>
            <div class="matchMsg" v-if="citem._matchMessage" v-html="citem._matchMessage"></div>
          </div>
        </template>
      </div>
    </div>

    <el-dialog v-model="renameDialog.visible" :title="t('history_page.dialog_modify_title')">
      <el-input
        maxlength="50"
        v-model="renameDialog.topic"
        :placeholder="t('history_page.dialog_placeholder')"
      ></el-input>
      <template #footer>
        <div class="dialog-footer">
          <UiButton @click="renameDialog.visible = false">{{ t('common.cancel') }}</UiButton>
          <UiButton type="primary" @click="clickSureName">{{ t('common.sure') }}</UiButton>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getModelDisplayName } from '~/config/llm-models';
import type { ChatSession } from '~~/types/chat';

interface WrapChatSession extends ChatSession {
  _matchMessage: string; // 搜索时匹配到的消息
  _matchTitle: string;
}

interface GroupItem {
  title: string;
  list: WrapChatSession[];
}

const { t } = useI18n();

const searchVal = ref('');

const renameDialog = reactive({
  visible: false,
  topic: '',
  id: '',
});

const chatStore = useChatStore();
// 按照今天,本周,本月,超过30天进行分组
const messageGroups = reactive<Record<string, GroupItem>>({
  today: {
    title: t('history_page.group.today'),
    list: [],
  },
  thisWeek: {
    title: t('history_page.group.thisWeek'),
    list: [],
  },
  thisMonth: {
    title: t('history_page.group.thisMonth'),
    list: [],
  },
  olderThan30Days: {
    title: t('history_page.group.olderThan30Days'),
    list: [],
  },
});
const messageCount = ref(0);

const now = new Date();
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const startOfWeek = new Date(startOfDay);
startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// watch(
//   chatStore.sessions,
//   () => {
//     filterGroupMsg();
//   },
//   {
//     immediate: true,
//   },
// );

onBeforeMount(() => {
  filterGroupMsg();
});

async function filterGroupMsg() {
  const todayList: WrapChatSession[] = [];
  const thisWeekList: WrapChatSession[] = [];
  const thisMonthList: WrapChatSession[] = [];
  const olderThan30DaysList: WrapChatSession[] = [];

  // const filteredSessions = chatStore.sessions
  //   .map((session) => {
  //     return {
  //       ...session,
  //       _matchMessage: '',
  //       _matchTitle: session.topic,
  //     };
  //   })
  //   .filter((session) => {
  //     const lowerSearchVal = searchVal.value.toLowerCase();
  //     const searchRegex = new RegExp(`(${searchVal.value})`, 'gi');

  //     // 匹配标题
  //     if (session.topic.match(searchRegex)) {
  //       if (searchVal.value) {
  //         session._matchTitle = session.topic.replace(searchRegex, '<em>$1</em>');
  //       }
  //       return true;
  //     }

  //     // 匹配用户查询问题
  //     if (
  //       session.chats.some((chat, index) => {
  //         const matches = chat.query.match(searchRegex);
  //         if (matches) {
  //           console.log('matches query', matches);
  //           if (searchVal.value) {
  //             session._matchMessage = chat.query.replace(searchRegex, '<em>$1</em>');
  //           }
  //         }
  //         return matches;
  //       })
  //     ) {
  //       return true;
  //     }

  //     // 匹配模型回答
  //     let isMatchAnswer = false;
  //     for (const chat of session.chats) {
  //       if (
  //         chat.answers.some((answer) => {
  //           const matches = answer.content.match(searchRegex);
  //           if (matches) {
  //             console.log('matches answers', matches);
  //             if (searchVal.value) {
  //               let result = answer.content;
  //               let realResult = `${getModelDisplayName(answer.modeId)}:`;
  //               const keepWordNum = 8;
  //               matches.forEach((match) => {
  //                 // 截断匹配到的关键词
  //                 const index = result.indexOf(match);
  //                 const start = Math.max(0, index - keepWordNum);
  //                 const end = Math.min(result.length, index + match.length + keepWordNum);
  //                 let snippet = result.substring(start, end);
  //                 console.log('snippet', snippet);
  //                 snippet = snippet.replace(searchRegex, '<em>$1</em>');
  //                 realResult += snippet;
  //               });
  //               session._matchMessage = realResult;
  //             }
  //           }
  //           return matches;
  //         })
  //       ) {
  //         isMatchAnswer = true;
  //         break;
  //       }
  //     }
  //     if (isMatchAnswer) {
  //       return true;
  //     }

  //     return false;
  //   });

  const filteredSessions = await idb.getSessionList(searchVal.value);
  let count = 0;

  filteredSessions.map((session) => {
    const sessionDate = stringToDate(session.date);
    count++;
    if (sessionDate >= startOfDay) {
      todayList.push(session);
    } else if (sessionDate >= startOfWeek) {
      thisWeekList.push(session);
    } else if (sessionDate >= startOfMonth) {
      thisMonthList.push(session);
    } else {
      olderThan30DaysList.push(session);
    }
  });

  messageCount.value = count;

  messageGroups.today.list = todayList;

  messageGroups.thisWeek.list = thisWeekList;

  messageGroups.thisMonth.list = thisMonthList;

  messageGroups.olderThan30Days.list = olderThan30DaysList;

  // console.log('messageGroups', JSON.stringify(messageGroups));
}

function clickOperate(type: string, item: WrapChatSession) {
  if (type === 'delete') {
    chatStore.deleteSession(item.id);
  } else if (type === 'rename') {
    renameDialog.topic = item.topic;
    renameDialog.id = item.id;
    renameDialog.visible = true;
  }
}
function gotoChat(item: WrapChatSession) {
  navigateTo({
    path: `/chat/${item.id}`,
    replace: true,
  });
}
function clickSureName() {
  const renameValue = renameDialog.topic.trim();
  if (!renameValue) {
    showToast({ msg: '请输入名称' });
    return;
  }
  chatStore.renameSession(renameDialog.id, renameDialog.topic);
  renameDialog.visible = false;
}

function handleSearch() {
  console.log('handleSearch', searchVal.value);
  filterGroupMsg();
}
</script>

<style lang="scss" scoped>
.pageBox {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: $s-6;

  .topTitle {
    color: $color-text-0;
    font-size: $text-2xl;
    font-weight: bold;
    margin-bottom: $s-5;
  }

  .searchBox {
    max-width: 792px;
    width: 100%;
  }

  .searchList {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    user-select: none;
    overflow-y: auto;

    @include scrollbar();
    .gruop {
      margin-top: $s-6;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 792px;
      .title {
        font-size: $text-2xl;
        font-weight: bold;
        margin-bottom: $s-5;

        display: flex;
        flex-direction: column;
      }

      .item {
        width: 100%;
        background: $color-bg-chat;
        border-radius: $radius-md;
        color: $color-text-0;
        padding: $s-4 $s-5;
        font-size: $text-sm;
        cursor: pointer;
        @include transition-ease(box-shadow);
        margin-bottom: $s-3;

        display: flex;
        flex-direction: column;
        &:hover {
          box-shadow: $shadow-md;
          .topBox {
            .right {
              .time {
                display: none;
              }
              .operateList {
                display: flex;
              }
            }
          }
        }

        :deep(em) {
          font-style: normal; /* 将字体样式设置为正常，从而去掉斜体 */
          color: $color-primary;
        }

        .topBox {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: $s-7;

          .left {
            display: flex;
            flex-direction: column;
            flex: 1;
            font-weight: bold;
            .leftText {
              flex: 1;
              max-width: 500px;
              @include ellipsis-single();
            }
          }

          .right {
            min-width: 200px;
            flex-shrink: 0;
            font-size: $text-sm;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .time {
              font-size: $text-xs;
              color: $color-text-2;
            }
            .operateList {
              // display: flex;
              display: none;
              align-items: center;
              // gap: $s-4;
              .icon {
                cursor: pointer;
                font-size: $text-sm;
                padding: $s-1 $s-3;
                &.delete {
                  color: $color-red;
                }
              }
            }
          }
        }

        .matchMsg {
          margin-top: $s-3;
          color: $color-text-0;
          @include ellipsis-single();
        }
      }
    }
  }
}
</style>
