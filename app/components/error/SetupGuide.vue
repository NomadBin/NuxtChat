<template>
  <div class="setupGuide">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="Mac" name="Mac">
        <el-steps direction="vertical" :space="80" v-if="props.type == 'ollama'">
          <el-step status="process" v-for="item in ollamaMacList">
            <template #title>
              <div class="setpWrap">
                <UiMarkdown :source="item.md" />
              </div>
            </template>
          </el-step>
        </el-steps>
      </el-tab-pane>
      <el-tab-pane label="Windows" name="Windows">
        <el-steps direction="vertical" :space="80" v-if="props.type == 'ollama'">
          <el-step status="process" v-for="item in ollamaWindwsList">
            <template #title>
              <div class="setpWrap">
                <UiMarkdown :source="item.md" />
              </div>
            </template>
          </el-step>
        </el-steps>
      </el-tab-pane>
      <el-tab-pane label="Linux" name="Linux">
        <el-steps direction="vertical" :space="80" v-if="props.type == 'ollama'">
          <el-step status="process" v-for="item in ollamaLinuxList">
            <template #title>
              <div class="setpWrap">
                <UiMarkdown :source="item.md" />
              </div>
            </template>
          </el-step>
        </el-steps>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import type { UiBrandAvatarName } from '~~/types/chat';

interface Props {
  type: UiBrandAvatarName;
}
const props = withDefaults(defineProps<Props>(), {
  type: 'ollama',
});

const { t } = useI18n();

const activeTabName = ref('Mac');

const ollamaMacList = [
  {
    md: `
### ${t('chat.error.setup_1_1')}
* ${t('chat.error.setup_1_2')}(https://ollama.com/download{:target="_blank"})
`,
  },
  {
    md: `
### ${t('chat.error.setup_2_1')}
* ${t('chat.error.setup_2_2')}
* ${t('chat.error.setup_2_3')}
\`\`\`shell
launchctl setenv OLLAMA_ORIGINS "*"
\`\`\`
* ${t('chat.error.setup_2_4')}
    `,
  },
];

const ollamaWindwsList = [
  {
    md: `
### ${t('chat.error.setup_1_1')}
* ${t('chat.error.setup_1_2')}(https://ollama.com/download{:target="_blank"})
`,
  },
  {
    md: `
### ${t('chat.error.setup_2_1')}
* ${t('chat.error.setup_2_2')}
* ${t('chat.error.setup_2_3_windows')}
* ${t('chat.error.setup_2_4')}
    `,
  },
];

const ollamaLinuxList = [
  {
    md: `
### ${t('chat.error.setup_linux_1_1')}
* ${t('chat.error.setup_linux_1_2')}
\`\`\`shell
curl -fsSL https://ollama.com/install.sh | sh
\`\`\`
`,
  },
  {
    md: `
### ${t('chat.error.setup_linux_2_1')}
* ${t('chat.error.setup_linux_2_2')}
* ${t('chat.error.setup_linux_2_3')}
\`\`\`shell
sudo systemctl edit ollama.service
\`\`\`
* ${t('chat.error.setup_linux_2_4')}
\`\`\`shell
[Service]

Environment="OLLAMA_ORIGINS=*"
\`\`\`
* ${t('chat.error.setup_linux_2_5')}

`,
  },
];
</script>

<style lang="scss" scoped>
.setupGuide {
  width: 100%;
  display: flex;
  flex-direction: column;

  .setpWrap {
    width: 100%;
    font-size: $text-sm;
    :deep(h3) {
      margin-bottom: $s-3;
    }
    :deep(a) {
      text-decoration: none;
      color: $color-primary;
    }
  }
}
</style>
