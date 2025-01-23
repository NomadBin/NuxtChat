type Theme = 'dark' | 'day';

interface SettingStore {
  theme: Theme;
}

export const useSettingStore = defineStore('settingStore', {
  state: (): SettingStore => {
    return {
      theme: 'day',
    };
  },
  actions: {
    setTheme(theme: Theme) {
      this.theme = theme;
    },
  },
  persist: {
    key: 'settingStore',
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
