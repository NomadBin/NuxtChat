import type MarkdownIt from 'markdown-it';

export interface PreWrapperPluginOptions {
  copyBtnText: string;
  hasCopyText: string;
}
export function preWrapperPlugin(md: MarkdownIt, options: PreWrapperPluginOptions) {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args;
    const token = tokens[idx];

    token.info = token.info.replace(/\[.*\]/, '');

    const active = / active( |$)/.test(token.info) ? ' active' : '';

    token.info = token.info.replace(/ active$/, '').replace(/ active /, ' ');

    const lang = extractLang(token.info);

    const content = fence(...args);

    return `
        <div class="markdown-code-wrapper language-${lang}">
          <div class="markdown-code-header">
            <span class="markdown-code-lang">${lang}</span>
            <button class="markdown-code-copy">
              <div class="markdown-copy-icon"></div>
              <span class="markdown-copy-text default">${options.copyBtnText}</span>
              <span class="markdown-copy-text done">${options.hasCopyText}</span>
            </button>
          </div>
          ${content}
        </div>
        `;
  };
}

export function extractTitle(info: string, html = false) {
  if (html) {
    return info.replace(/<!--[^]*?-->/g, '').match(/data-title="(.*?)"/)?.[1] || '';
  }
  return info.match(/\[(.*)\]/)?.[1] || extractLang(info) || 'txt';
}

function extractLang(info: string) {
  return info
    .trim()
    .replace(/=(\d*)/, '')
    .replace(/:(no-)?line-numbers({| |$|=\d*).*/, '')
    .replace(/(-vue|{| ).*$/, '')
    .replace(/^vue-html$/, 'template')
    .replace(/^ansi$/, '');
}
