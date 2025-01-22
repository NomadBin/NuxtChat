<template>
  <div class="pageBox">
    <div class="askWrapBox">
      <div class="topBox">
        <div class="tip">{{ t('tips.has_select') }}:{{ selectModleIds?.length }}</div>
        <!-- <div class="searchBtn" @click="showSearchInput = !showSearchInput">
          <my-icon :name="showSearchInput ? 'iconpark/collapse-text-input' : 'iconpark/search'"></my-icon>
        </div> -->
        <div class="searchWrap" v-if="showSearchInput">
          <UiSearchInput v-model="filterModelVal" :placeholder="t('tips.filter_model')" padding="6px 12px" />
        </div>
      </div>
      <div class="modelTabs" v-if="filterModelTabList?.length">
        <div
          class="item"
          :class="{ active: item.isSelected }"
          v-for="item in filterModelTabList"
          @click="clickEngineTab(item)"
        >
          <UiBrandAvatar :name="item.brand"></UiBrandAvatar>
          <span class="name">{{ item.model.displayName }}</span>
          <span class="iconBox">
            <my-icon class="checkIcon" name="iconpark/check-small" :strokeWidth="8" v-if="item.isSelected"></my-icon>
            <!-- <my-icon class="dragIcon" name="iconpark/hamburger-button" v-else></my-icon> -->
          </span>
        </div>

        <div class="moreItem" @click="gotoSettingModel">
          <my-icon class="icon" name="iconpark/plus"></my-icon>
          <span class="text">{{ t('tips.add_more') }}</span>
        </div>
      </div>
      <div class="emptyBox" v-else>
        <el-empty :description="t('tips.nont_find_ai_model')">
          <UiButton type="primary" @click="gotoSettingModel">{{ t('tips.go_to_setting') }}</UiButton>
        </el-empty>
      </div>
      <UiChatInput v-model="chatText" @send-chat="handleSendChat" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { allLlmModels, type ModelInfo } from '~/config/llm-models';
import type { SendChatParams, UiBrandAvatarName } from '~~/types/chat';

definePageMeta({
  middleware: ['auth'],
});

interface EngineTabItem {
  brand: UiBrandAvatarName;
  model: ModelInfo;
  isSelected: boolean;
}

const chatText = ref('');
const showSearchInput = ref(true);
const filterModelVal = ref('');

// const searchObj = reactive({
//   isShow: false,
//   filterVal: '',
// });

const { t } = useI18n();
const chatStore = useChatStore();

const modelTabList = ref<EngineTabItem[]>();

watch(
  chatStore.accessConfig,
  () => {
    modelTabList.value = allLlmModels
      .filter((item) => {
        if (chatStore.accessConfig[item.brand] && chatStore.accessConfig[item.brand].myModles.includes(item.model.id)) {
          return true;
        }
        return false;
      })
      .map((item) => ({
        brand: item.brand,
        model: item.model,
        isSelected: chatStore.modleTabs.includes(item.model.id),
      }));
  },
  { immediate: true },
);

const filterModelTabList = computed(() => {
  return modelTabList.value?.filter((item) => {
    if (filterModelVal.value) {
      if (item.model.displayName.toLocaleLowerCase().includes(filterModelVal.value.toLocaleLowerCase())) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
});

const selectModleIds = computed(() => {
  return modelTabList.value?.filter((item) => item.isSelected).map((item) => item.model.id);
});

const clickEngineTab = (item: EngineTabItem) => {
  item.isSelected = !item.isSelected;
};
const handleSendChat = async (params: SendChatParams) => {
  console.log('run handleSendChat', params);

  if (selectModleIds.value?.length === 0) {
    showToast({
      msg: t('tips.select_model'),
    });
    return;
  }

  const session = await chatStore.newSession({
    topic: chatText.value,
    // models: models,
    modelIds: selectModleIds.value ?? [],
  });

  chatStore.setJumpType('create');
  navigateTo({
    path: `/chat/${session.id}`,
  });
  chatText.value = '';

  chatStore.modleTabs = session.modelIds;
};

function gotoSettingModel() {
  navigateTo({
    path: '/settings',
    query: {
      tabId: 'lang_model',
    },
  });
}
</script>

<style lang="scss" scoped>
.pageBox {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: $s-10;
  overflow-y: auto;
  padding-bottom: $s-10;

  .askWrapBox {
    display: flex;
    flex-direction: column;
    max-width: 900px;
    width: 100%;
    padding: 0 $s-4;

    .topBox {
      width: 100%;
      display: flex;
      align-items: center;
      // justify-content: center;
      padding-bottom: $s-5;
      border-bottom: 1px solid $color-border-gray;
      .tip {
        flex-shrink: 0;
        color: $color-text-1;
        font-size: $text-sm;
        padding-left: $s-5;
        min-width: $s-14;
      }
      .searchBtn {
        padding: $s-3 $s-3;
        border-radius: $radius-md;
        cursor: pointer;
        &:hover {
          background-color: $color-bg-hover-gray;
        }
      }
      .searchWrap {
        margin-left: $s-3;
        width: $s-21;
        @include transition-ease(width, 0.8);
      }
    }

    .modelTabs {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start; // 会让多行元素在交叉轴（垂直轴，假设是垂直方向的 flex 布局）的起始位置开始排列，减少元素之间的多余间隔
      gap: $s-5;
      margin-bottom: $s-5;
      user-select: none;
      padding: $s-4 $s-2;
      width: 100%;

      .item {
        padding: 0 $s-4;
        display: flex;
        align-items: center;
        height: $s-9;
        background: $color-bg-primary-light;
        border-radius: $radius-full;
        box-shadow: $shadow-md;
        display: flex;
        align-items: center;
        gap: $s-2;
        font-size: $text-base;
        cursor: pointer;

        &.active {
          background: $color-primary;
          // color: $color-text-white;
          .iconBox {
            .checkIcon {
              // color: $color-text-white;
            }
          }
        }

        .name {
        }
        .iconBox {
          width: $s-5;
          height: $s-5;
          .checkIcon {
            color: $color-text-0;
          }

          .dragIcon {
            color: $color-text-3;
          }
        }
      }

      .moreItem {
        padding: 0 $s-4;
        display: flex;
        align-items: center;
        height: $s-9;
        border: 1px dashed $color-text-3;
        border-radius: $radius-full;
        color: $color-text-2;
        cursor: pointer;
        .icon {
          font-size: $text-base;
        }
        .text {
          font-size: $text-sm;
        }
      }
    }
  }
}
</style>
