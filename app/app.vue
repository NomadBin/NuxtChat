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
const settingStore = useSettingStore();

watch(
  settingStore,
  () => {
    // 切换主题
    const body = document.body;
    if (settingStore.theme == 'day') {
      // 日间模式
      body.removeAttribute('theme-mode');
      document.documentElement.classList.remove('dark');
    } else {
      // 夜间模式
      body.setAttribute('theme-mode', 'dark');
      document.documentElement.classList.add('dark');
    }
  },
  {
    immediate: true,
  },
);

onBeforeMount(async () => {
  console.log('run app onBeforeMount');
  await idb.initDb();
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
