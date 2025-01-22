<template>
  <div class="chatWrap">
    <div class="inputBox">
      <div class="gridInput">
        <textarea
          id="chatInput"
          ref="chatTextRef"
          :value="props.modelValue"
          @input="handleInput($event)"
          :placeholder="t('tips.input_question')"
          @keydown="handleKeyDown"
        ></textarea>
      </div>
      <div class="toolsBox">
        <button class="sendBtn" :class="{ active: isActiveSendBtn }" @click="sendChat">
          <!-- <arrow-up theme="filled" class="icon" :stroke-width="7" /> -->
          <my-icon name="iconpark/arrow-up" class="icon" :stroke-width="7" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SendChatParams } from '~~/types/chat';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['sendChat', 'update:modelValue']);

const { t } = useI18n();

// const chatText = ref('');

watch(
  () => props.modelValue,
  (newValue) => {
    // console.log('chatText newValue', newValue);
    if (chatTextRef.value) {
      // console.log('', chatTextRef.value.scrollHeight);
      chatTextRef.value.style.height = 'auto'; // 重置高度
      chatTextRef.value.style.height = `${chatTextRef.value.scrollHeight}px`; // 设置新的高度
    }
  },
);

const isActiveSendBtn = computed(() => {
  return props.modelValue.length > 0;
});

const chatTextRef = ref<HTMLElement>();

onMounted(() => {
  chatTextRef.value?.focus();
});

const sendChat = () => {
  console.log('sendChat', props.modelValue);
  const obj: SendChatParams = {
    value: props.modelValue,
  };
  emit('sendChat', obj);
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  if (target) {
    emit('update:modelValue', target.value);
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  // console.log('handleKeyDown', event);
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChat();
  }
};
</script>

<style lang="scss" scoped>
.chatWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .inputBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: $shadow-md;
    border-radius: $radius-xl;
    border: 1px solid $color-border-gray;
    padding: $s-4;
    background-color: $color-bg-chat;
    .gridInput {
      width: 100%;
      textarea {
        outline: none;
        resize: none;
        width: 100%;
        max-height: 180px;
        caret-color: $color-primary;
        font-size: $text-base;
        background-color: $color-bg-chat;
        &::placeholder {
          font-size: $text-base;
          color: $color-text-3;
        }
      }
    }

    .toolsBox {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .sendBtn {
        border-radius: $radius-full;
        width: $s-8;
        height: $s-8;
        background-color: $color-bg-disabled;
        cursor: not-allowed;

        &.active {
          background-color: $color-primary;
          cursor: pointer;
          .icon {
            color: $color-text-white;
          }
        }
        .icon {
          font-size: $text-base;
          font-weight: bold;
          color: $color-text-white;
        }
      }
    }
  }
}
</style>
