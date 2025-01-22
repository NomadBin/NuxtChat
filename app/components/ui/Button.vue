<template>
  <el-button class="custom-el-btn" :type="props.type">
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
});
</script>

<style lang="scss" scoped>
.custom-el-btn {
  --el-button-hover-bg-color: rgba(var(--my-green-3), 0.1);
  --el-button-hover-border-color: #{$color-primary-light};
  &.el-button--primary {
    --el-button-hover-bg-color: #{$color-primary-light};
    --el-button-hover-border-color: #{$color-primary-light};
    --el-button-active-bg-color: #{$color-primary-light};
    --el-button-active-border-color: #{$color-primary-light};
  }
}
</style>
