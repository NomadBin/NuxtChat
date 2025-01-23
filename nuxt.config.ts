import { currentLocales } from './app/config/i18n';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  /**
   * 如果.env中没有配置对应的值，则会使用这里设置的默认值
   */
  runtimeConfig: {
    deepseekUrl: 'https://api.deepseek.com',
    chatglmUrl: 'https://open.bigmodel.cn/api/paas/v4',
    doubaoUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    hunyuanUrl: 'https://api.hunyuan.cloud.tencent.com/v1',
    kimiUrl: 'https://api.moonshot.cn/v1',
    minimaxUrl: 'https://api.minimax.chat/v1',
    ollamaUrl: 'http://127.0.0.1:11434',
    openaiUrl: 'https://api.openai.com/v1',
    qwenUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    stepfunUrl: 'https://api.stepfun.com/v1',
    zerooneUrl: 'https://api.lingyiwanwu.com/v1',
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2024-09-11',
  devtools: { enabled: true },

  ssr: false,

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // Reference: https://vite.dev/config/shared-options#css-preprocessoroptions
          additionalData: `
          @use "~/assets/scss/_variable.scss" as *;
          `,
        },
        // less: {
        // },
      },
    },
  },
  typescript: {
    typeCheck: true,
    strict: false,
  },
  css: [
    '~/assets/scss/my-palette.scss',
    '~/assets/css/normalize.css',
    '~/assets/scss/main.scss',
    '~/assets/scss/markdown.scss',
  ],
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxt/fonts', '@nuxtjs/i18n', '@element-plus/nuxt'],
  plugins: [],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    },
  },
  i18n: {
    vueI18n: './app/config/i18n.config.ts',
    defaultLocale: 'zh-CN',
    locales: currentLocales,
    langDir: '../app/locales',
    strategy: 'no_prefix', // 语言切换时不改变地址栏
  },

  elementPlus: {
    importStyle: 'css',
    themes: ['dark'],
  },
});
