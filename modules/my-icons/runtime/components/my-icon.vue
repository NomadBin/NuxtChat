<template>
  <span class="my-icon" v-html="icon" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from '#imports';

const props = withDefaults(
  defineProps<{
    name: string;
    filled?: boolean;
    strokeWidth?: number;
  }>(),
  {
    filled: false,
  },
);

const icon = ref<string | Record<string, any>>('');
// let hasStroke = false;

async function getIcon() {
  try {
    const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
      eager: false,
      query: '?raw',
      import: 'default',
    });

    // @ts-ignore
    let rawIcon = (await iconsImport[`/assets/icons/${props.name}.svg`]()) as string;
    // if (rawIcon.includes('stroke')) {
    //   hasStroke = true;
    // }
    if (rawIcon && typeof rawIcon === 'string') {
      // 如果传了 strokeWidth，就替换成指定的大小
      if (props.strokeWidth) {
        rawIcon = rawIcon.replace(/stroke-width="[0-9]+"/g, `stroke-width="${props.strokeWidth}"`);
      }
      if (props.filled) {
        rawIcon = rawIcon.replace(/fill="none"/g, `fill="currentColor"`);
      }

      // @ts-ignore
      icon.value = rawIcon;
    } else {
      console.error(`[my-icons] Icon '${props.name}' doesn't exist in 'assets/icons'`);
    }
  } catch {
    console.error(`[my-icons] Icon '${props.name}' doesn't exist in 'assets/icons'`);
  }
}

await getIcon();

watchEffect(getIcon);
</script>

<style lang="scss">
.my-icon {
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  // 设置 vertical-align: -0.125em; 的目的是为了微调 SVG 图标的垂直对齐位置，使其在视觉上更加美观和一致
  vertical-align: -0.125em;
  text-rendering: optimizeLegibility;
  svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
  }
}
// .my-icon.my-icon--fill,
// .my-icon.my-icon--fill * {
//   fill: currentColor !important;
// }

// .my-icon.my-icon--stroke,
// .my-icon.my-icon--stroke * {
//   stroke: currentColor !important;
// }
</style>
