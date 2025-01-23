import { writeFileSync, readFileSync } from 'fs';

/*
 生成色板,在线色板查看: https://arco.design/palette/list
*/

function readJsonFile(filePath) {
  const jsonData = readFileSync(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

const prefix = 'my';
function parsePaletteObj(obj) {
  let scssText = '';
  for (const key in obj) {
    const list = obj[key];
    list.map((item, index) => {
      // 如果是16进制颜色则转换成rgb
      if (item.indexOf('#') > -1) {
        item = item.replace('#', '');
        item = `rgb(${parseInt(item.slice(0, 2), 16)}, ${parseInt(
          item.slice(2, 4),
          16,
        )}, ${parseInt(item.slice(4, 6), 16)})`;
      }

      // 提取出rgb包裹的颜色
      if (item.indexOf('rgb') > -1) {
        item = item.replace('rgb', '');
        item = item.replace('(', '');
        item = item.replace(')', '');
      }

      scssText += `  --${prefix}-${key}-${index + 1}: ${item};\n`;
    });
  }

  return scssText;
}

const paletteObj = readJsonFile('js-scripts/data/arco-palette.json');

const light_text = parsePaletteObj(paletteObj.light);
const dark_text = parsePaletteObj(paletteObj.dark);

let writeScssText = `
body {
${light_text}
  --${prefix}-ui-page-bg: 243, 245, 249;
  --${prefix}-ui-chat-bg: 255, 255, 255;
}

body[theme-mode='dark'] {
${dark_text}
  --${prefix}-ui-page-bg: 41, 41, 50;
  --${prefix}-ui-chat-bg: 49, 49, 58;
}
`;

let writePath = `assets/scss/${prefix}-palette.scss`;

writeFileSync(writePath, writeScssText, 'utf-8');

console.log('scss文件生成成功', writePath);
