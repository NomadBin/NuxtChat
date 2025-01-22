<template>
  <ClientOnly fallback-tag="span">
    <slot></slot>
    <template #fallback>
      <UiLoading></UiLoading>
    </template>
  </ClientOnly>
</template>
