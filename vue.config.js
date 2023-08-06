// vue.config.js
// var DashboardPlugin = require("webpack-dashboard/plugin")
const timestamp = new Date().getTime()

let proxyConfigData = {}
try {
  let { BASE_CONFIG } = require('./proxyConfig.js')
  BASE_CONFIG && (proxyConfigData = BASE_CONFIG)
  console.log('----代理配置导入成功----')
} catch (error) {
  console.log('----代理配置导入失败----')
}

module.exports = {
  publicPath: './',

  // 代码规范检测工具，默认设置为关闭
  lintOnSave: false,

  productionSourceMap: false,

  // 将css提取为额外文本文件
  css: {
    extract: process.env.VUE_APP_API_TYPE !== 'local',
    // 使用 sass-resources-loader 插件避免在每个vue文件里都引入scss 变量
    loaderOptions: {
      scss: {
        prependData: `
                    @import "./src/assets/commonScss/common-variate.scss";
                `
      }
    }
  },

  configureWebpack: {
    output: {
      filename: `js/[name].${timestamp}.js`,
      chunkFilename: `js/[name].${timestamp}.js`
    },
    // 打包优化配置
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        maxSize: 204800, // 依赖包大于1M,将被拆分
        cacheGroups: {
          elementUI: {
            name: 'chunk-elementUI',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          appStyles: {
            name: 'app-styles',
            test: /\.(css|less|scss)$/,
            chunks: 'initial',
            priority: 0,
            reuseExistingChunk: true,
            enforce: true
          },
          resetElement: {
            name: 'reset-styles',
            test: /reset-element-ui.css$/,
            chunks: 'initial',
            priority: 20,
            reuseExistingChunk: true,
            enforce: true
          },
          overwrite: {
            name: 'overwrite-styles',
            test: /overwrite-el.css$/,
            chunks: 'initial',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    },
    plugins: [
      // new DashboardPlugin({ port: 3000 })
    ],
    externals: {
      echarts: 'echarts',
      // 消除vue-aplayer插件编译中hls.js的警告
      'hls.js': 'hls.js'
    },
    devtool: 'source-map'
  },
  devServer: {
    // 端口
    port: 3000,
    // proxy: "http://api.fps.qa.pab.com.cn/mock/1745"
    // proxy: "http://tms.dev.pab.com.cn/tms-new/api"
    proxy: Object.keys(proxyConfigData).length ? proxyConfigData : ''
  }
}
