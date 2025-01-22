<template>
  <div class="configGuide">
    <template v-if="props.type == 'ollama'">
      <UiBrandAvatar :name="props.type" size="large-3" />
      <div class="titleBox">
        <div class="title">{{ t('chat.error.down_ollama_title') }}</div>
        <div class="desc">{{ t('chat.error.down_ollama_desc') }}</div>
      </div>
      <el-input v-model="modelIdVal"></el-input>
      <div class="progressBox">
        <el-progress v-if="isDownloading" class="progress" :percentage="percent" />
      </div>
      <UiButton class="btn" @click="clickOllamaDown" type="primary">
        <span class="text" v-if="!isDownloading">{{ t('chat.error.down') }}</span>
        <span class="text" v-else> {{ formatFileSize(completed, 2) }}/{{ formatFileSize(total, 2) }}</span>
      </UiButton>
    </template>

    <template v-else>
      <UiBrandAvatar :name="props.type" size="large-3" />
      <div class="titleBox">
        <div class="title">{{ t('chat.error.use_api_key').replace('[type]', props.type) }}</div>
        <div class="desc">{{ t('chat.error.use_api_key_desc').replace('[type]', props.type) }}</div>
      </div>
      <el-input
        v-model="chatStore.accessConfig[props.type].apiKey"
        :placeholder="t('chat.error.api_key_place')"
      ></el-input>
      <UiButton class="btn" @click="clickApiKeySure" type="primary">{{ t('chat.error.api_retry') }} </UiButton>
    </template>
  </div>
</template>
<script setup lang="ts">
import Bus from '~/bus';
import type { MditConfigGuideProps } from '~~/types/md-it';

const props = withDefaults(defineProps<MditConfigGuideProps>(), {
  type: 'ollama',
});
const emits = defineEmits(['refreshChat']);

const { t } = useI18n();

const chatStore = useChatStore();

const modelIdVal = ref('');
const completed = ref(0);
const total = ref(0);
const isDownloading = ref(false);

const percent = computed(() => {
  return total.value ? Number(((completed.value / total.value) * 100).toFixed(1)) : 0;
});

modelIdVal.value = props.modelId ?? '';

function clickOllamaDown() {
  console.log('run ollamaPullModel', modelIdVal.value);
  if (isDownloading.value) {
    return;
  }

  const ollama = getOllama(modelIdVal.value);
  isDownloading.value = true;
  ollamaStreamPull({
    modelId: modelIdVal.value,
    ollama: ollama,
    onProgess: (params) => {
      console.log('run ollamaPullModel onProgess', params);
      completed.value = params.completed;
      total.value = params.total;
    },
    onFinish: (params) => {
      console.log('run ollamaPullModel onFinish');

      isDownloading.value = false;
      if (params.err) {
        showToast({
          msg: params.err.message,
          type: 'error',
        });
      } else {
        showToast({
          msg: t('tips.down_scucess'),
          type: 'success',
        });
        Bus.emit('bus-refreshChat', {
          props,
        });
      }
    },
  });
}

function clickApiKeySure() {
  console.log('clickApiKeySure');
  Bus.emit('bus-refreshChat', {
    props,
  });
}
</script>

<style lang="scss" scoped>
.configGuide {
  width: 100%;
  padding: 0 $s-5;
  padding-top: $s-4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $s-5;

  .titleBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $s-4;
    .title {
      font-size: $text-xl;

      color: $color-text-0;
    }
    .desc {
      font-size: $text-sm;
      color: $color-text-1;
    }
  }

  .progressBox {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: $s-4;
    padding: 0 $s-3;
    .progress {
      width: 100%;
      // width: $s-24;
      :deep(.el-progress__text) {
        min-width: auto;
      }
    }
  }

  .btn {
    width: 100%;
  }
}
</style>
