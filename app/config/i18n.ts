import type { LocaleObject } from '@nuxtjs/i18n';
interface LocaleObjectData extends LocaleObject {}

const locales: LocaleObjectData[] = [
  {
    code: 'en',
    file: 'en.json',
    name: 'English',
  },
  {
    code: 'zh-CN',
    file: 'zh-CN.json',
    name: '简体中文',
  },
];

function buildLocales() {
  const myLocales = locales;

  return myLocales;
}

export const currentLocales = buildLocales();
