export const useLocalStore = defineStore('localStore', {
  state: () => {
    return {
      name: '',
    };
  },
  actions: {},
  persist: {
    key: 'localStore',
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
