<template>
  <div class="avatorWarper" :style="avatorStyle">
    <img class="iconImg" v-if="props.name == 'doubao'" src="~/assets/icons/brand/doubao.png" />
    <my-icon v-else :name="iconName" class="icon"></my-icon>
  </div>
</template>
<script setup lang="ts">
import type { ModleBrands } from '~~/types/chat';

export type UiBrandAvatarName = keyof typeof ModleBrands;

type AvatarSize = 'small' | 'medium' | 'large' | 'large-3';

interface Props {
  name: UiBrandAvatarName;
  size?: AvatarSize;
}
type BrandAvatarMap = Record<UiBrandAvatarName, { icon: string; bgColor: string; color?: string }>;
type BrandSizeMap = Record<AvatarSize, { size: string; fontSize: string }>;
const brandAvatarMap: BrandAvatarMap = {
  kimi: {
    icon: 'kimi-color',
    bgColor: '#000',
  },
  qwen: {
    icon: 'qwen',
    bgColor: '#615ced',
  },
  deepseek: {
    icon: 'deepseek',
    bgColor: 'rgb(77, 107, 254)',
  },
  minimax: {
    icon: 'minimax',
    bgColor: 'linear-gradient(to right, rgb(226, 22, 126), rgb(254, 96, 60))',
  },
  stepfun: {
    icon: 'stepfun',
    bgColor: 'linear-gradient(-45deg, rgb(1, 96, 255), rgb(1, 169, 255))',
  },
  hunyuan: {
    icon: 'hunyuan',
    bgColor: '#0053e0',
  },
  zeroone: {
    icon: 'zeroone',
    bgColor: 'rgb(0, 52, 37)',
  },
  chatglm: {
    icon: 'chatglm',
    bgColor: 'linear-gradient(-45deg, rgb(52, 133, 255), rgb(80, 74, 244))',
  },
  doubao: {
    icon: 'doubao.png',
    bgColor: '',
  },
  ollama: {
    icon: 'ollama',
    bgColor: 'rgb(0, 0, 0)',
  },
  openai: {
    icon: 'openai',
    bgColor: 'rgb(0, 0, 0)',
  },
  // claude: {
  //   icon: 'claude',
  //   bgColor: 'rgb(217, 119, 87)',
  // },
};

const brandSizeMap: BrandSizeMap = {
  small: {
    size: '16px',
    fontSize: '10px',
  },
  medium: {
    size: '24px',
    fontSize: '16px',
  },
  large: {
    size: '32px',
    fontSize: '20px',
  },
  'large-3': {
    size: '62px',
    fontSize: '40px',
  },
};

const props = withDefaults(defineProps<Props>(), {
  name: 'kimi',
  size: 'medium',
});

const iconName = computed(() => {
  return 'brand/' + brandAvatarMap[props.name].icon;
});

const avatorStyle = computed(() => {
  return {
    background: brandAvatarMap[props.name].bgColor,
    color: brandAvatarMap[props.name].color ?? 'rgb(255, 255, 255)',
    width: brandSizeMap[props.size].size,
    height: brandSizeMap[props.size].size,
    fontSize: brandSizeMap[props.size].fontSize,
  };
});
</script>

<style lang="scss" scoped>
.avatorWarper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-shrink: 0;

  .iconImg {
    width: 100%;
    height: 100%;
  }
}
</style>
