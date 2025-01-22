<template>
  <div class="searchInput" :style="{ padding: padding }">
    <my-icon name="iconpark/search" class="searchIcon"></my-icon>
    <input
      class="input"
      :value="props.modelValue"
      @input="handleInput($event)"
      @keydown="handleKeyDown"
      type="text"
      :placeholder="props.placeholder"
    />
    <div class="closeBox" @click="clickClose">
      <my-icon v-if="props.modelValue" name="iconpark/close" :stroke-width="6" class="icon"></my-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  padding: {
    type: String,
    default: '12px',
  },
});

const emit = defineEmits(['update:modelValue', 'search']);

// 搜索防抖
const debounceSearch = debounce(() => {
  emit('search');
}, 400);
const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  if (target) {
    emit('update:modelValue', target.value);
    debounceSearch();
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  // console.log('handleKeyDown', event);
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    console.log('Enter');
  }
};

function clickClose() {
  emit('update:modelValue', '');
  debounceSearch();
}
</script>

<style lang="scss" scoped>
.searchInput {
  width: 100%;
  display: flex;
  align-items: center;
  box-shadow: $shadow-md;
  border-radius: $radius-xl;
  border: 1px solid $color-border-gray;
  // padding: $s-4;
  background-color: $color-bg-chat;
  .searchIcon {
    font-size: $text-sm;
    margin-right: $s-3;
  }
  .input {
    outline: none;
    resize: none;
    width: 100%;
    height: 100%;
    caret-color: $color-primary;
    font-size: $text-base;
    // background-color: $color-bg-chat;
    background-color: transparent;
    &::placeholder {
      font-size: $text-sm;
      color: $color-text-3;
    }
  }
  .closeBox {
    width: $s-6;
    height: $s-6;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .icon {
      font-size: $text-xs;
    }
  }
}
</style>
