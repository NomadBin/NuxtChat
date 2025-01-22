import type MarkdownIt from 'markdown-it';

// 创建一个自定义插件
export const targetBlankPlugin = (md: MarkdownIt) => {
  // 保存原来的 link 规则
  const defaultRender =
    md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => {
      return self.renderToken(tokens, idx, options);
    });

  // 重写 link_open 规则
  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const hrefIndex = token.attrIndex('href');
    if (hrefIndex >= 0) {
      const href = token.attrs[hrefIndex][1];

      // 检查是否存在自定义的 {:target="_blank"} 语法
      const targetText = encodeURI('{:target="_blank"}');
      if (href.includes(targetText)) {
        const newHref = href.replace(targetText, '');
        token.attrs[hrefIndex][1] = newHref;

        // 添加 target="_blank" 属性
        token.attrPush(['target', '_blank']);
      }
    }
    return defaultRender(tokens, idx, options, env, self);
  };
};
