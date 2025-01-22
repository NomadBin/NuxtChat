<template>
  <div class="messageTools">
    <el-tooltip :content="$t('chat.copy')" placement="top">
      <button @click="copyChat()">
        <my-icon v-if="showCopyCheck" name="iconpark/check-small" class="icon" />
        <my-icon v-else name="iconpark/copy" class="icon" />
      </button>
    </el-tooltip>

    <el-tooltip v-if="props.isShowRefresh" :content="$t('chat.retry')" placement="top">
      <button @click="handleRefreshChat">
        <my-icon name="iconpark/refresh" class="icon" />
      </button>
    </el-tooltip>

    <!-- <el-tooltip content="分享" placement="top">
      <button>
        <my-icon name="iconpark/share-two" class="icon" />
      </button>
    </el-tooltip>
   

    <el-dropdown v-if="props.isShowMore" placement="bottom-end" trigger="click">
      <div>
        <el-tooltip content="更多" placement="top-end">
          <button class="moreBtn">
            <my-icon name="iconpark/more" class="icon" />
          </button>
        </el-tooltip>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in moreOptions"
            :class="{ 'theme-error': item.theme == 'error' }"
            @click="moreOptionsHandler(item)"
          >
            <my-icon name="iconpark/file-collection-one" v-if="item.value == 2" />
            <span class="text">{{ item.content }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown> -->
  </div>
</template>

<script setup lang="ts">
import type { DropdownItem } from '~~/types/chat';

const props = defineProps({
  copyValue: {
    type: String,
    required: true,
  },
  isShowMore: {
    type: Boolean,
    default: true,
  },
  isShowRefresh: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(['refreshChat']);

const { t } = useI18n();

const showCopyCheck = ref(false);

// const moreOptions: DropdownItem[] = [
//   {
//     content: '收藏',
//     value: 2,
//   },
//   // {
//   //   content: '删除',
//   //   value: 3,
//   //   theme: 'error',
//   // },
// ];
function copyChat() {
  console.log('copyChat');
  copyToClipboard(props.copyValue).then((sucess) => {
    if (sucess) {
      showToast({
        type: 'success',
        msg: t('tips.copy_success'),
      });
      showCopyCheck.value = true;
      setTimeout(() => {
        showCopyCheck.value = false;
      }, 2500);
    } else {
      showToast({
        type: 'error',
        msg: t('tips.copy_fail'),
      });
    }
  });
}

function handleRefreshChat() {
  console.log('refreshChat');
  emits('refreshChat');
}

// const moreOptionsHandler = (item: DropdownItem) => {
//   console.log('moreOptionsHandler', item);
// };
</script>

<style lang="scss" scoped>
.messageTools {
  display: flex;
  // width: 100%;
  gap: $s-3;
  button {
    padding: $s-2;
    border-radius: $radius-md;
    &:hover {
      background-color: $color-bg-gray-light;
    }
    .icon {
      font-size: $text-base;
      color: $color-text-2;
    }
  }
}
</style>
