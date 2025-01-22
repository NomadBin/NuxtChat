<template>
  <div class="uiMarkdown">
    <div class="markdown-wrapper" v-html="renderedContent"></div>
  </div>
</template>
<script lang="ts" setup>
import MarkdownIt from 'markdown-it';
import markdownItHighlight from 'markdown-it-highlightjs';

import { preWrapperPlugin, type PreWrapperPluginOptions } from './plugins/preWrapper';
import { targetBlankPlugin } from './plugins/targetBlankPlugin';

interface Props {
  source: string;
}
const props = withDefaults(defineProps<Props>(), {});

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const { t } = useI18n();

const preWrapperOptions: PreWrapperPluginOptions = {
  copyBtnText: t('markdown.copy_code'),
  hasCopyText: t('markdown.has_copied'),
};

md.use(markdownItHighlight, {}).use(preWrapperPlugin, preWrapperOptions).use(targetBlankPlugin);

const renderedMarkdown = computed(() => {
  return md.render(props.source);
});

const renderedContent = computed(() => {
  // 在 renderedMarkdown 末尾插入光标标记
  return `${renderedMarkdown.value}`;
});
</script>
<style lang="scss" scoped>
.uiMarkdown {
  width: 100%;
  :deep(.markdown-wrapper) {
    width: 100%;
    overflow: hidden;
    p,
    ul,
    ol,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    dl,
    dd {
      line-height: 2;
    }
    pre {
      white-space: pre-wrap; /* 保留所有空格和换行符，但允许在必要时换行。 */
      word-wrap: break-word; /* 允许单词内换行 */
      word-break: break-all; /* 可以在任何字符处换行 */
      // line-height: 1.3;
      font-size: $text-sm;
    }

    // &::after {
    //   content: '';
    //   display: inline-block;
    //   width: 8px;
    //   height: 8px;
    //   margin-left: 4px;
    //   background-color: #333;
    //   border-radius: 50%;
    //   animation: dot-flashing 1s infinite alternate;
    // }
    // @keyframes dot-flashing {
    //   0% {
    //     opacity: 0.2;
    //   }
    //   100% {
    //     opacity: 1;
    //   }
    // }
  }
}
</style>
