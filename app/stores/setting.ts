type Theme = 'dark' | 'day';

interface SettingStore {
  theme: Theme;
  porxyChat: boolean;
}

export const useSettingStore = defineStore('settingStore', {
  state: (): SettingStore => {
    return {
      theme: 'day',
      porxyChat: false,
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
