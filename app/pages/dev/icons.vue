<template>
  <div class="flex flex-col">
    <h1>icon 使用方式</h1>

    <div>
      <h2>my-icon</h2>
      <div>
        <my-icon name="iconpark/add-picture" class="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['dev-only'],
});
</script>
