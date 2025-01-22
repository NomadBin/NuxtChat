
# cloudflare

## `wrangler`直接部署

1. 为 Cloudflare Pages 构建您的项目：
```bash
npx nuxi build --preset=cloudflare_pages
```

2. 确保有`wrangler`，如果没有使用命令安装:
```bash
npm i -g wrangle
```

3. 运行`wrangler`部署，第一次会要求你创建一个项目：
```bash
wrangler pages deploy dist/
```



## cloudflare git 集成部署
通过推送git代码自动完成构建部署

1.选择需要部署的github仓库:
* clodflare官方文档: https://developers.cloudflare.com/pages/get-started/git-integration/
* 简单来说就是通过cloudflare网站,选择需要部署的git仓库。

2. 填入以下配置:
```bash
构建命令: npx nuxi build --preset=cloudflare_pages
构建输出目录: dist
```
点击部署后，等待部署完，就会使用预览域名访问网站了。
