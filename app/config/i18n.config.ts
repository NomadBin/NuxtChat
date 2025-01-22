import { currentLocales } from './i18n';

export default defineI18nConfig(() => ({
  legacy: false,
  availableLocales: currentLocales.map((l) => l.code),
  fallbackLocale: 'zh-CN',
  fallbackWarn: true,
  missingWarn: true,
}));
