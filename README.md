# Lii · 金融分析与投资研究个人主页

原生 HTML、CSS 和 JavaScript 静态网站，无需安装依赖或构建。页面采用深蓝、冷灰和清晰的履历排版，正文为14–16px及以上，移除项目案例与重复提示文案。

## 本地预览

在本目录运行 `python3 -m http.server 4173 --bind 127.0.0.1`，打开 http://127.0.0.1:4173 。

## 页面结构

- About：姓名、研究方向、简介、所在地与一张头像。
- Education：New York University 硕士与本科教育背景。
- Experience：Frost & Sullivan、Deloitte Consulting、Marcum Asia CPAs LLP、Agricultural Bank of China (US) 的经历。
- Technical Skills：Valuation & Modeling、Accounting & Credit、Data & Tools、Credentials & Languages，呈现为三张卡片。
- Interest & Beyond Work：网球与高尔夫、半程马拉松与户外、国际象棋/扑克/斯诺克，三张图文卡片使用用户提供的网球、步道和台球照片。
- Contact：联络信息、地址和留言表单。

原项目案例、详情弹窗、章节编号、重复英文说明、预览说明、页脚示例声明和表单常驻提示均已移除。

## 替换真实资料与照片

当前姓名（Lii）、教育、经历、技能和兴趣文案仍是布局样稿，不代表真实履历。院校、公司、岗位和日期保留方括号占位。发布正式个人资料前，应核实并替换这些内容。

- 在 `index.html` 修改姓名、简介、学历、经历、技能、邮箱、地址、网页标题及描述。
- About 中的 `assets/portrait.jpg` 已替换为当前个人照片；后续可继续替换为最新照片。
- 在 `styles.css` 顶部的变量调整主题色。
- 更新发布时同步修改 HTML 内资源版本号，避免浏览器使用旧缓存。

旧版设计项目 SVG 作为原始素材保留，新版页面不引用。

## 滚动动画

`motion.js` 和 `motion.css` 独立控制动效。六个栏目连同背景一起渐入（850ms），内部元素保留位移入场。学历和经历按各自列表错开350ms，技能及兴趣卡片每组错开350ms。完全离屏后重置，再进入时重新播放。

键盘聚焦与表单校验即时显示对应区域。系统“减少动态效果”和打印模式关闭动画。无 JavaScript 时页面内容可见，提交按钮保持禁用。

## 联络表单

页面默认不展示常驻演示提示，仅在用户操作时显示必要反馈。没有配置联络接口时，提交会明确显示“留言尚未发送，联络服务暂未开通。”，不会伪报发送成功。当前不发送、不保存留言；`hello@lii.example` 是不可收信的占位邮箱。

正式收信需在 `site-config.js` 设置 `contactEndpoint` 为已部署的 HTTPS JSON POST 接口。字段为 `firstName`、`lastName`、`email`、`phone`、`message`，成功响应须为2xx，跨域服务须支持 CORS。页面包含校验、提交中、成功、失败和超时状态，失败时保留内容。

接口负责服务端校验、反垃圾与邮件投递。不要在前端放入邮件服务密钥。真实投递尚未配置或验证。

## 发布

仓库：https://github.com/suanmiaoer66/personal-blog

分享地址：https://suanmiaoer66.github.io/personal-blog/

GitHub Pages 发布源为 `main` 分支根目录，推送后自动更新。`.nojekyll` 用于直接发布静态文件。

## 素材

- 个人头像：由用户提供并保存在 `assets/portrait.jpg`。
- 兴趣配图：用户提供，分别保存为 `assets/interest-tennis-golf.jpg`、`assets/interest-outdoors.jpg`、`assets/interest-chess-poker-snooker.jpg`。图片统一为 3:2 显示比例，网球竖图裁切到球拍主体；台球图保留原始分辨率级别，避免无意义放大。配图和文字随整张卡片渐入，鼠标悬停时轻微放大；减少动态效果模式关闭放大动画。

图片保存在本地，不依赖外部字体、CDN 或运行时图片请求。
