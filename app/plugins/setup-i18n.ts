import type { Locale } from '#i18n';

/**
 * 应用初始化时读取这些 localeCode 来设置语言
 */
export default defineNuxtPlugin(async (nuxt) => {
  // if (import.meta.client) {
  //   /**
  //    * 如果使用useI18n,则会报setup错误
  //    */
  //   const i18n = useNuxtApp().$i18n;
  //   const { setLocale, locales } = i18n;
  //   const chatStore = useChatStore();
  //   const lang = computed(() => chatStore.localeCode as Locale);
  //   if (lang.value !== i18n.locale) await setLocale(chatStore.localeCode as Locale);
  //   watch(
  //     [lang],
  //     () => {
  //       console.log('plugins setup i18n setLocale', lang.value);
  //       setLocale(lang.value);
  //     },
  //     { immediate: true },
  //   );
  // }
});
