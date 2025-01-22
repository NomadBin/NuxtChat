/**
 * 使用cookie作为持久化存储，这种方式才可以在服务端与客户端共享
 * 因为 cookie 大小限制为 4098 字节，非必要不将数据存储在此处
 * 使用插件文档: https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt
 *
 */

export const useCookieStore = defineStore('cookieStore', {
  state: () => {
    return {
      isLogin: true,
      showSiderBar: true,
    };
  },
  actions: {
    async fetch() {
      //   const infos = await $fetch("https://api.nuxt.com/modules/pinia");
      //   this.name = infos.name;
      //   this.description = infos.description;
      console.log('run fetch........');
    },

    setLogin(isLogin: boolean) {
      this.isLogin = isLogin;
    },
    setShowSiderBar(showSiderBar: boolean) {
      this.showSiderBar = showSiderBar;
      // saveLifeData('showSiderBar', this.showSiderBar);
    },
  },
  // persist: {
  //   key: 'cookieStore',
  //   storage: piniaPluginMyPersistedstate.cookies(),
  // },
});
