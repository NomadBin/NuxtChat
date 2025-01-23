const fs = require('fs');
const path = require('path');

// 读取 nuxt.config.ts 文件
const nuxtConfigPath = path.join(__dirname, '../nuxt.config.ts');
console.log('nuxtConfigPath', nuxtConfigPath);
const nuxtConfigContent = fs.readFileSync(nuxtConfigPath, 'utf-8');

// 使用正则表达式提取 runtimeConfig 部分
const runtimeConfigMatch = nuxtConfigContent.match(/runtimeConfig:\s*{([^}]*)}/s);
if (!runtimeConfigMatch) {
  throw new Error('runtimeConfig not found in nuxt.config.ts');
}

const runtimeConfigContent = runtimeConfigMatch[1].trim();

// 解析 runtimeConfig 内容为键值对
const configLines = runtimeConfigContent.split(',').map((line) => line.trim());
const envVars = {};

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

configLines.forEach((line) => {
  const [key, value] = line.split(':').map((part) => part.trim().replace(/['"]/g, ''));
  if (key && value) {
    let realKey = camelToSnake(key);
    realKey = 'nuxt_' + realKey;

    envVars[realKey.toUpperCase()] = value;
  }
});

// 生成 .env.example 文件内容
let envExampleContent = '';
for (const key in envVars) {
  envExampleContent += `${key}=\n`;
}

// 写入 .env.example 文件
const envExamplePath = path.join(__dirname, '../.env.example');
fs.writeFileSync(envExamplePath, envExampleContent);

console.log(`.env.example 文件已生成: ${envExamplePath}`);
