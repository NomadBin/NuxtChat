import { envConfig } from '../app/config/env-config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 生成环境变量内容
const envContent = Object.entries(envConfig)
  .map(([key, value]) => {
    const envKey = `NUXT_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
    if (typeof value === 'object' && value !== null) {
      // 如果是对象，则处理对象中的每个属性
      return Object.entries(value)
        .map(([subKey, subValue]) => {
          const fullKey = `${envKey}_${subKey.toUpperCase()}`;
          return `${fullKey}=${subValue}`;
        })
        .join('\n');
    }
    // 如果不是对象，直接返回值
    return `${envKey}=${value}`;
  })
  .join('\n');

// 写入 .env.example 文件
const envPath = path.join(__dirname, '..', '.env.example');
fs.writeFileSync(envPath, envContent);

console.log('.env.example 文件已生成');
