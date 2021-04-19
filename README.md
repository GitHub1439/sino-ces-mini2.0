# cli-template-weapp（小程序模板）

## 开始项目

### 请确认编辑器已安装Eslint及Prettier - Code formatter插件

解释：请先安装插件再继续开发

### 项目配置文件

1. .prettierrc.js 格式化插件prettierrc配置文件 可增不可改不可减
2. .eslintrc.js ESLint校验配置文件 可增不可改不可减
3. 项目合并及提交仓库前请执行 `npm run lint` 检查代码格式

#### [强制] 项目中涉及到的组件命名、变量命名、组件属性排序等项请严格按照规范执行

[更多详细规范请查看前端规范文档](http://front.movecss.com)

### 图片静态资源OSS处理

在vue文件中当样式不为`lang="scss"`时， 注意不要在第一行添加多行注释， 否者编译时会增加代码行数

```html
<style lang="scss" scoped>
```

为了统一管理外部的图片等资源,已经挂在到`Vue`的原型链上
引入外部图片资源时，需要在css中使用时在`uni.css`文件中添加图片地址的变量

```css
.wrap {
    background: url($bgurl);
}
```

引入外部图片资源时，需要在js中使用时在`utils/oss.js`文件中添加图片地址的变量

提示：`<image :src="bgurl">`  需要先把对象`oss`在data中映射 bgurl: this.$oss.bgurl
特别注意：经测试小程序中不支持 `<image :src="$oss.bgurl">` 该用法

```js
data() {
    return {
        oss: this.$oss
    }
}
// template中使用 oss.bgurl
// js 中使用 this.oss.bgurl
```

### 文件目录结构

> 注意开发时，每一个页面的功能必须都放到同一个文件夹内， 如下目录结构

```js
├─page1     // 页面1
|  ├─components // 页面组件
|  |  ├─com1.vue
|  |  ├─com2.vue
|  ├─index.vue
├─page2     // 页面2
|  ├─components // 页面组件
|  |  ├─com1.vue
|  |  ├─com2.vue
|  ├─index.vue
```

> 当有大的模块时必须按照模块来设计目录结构

```js
├─modules1     // 模块一
|  ├─page1     // 页面1
|  |  ├─components // 页面组件
|  |  |  ├─com1.vue
|  |  |  ├─com2.vue
|  |  ├─index.vue
|  ├─page2     // 页面1
|  |  ├─components // 页面组件
|  |  |  ├─com1.vue
|  |  |  ├─com2.vue
|  |  ├─index.vue
├─modules2     // 模块一
|  ├─page1     // 页面1
|  |  ├─components // 页面组件
|  |  |  ├─com1.vue
|  |  ├─index.vue
|  ├─page2     // 页面2
|  |  ├─components // 页面组件
|  |  |  ├─com1.vue
|  |  |  ├─com2.vue
|  |  ├─index.vue
```

### 目录结构

```js
├─App.vue           // 入口页面
├─main.js           // 入口js
├─manifest.json
├─pages.json        // 小程序配置文件
├─uni.scss          // uni-app内置的常用样式变量
├─utils             // 工具类
├─store             // vuex
├─static            // 静态资源css，js，图片等
├─pages             // 页面文件夹
├─owncomponents     // 页面组件
|  ├─sn-table // 表格
|  ├─sn-modal // 弹框
|  ├─sn-loadmore // loading更多
|  ├─sn-listcell // cell
|  ├─sn-fab      // fab
|  ├─sn-datetime // 时间组件
|  ├─sn-custom   // 自定义navigationStyle
|  ├─sn-button   // 按钮
|  ├─sn-authbtn  // 公共授权按钮
├─config            // api接口地址配置
├─components        //第三方组件
|     ├─u-charts
```

### 开始安装

```bash
npm install
```

### 开发环境

开发之前先把`src/manifest.json`文件中`mp-weixin`属性中的appid修改成自己小程的appid

1、在小程序管理端下载密钥文件 并改名为`private.key`，然后放在项目的根目录下

2、在小程序管理端添加ip白名单

```json
"mp-weixin": { /* 微信小程序特有相关 */
    "appid": "wxce72213030fa4c3b",
}
```

```bash
npm run dev
```

- 方式一

运行命令后会在根目录下生成一个`dist`目录
打开微信开发者工具导入`dist/dev/mp-weixin`

- 方式二

当你不想打开微信开发者工具时首先运行命令`npm run dev`

然后运行命令`npm run preview:mp-weixin`后会生成一个二维码，然后手机扫描预览效果，这种方式修改文件后必须手动在运行一次， 建议使用第一种方式

### 生产环境

```bash
npm run build          #生产环境
npm run upload:mp-weixin # 直接编译后上传到小程序管理端
```

- 方式一

运行命令`npm run build`后，然后打开微信开发者工具导入`dist/build/mp-weixin`， 然后在开发者工具中上传代码

- 方式二

首先运行命令`npm run build`打包

然后运行命令`npm run upload:mp-weixin`编译后，会直接编译后上传到小程序管理端， 前提是*wxci.js*已经配置好了
