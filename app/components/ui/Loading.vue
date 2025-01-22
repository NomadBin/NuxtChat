<template>
  <div class="loadingBox">
    <ElLoading class="mySpin" :text="$t('tips.loading')" />
  </div>
</template>

<style lang="scss" scoped>
.loadingBox {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: $s-6;

  .mySpin {
    :deep(.arco-spin-icon) {
      color: $color-primary;
    }
    :deep(.arco-spin-tip) {
      color: $color-primary;
    }
  }
}
</style>
