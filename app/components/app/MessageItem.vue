<template>
  <div class="wrapBox" :class="{ roleUser: item.role == 'user' }" :id="`appMessageItem-${item.id}`">
    <div class="messageBox">
      <div class="wrapMessage">
        <div class="model" v-if="item.role != 'user'">
          <UiBrandAvatar :name="getModelBrand(item.modeId) || 'kimi'"></UiBrandAvatar>
          <span class="modelName">{{ getModelDisplayName(item.modeId) }}</span>
        </div>

        <div class="messageItem">
          <div class="markdownBox" v-if="item.content">
            <Error :error="item.content" v-if="item.isError" />
            <UiMarkdown :source="item.content" v-else></UiMarkdown>
          </div>
          <div class="loadingIcon" v-else>
            <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <circle
                class="spinSvgCircle"
                cx="400"
                cy="400"
                fill="none"
                r="200"
                stroke-width="40"
                stroke="currentColor"
                stroke-dasharray="800 1400"
                stroke-linecap="round"
              />
            </svg>
          </div>

          <div class="msgBottomBar" v-if="item.role != 'user'">
            <AppMessageTools
              :copy-value="item.content"
              :is-show-refresh="item._isLastChat"
              @refresh-chat="handleRefreshChat"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="actionUserBar" v-if="item.role == 'user'">
      <AppMessageTools class="tools" :copy-value="item.content" :is-show-more="false" :is-show-refresh="false" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Bus from '~/bus';
import { getModelBrand, getModelDisplayName } from '~/config/llm-models';
import type { ChatMessage, DropdownItem } from '~~/types/chat';

interface Props {
  item: ChatMessage;
}

const props = withDefaults(defineProps<Props>(), {});

const emits = defineEmits(['refreshChat']);

onMounted(() => {
  Bus.on('bus-refreshChat', (event: any) => {
    console.log('bus-refreshChat', event);
    if (event.props.botMsgId == props.item.id) {
      console.log('run 刷新');
      handleRefreshChat();
    }
  });
});
onUnmounted(() => {
  Bus.off('bus-refreshChat');
});

function handleRefreshChat() {
  emits('refreshChat');
}
</script>

<style lang="scss" scoped>
.wrapBox {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  &:hover {
    .actionUserBar {
      .tools {
        display: flex;
      }
    }
  }

  &.roleUser {
    .messageBox {
      flex-direction: row-reverse;
      padding-top: $s-3;
      padding-bottom: 0;
      .wrapMessage {
        .messageItem {
          background-color: $color-primary;
          color: $color-text-white;
          padding: $s-4 $s-4;
        }
      }
    }
  }

  .messageBox {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-bottom: $s-6;
    .wrapMessage {
      display: flex;
      // flex-direction: row;
      flex-direction: column;
      gap: $s-2;
      .model {
        display: flex;
        align-items: center;
        margin-bottom: $s-1;
        .modelName {
          margin-left: $s-3;
          font-size: $text-base;
          color: $color-text-0;
          border-radius: $radius-md;
          padding: $s-2 $s-2;
          @include transition-ease(background-color, 0.5s);
          &.flash {
            background-color: $color-primary-light;
          }
        }
      }
      .messageItem {
        border-radius: $radius-lg;
        color: $color-text-0;
        font-size: $text-base;
        // max-width: 100%;
        width: 100%;
        padding: $s-5 $s-5;
        background-color: $color-bg-chat;
        display: flex;
        flex-direction: column;

        .loadingIcon {
          width: $s-8;
          color: $color-primary;
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes spin2 {
            0% {
              stroke-dasharray: 1, 800;
              stroke-dashoffset: 0;
            }
            50% {
              stroke-dasharray: 400, 400;
              stroke-dashoffset: -200px;
            }
            100% {
              stroke-dasharray: 800, 1;
              stroke-dashoffset: -800px;
            }
          }

          .spinSvgCircle {
            transform-origin: center;
            animation:
              spin2 1.5s ease-in-out infinite,
              spin 2s linear infinite;
            animation-direction: alternate;
          }
        }

        .msgBottomBar {
          width: 100%;
          padding-top: $s-5;
        }
      }
    }
  }
  .actionUserBar {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    height: $s-9;
    padding-top: $s-2;
    padding-right: $s-10;

    .tools {
      display: none;
      // display: flex;
    }
  }
}
</style>
