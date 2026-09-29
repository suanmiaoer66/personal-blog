# 林予 · 金融分析与投资研究个人主页

原生 HTML、CSS 和 JavaScript 静态网站，无需安装依赖或构建。根据金融方向的个人主页反馈改版：灰米色背景、深蓝文字、简洁履历结构，保留轻量兴趣与生活内容。

## 本地预览

在本目录运行 `python3 -m http.server 4173 --bind 127.0.0.1`，打开 http://127.0.0.1:4173 。

## 页面内容

- About：个人简介与研究关注方向。
- Education：独立教育背景，院校、专业、学位与日期占位。
- Experience：工作与实习，采用简洁职责条目。
- Technical Skills：财务分析、数据分析、工具与研究汇报。
- Selected Research：技能区内两个金融项目示例，支持详情弹窗。
- Interests & Beyond Work：运动、阅读、摄影与城市漫步。
- Contact：姓名、邮箱、电话、留言、示例邮箱与城市地址。

所有个人信息、学历、任职、技能和项目均为版式示例，不代表真实履历或投资业绩。头像为素材照片。

## 替换资料

1. 在 `index.html` 修改姓名、介绍、院校、日期、公司、技能、兴趣、邮箱和地址，以及网页标题与描述。
2. 在 `app.js` 的 `projects` 中替换案例详情。两个案例标识为 `fundamentals` 和 `allocation`，与 HTML 的 `data-project` 对应。
3. 在 `assets/portrait.jpg` 替换本人头像，同步替代文本。森林素材可替换为个人生活照片。
4. 全部内容确认真实后，再移除首屏及各处示例说明。
5. 在 `styles.css` 顶部的变量调整主题色。更新发布时同步修改 HTML 内资源版本号，避免浏览器使用旧缓存。

旧版设计项目 SVG 作为原始素材保留，但新版页面不引用。

## 滚动动画

`motion.js` 和 `motion.css` 独立控制动效。六个栏目包含背景一起渐入（850ms）；元素同时以较大位移入场。桌面正文位移72px，标题88px，卡片100px，照片110px；手机为44–64px。

学历和经历按各自列表错开350ms，技能和项目卡片按各自卡片组错开350ms，兴趣条目150ms。完全离屏后重置，再进入时重新播放。桌面首屏离开视窗时渐淡，照片有轻微视差。手机关闭首屏视差和渐淡。

键盘聚焦与表单校验会立即显示对应区域；系统“减少动态效果”和打印模式关闭动画。无 JavaScript 时内容仍可见。

## 联络表单

默认演示模式只校验必填项和邮箱格式，不发送、不存储留言。示例邮箱 `hello@linyu.example` 不可收信。

正式收信需在 `site-config.js` 设置 `contactEndpoint` 为已部署的 HTTPS JSON POST 接口。字段为 `firstName`、`lastName`、`email`、`phone`、`message`，成功响应须为2xx，跨域服务须支持 CORS。页面包含提交中、成功、失败和超时状态；失败时保留内容。

接口负责服务端校验、反垃圾与邮件投递。不要在前端放入邮件服务密钥。真实投递尚未配置或验证。

## 发布

仓库：https://github.com/suanmiaoer66/personal-blog

分享地址：https://suanmiaoer66.github.io/personal-blog/

GitHub Pages 发布源为 `main` 分支根目录，推送后自动更新。`.nojekyll` 用于直接发布静态文件。

## 素材

- 人像：https://images.unsplash.com/photo-1494790108377-be9c29b29330
- 森林：https://images.unsplash.com/photo-1441974231531-c6227db76b6e

图片保存在本地，不依赖外部字体、CDN 或运行时图片请求。
