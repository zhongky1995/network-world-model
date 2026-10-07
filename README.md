# 网络世界模型

给第一次理解网络的人写的中文知识库。从打开一条商品链接开始，讲清浏览器怎样找到网站、网络怎样传送信息、网站怎样处理并回复，再理解 IP、端口、域名、网址参数、登录身份、风控与 VPN。

**[在线阅读](https://zhongky1995.github.io/network-world-model/)** · [先看完整地图](https://zhongky1995.github.io/network-world-model/#/world-map) · [阅读 Markdown 原文](content/00-world-map.md)

31 篇内容、12 幅图解。可以从完整地图开始，也可以按自己的问题跳读、搜索；没有必做练习或完成率。

## 能读到什么

- 浏览器、网络、互联网、网页和软件之间的关系。
- IP、端口、DNS、多级域名，以及路径、问号参数和井号的作用。
- 网页、消息、文件和视频通话怎样传递；为什么测速快，网页仍可能慢。
- 网站怎样识别登录账号；IP 为什么能用于风控，又为什么不能等同个人身份。
- VPN、代理与分流改变哪些访问；如何配置、验证和恢复。
- 连不上时如何对照排查；如何远程访问自己的设备、分享电脑里的网页。

## 离线阅读

下载 [release/index.html](https://github.com/zhongky1995/network-world-model/raw/refs/heads/main/release/index.html)，保存后用浏览器打开。正文、图解、目录和搜索已嵌入这个文件，无需联网或安装软件。

## 修改与构建

需要 Node.js 22 或更新版本。首次使用：

```sh
npm ci --ignore-scripts
npm run build
npm run check
```

- `content/`：可编辑的 Markdown 正文和 SVG 图解。
- `app/`：阅读器模板、目录与名词解释。
- `scripts/`：构建、打包与发布内容检查。
- `release/index.html`：构建后可独立打开的阅读器，也是在线网站的入口。

修改原文后重新运行构建与检查。浏览器在线阅读使用网址中的 `#/文章编号` 导航，适合 GitHub Pages 的项目子路径。推送到 `main` 后，GitHub Actions 会构建、检查并更新 Pages；Pull Request 只检查构建。

## 参与改进

欢迎通过 Issue 指出读不懂的句子、概念错误、过时设置或无法解释的日常场景。最好附上章节标题和原句。也可以提交 Pull Request 修改文章或阅读器。

案例均有虚构教学标记，配置示范不能代替供应商资料，平台风控规则不作确定推断。

## 开源许可

原创正文、图解和代码使用 [MIT License](LICENSE)。阅读器原有许可和第三方说明见 [READER_LICENSE.txt](READER_LICENSE.txt) 与 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。文中引用链接的资料不属于本仓库的开源授权范围。
