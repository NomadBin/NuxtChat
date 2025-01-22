<template>
  <el-popover
    :placement="props.placement"
    :trigger="props.trigger"
    :show-arrow="false"
    :popper-style="{
      padding: 0,
      background: 'transparent',
      boxShadow: 'none',
      minWidth: 'auto',
      width: 'auto',
    }"
  >
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <template #default>
      <slot name="default"></slot>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
interface Props {
  placement?: 'right' | 'right-end';
  trigger?: 'click' | 'hover';
}
const props = withDefaults(defineProps<Props>(), {
  placement: 'right',
  trigger: 'click',
});
</script>

<style lang="scss"></style>
