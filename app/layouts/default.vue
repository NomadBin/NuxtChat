<template>
  <div class="layoutBox">
    <AppSidebar2 />
    <div class="right">
      <slot> </slot>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style lang="scss" scoped>
.layoutBox {
  display: flex;
  width: 100%;
  height: 100%;
  .right {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    // flex: 1;
    height: 100%;
  }
}
</style>
