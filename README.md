# 培训系统

### 
```


```

## 与后端数据接口进行交互的是 axios插件
1.因为该插件在安装的时候在 vue.prototype上注册了 vue.prototype.axios 和 vue.prototype.$axios
  可以在.vue单文组件内通过 this.axios.get post,或者this.$axios.get post访问接口数据

2.该插件在
    Vue.axios = _axios
    window.axios = _axios
    分别注册
    全局访问 可以通过 Vue.axios 或者 axios



### 
```


```


## 此项目基于vue CLI3 工程系统创建 npm install安装项目依赖的所有插件，需要连接外网
```
npm install
```

### 启动本地服务器，在本机跑起来项目
### 接口请求前缀在.env.dev文件中  该变量中设置 VUE_APP_API='xxxx'
```
npm run serve

```

### 为生产构建
### 接口请求前缀在.env.production文件中  该变量中设置 VUE_APP_API='xxxx'
```
npm run build-prd

```

### 为开发环境构建
### 接口请求前缀在.env.dev文件中  该变量中设置 VUE_APP_API='xxxx'
```
npm run build-dev
```


### 为测试构建
### 接口请求前缀在.env.fat文件中  该变量中设置 VUE_APP_API='xxxx'
```
npm run build-fat
```

## 为uat构建
### 接口请求前缀在.env.uat文件中  该变量中设置 VUE_APP_API='xxxx'
```
npm run build-uat
```
### 如果有单元测试代码可以用该命令跑测试脚本
```

npm run test:unit
```

### 代码风格检测，默认关闭了该项，可以在 vue.config.js 将此项设置为true,打开lintOnSave: false she
```
npm run lint
```


### 更多配置
See [Configuration Reference](https://cli.vuejs.org/config/).

### 接口代理请求配置可以在 vue.config.js中的 devServer中配置 数据请求会发送到代理服务器
devServer: {
   proxy: 'http://localhost:4000'
},



### 为生产构建后dist目录代码如果想在本地预览 全局安装serve模块，serve -s dist 为dist目录生成文件启动一个单页服务，预览生产包的效果
```
npm install  -g serve

```

```
serve -s dist

```

## 配置变更
1. vue 版本升级为2.7，研发使用compositionAPI
2. element-ui锁定版本为 2.15.8， 避免研发过程出现date-picker的错误警告
3. fsevents.watch 报错，可以安装一个watchman。`npm install --save-dev watchman` 原因未知

## package 指令说明
1. serve: 按vue.config.js中的配置运行，启用dev-server，这是本地环境主要使用的指令
2. build-prd: 生产环境编译，调用.env.prd 的设置
3. build-dev: 开发环境编译，调用.env.dev 的设置
4. build-fat: 测试环境编译，调用.env.fat 的设置
5. build-uat: UAT环境编译，调用.env.uat 的设置
6. node-serve: 开启node环境。相关代码于`./serve/service`内。可以写一些mock请求



serve下面的CourseRecommend的data没有完整