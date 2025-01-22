<template>
  <el-avatar class="uiAvatar" :icon="UserFilled" />
</template>

<script setup lang="ts">
import { UserFilled } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.uiAvatar {
  background-color: $color-primary-light;
  cursor: pointer;
}
</style>
