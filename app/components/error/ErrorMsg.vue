<template>
  <div class="errorMsg">
    {{ props.slotVal }}
  </div>
</template>

<script setup lang="ts">
import type { MditConfigGuideProps } from '~~/types/md-it';

const props = withDefaults(defineProps<MditConfigGuideProps>(), {
  type: 'ollama',
});
</script>

<style lang="scss" scoped>
.errorMsg {
  display: flex;
  flex-direction: column;
}
</style>
