<template>
  <div class="pageBox">
    <div class="topTitle">{{ t('setpage.title') }}</div>

    <div class="settingBox">
      <div class="leftBar">
        <div
          class="item"
          @click="clickLeftBar(item, index)"
          :class="{ active: index == activeBarIndex }"
          v-for="(item, index) in settingBars"
        >
          <my-icon class="icon" :name="item.icon"></my-icon>
          <span class="name">{{ item.name }}</span>
        </div>
      </div>
      <div class="settingList">
        <div class="item" v-for="item in settingBars[activeBarIndex]?.settings">
          <span class="preText" v-if="item.preText">{{ item.preText }}</span>
          <div class="rightBox">
            <template v-if="item.type == 'themeSelect'">
              <el-select
                v-model="settingStore.theme"
                :style="{ width: '130px' }"
                placement="bottom"
                @change="handleSelectChange($event, item)"
              >
                <el-option v-for="citem of item.selectOptions" :value="citem.value" :label="citem.label" />
              </el-select>
            </template>
            <template v-if="item.type == 'langSelect'">
              <el-select
                :style="{ width: '130px' }"
                placement="bottom"
                v-model="chatStore.localeCode"
                @change="switchLocale($event)"
              >
                <el-option v-for="locale of locales" :value="locale.code" :label="locale.name" />
              </el-select>
            </template>
            <template v-if="item.type == 'modelConfig'">
              <el-collapse class="collapse">
                <el-collapse-item v-for="item in modelConfigs">
                  <template #title>
                    <div class="collapseTitle">
                      <UiBrandAvatar :name="item.brand" />
                      <span>{{ item.brand }}</span>
                    </div>
                  </template>
                  <el-form class="collapseList">
                    <el-form-item :label="t('setpage.tip.api_key')" v-if="item.brand != 'ollama'">
                      <el-input
                        :placeholder="t('setpage.tip.api_key_place')"
                        v-model="chatStore.accessConfig[item.brand].apiKey"
                        show-password
                        autocomplete="new-password"
                      />
                    </el-form-item>
                    <el-form-item :label="t('setpage.tip.api_url')">
                      <el-input :placeholder="item.baseUrl" v-model="chatStore.accessConfig[item.brand].baseUrl" />
                    </el-form-item>
                    <el-form-item :label="t('setpage.tip.api_models')">
                      <el-select
                        :placeholder="t('setpage.tip.api_models_place')"
                        v-model="chatStore.accessConfig[item.brand].myModles"
                        filterable
                        multiple
                      >
                        <el-option v-for="citem in item.chatModels" :label="citem.displayName" :value="citem.id" />
                      </el-select>
                    </el-form-item>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UiBrandAvatar } from '#components';
import { modelConfigs } from '~/config/llm-models';

interface SettingItem {
  preText?: string;
  type: 'themeSelect' | 'modelConfig' | 'langSelect';
  selectOptions?: SelectItem[];
}

interface SelectItem {
  value: string | number;
  label: string;
  other?: any;
}

interface SettingBar {
  name: string;
  tabId: string;
  icon: string;
  settings: SettingItem[];
}

const { t, locales, setLocale } = useI18n();

const settingBars = reactive<SettingBar[]>([
  {
    name: t('setpage.common_setting'),
    tabId: 'common_setting',
    icon: 'iconpark/setting-one',
    settings: [
      {
        preText: t('setpage.theme'),

        type: 'themeSelect',
        selectOptions: [
          {
            label: t('setpage.day_mode'),
            value: 'day',
          },
          {
            label: t('setpage.dark_mode'),
            value: 'dark',
          },
        ],
      },
      {
        type: 'langSelect',
        preText: t('setpage.lang'),
      },
    ],
  },
  {
    name: t('setpage.lang_model'),
    tabId: 'lang_model',
    icon: 'iconpark/brain',
    settings: [
      {
        preText: '',
        // key: 'modelConfig',
        type: 'modelConfig',
      },
    ],
  },
]);

const activeBarIndex = ref(0);

const chatStore = useChatStore();
const route = useRoute();
const router = useRouter();
const settingStore = useSettingStore();

onBeforeMount(() => {
  const tabId = route.query.tabId;
  if (tabId) {
    const findIndex = settingBars.findIndex((setting) => setting.tabId === tabId);
    if (findIndex !== -1) {
      activeBarIndex.value = findIndex;
    }
  }
});

function handleSelectChange(value: any, item: SettingItem) {
  console.log('run handleSelectChange', value, item);
}

function switchLocale(code: any) {
  console.log('switchLocale', code);
  // 选择语言
  setLocale(code);
  /**
   * 由于有些i18n数据是写在数组里面的没有响应式，所以需要重新加载页面
   */
  location.reload();
}

function clickLeftBar(item: SettingBar, index: number) {
  activeBarIndex.value = index;
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

  .settingBox {
    display: flex;
    height: 80vh;
    border: 1px solid $color-border-gray;
    border-radius: $radius-lg;
    background-color: $color-bg-chat;
    padding: $s-3 0;
    .leftBar {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: $s-4;
      padding: 0 $s-3;
      width: $s-18;
      border-right: 1px solid $color-border-gray;
      user-select: none;
      .item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: $s-3;
        padding: $s-3 0;
        padding-left: $s-3;
        margin-bottom: $s-2;
        cursor: pointer;
        border-radius: $radius-md;
        color: $color-text-1;
        &:hover,
        &.active {
          background-color: $color-bg-hover-gray;
          color: $color-text-0;
        }
        .icon {
          margin-right: $s-2;
        }
      }
    }
    .settingList {
      display: flex;
      flex-direction: column;
      width: 600px;

      user-select: none;
      overflow-y: auto;
      .item {
        // width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $s-4 0;
        margin: 0 $s-6;
        border-bottom: 1px solid $color-border-gray;
        .preText {
          color: $color-text-0;
          font-size: $text-base;
          font-weight: bold;
        }
        .rightBox {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          width: 100%;

          .collapse {
            width: 100%;
            --el-collapse-border-color: transparent;

            .collapseTitle {
              display: flex;
              align-items: center;
              gap: $s-3;
            }
            .collapseList {
              display: flex;
              flex-direction: column;
            }
          }
        }
      }
    }
  }
}
</style>
