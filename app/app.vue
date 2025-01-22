<template>
  <div class="rootApp">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const cookieStore = useCookieStore();

await callOnce(cookieStore.fetch);
const router = useRouter();

onBeforeMount(async () => {
  console.log('run app onBeforeMount');
  await idb.initDb();
  // await idb.insertSession();
  // await idb.updateSession();
  // await idb.querySession();
  // idb.deleteDb();
});

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.metaKey && event.key === 'k') {
    // command + k 跳转首页输入对话
    event.preventDefault();
    router.push({ path: '/' }).then(() => {});
  }
};

useMarkdownCopyBtn();
</script>

<style lang="scss" scoped>
.rootApp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
