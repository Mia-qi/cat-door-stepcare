# 微信小程序快速配置指南

## 🚀 5步快速上线

### 步骤 1：注册并获取 AppID（约 10 分钟）

1. 访问：https://mp.weixin.qq.com/
2. 注册小程序账号
3. 登录后台，获取 AppID（开发 → 开发管理 → 开发设置）

### 步骤 2：配置 AppID（1 分钟）

打开 `manifest.json`，找到第 45 行：

```json
"mp-weixin": {
  "appid": "",  // ← 在这里填入您的 AppID
```

填入格式：`"appid": "wxxxxxxxxxxxxxxxxx"`

### 步骤 3：准备 TabBar 图标（重要！）

#### 方案 A：使用临时图标（快速测试）

如果暂时没有图标，可以临时禁用 TabBar 或使用占位图标。

**临时禁用 TabBar：**
在 `pages.json` 中注释掉 `tabBar` 配置（第 47-72 行）

**或者使用简单图标：**
创建 6 个 81x81px 的 PNG 图标放在 `static` 目录

#### 方案 B：下载图标（推荐）

1. 访问图标库：
   - Iconfont：https://www.iconfont.cn/
   - Iconify：https://icon-sets.iconify.design/

2. 搜索关键词：`home`、`order`、`user`、`profile`

3. 下载图标（PNG 格式，81x81px 或更大）

4. 重命名并放入 `static` 目录：
   ```
   static/
   ├── icon-home.png
   ├── icon-home-active.png
   ├── icon-order.png
   ├── icon-order-active.png
   ├── icon-profile.png
   └── icon-profile-active.png
   ```

### 步骤 4：构建项目（使用 HBuilderX）

1. 打开 HBuilderX
2. 文件 → 导入 → 从本地目录导入
3. 选择项目目录
4. 发行 → 小程序-微信
5. 填写 AppID
6. 点击"发行"

### 步骤 5：上传和提交审核

1. 微信开发者工具打开项目
2. 上传代码
3. 登录小程序后台：https://mp.weixin.qq.com/
4. 版本管理 → 提交审核
5. 填写审核信息并提交

---

## ⚠️ 常见问题快速解决

### 问题 1：TabBar 图标不显示

**解决：**
- 检查 `static` 目录下是否有图标文件
- 检查图标路径是否正确（`static/icon-xxx.png`）
- 检查图标尺寸（建议 162x162px）

### 问题 2：构建失败

**解决：**
- 检查 `manifest.json` 中 AppID 是否填写
- 检查 `pages.json` 配置是否正确
- 查看控制台错误信息

### 问题 3：找不到微信开发者工具

**解决：**
1. 下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 在 HBuilderX 中配置路径：工具 → 设置 → 插件配置 → 微信开发者工具

---

## 📋 最小配置检查清单

上线前必须完成：

- [ ] AppID 已填入 `manifest.json`
- [ ] TabBar 图标已准备（或已禁用 TabBar）
- [ ] 小程序名称已设置
- [ ] 小程序头像已上传
- [ ] 服务类目已选择

---

## 🔗 相关链接

- 微信公众平台：https://mp.weixin.qq.com/
- 微信开发者工具：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
- 图标库：https://www.iconfont.cn/

---

## 💡 提示

**第一次上线建议：**
1. 先注册测试账号（个人账号快速通过）
2. 使用 HBuilderX 工具（最简单）
3. 准备真实图标（审核更容易通过）
4. 选择正确的服务类目（很重要！）

