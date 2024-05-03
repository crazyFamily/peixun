const fs = require('fs')
const path = require('path')
const els = require('ejs')
const { src, dest } = require('gulp')
const swig = require('gulp-swig')
const rename = require('gulp-rename')

/**
 *
 * @param {string} content
 * 解析传入的 路由名称 routeName; 模版名称 template
 */
function parseArgs(content) {
  let data = {
    routePath: undefined,
    routeName: undefined,
    template: undefined,
    meta: undefined,
    level: undefined
  }
  content = content.substring(1)
  content.split('&').forEach((v) => {
    const [key, value] = v.split('=')
    data[key] = value === 'undefined' ? undefined : value
  })
  return data
}

/**
 *
 * @param {string} routePath 输入的路由
 * @param {string} basePath 基础路径 src/views
 * 处理路由路径 xx/xx/routeName
 * 如果路径中的目录不存在则创建
 */
function handleRoutePath(routePath, basePath) {
  if (routePath.indexOf('/') < 0) return
  const routePaths = routePath.split('/').slice(0, -1)
  for (let i = 0; i < routePaths.length; i++) {
    const dirPath = path.resolve(basePath, routePaths[i])
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    basePath = dirPath
  }
}

/**
 * 修改router/modules/xxx.js文件内容
 */
function chnageRouterjs(routePath, fileName, name, meta, moduleName) {
  const cwd = process.cwd()
  const routerJsPath = path.resolve(cwd, `src/router/modules/${moduleName}.js`)
  let routerContent = fs.readFileSync(routerJsPath)
  routerContent = routerContent.toString()
  routerContent = routerContent.replace(
    /(?=(]\s+)$)/,
    `
		,{
			path: "/${fileName}",
			name: "${name}",
			meta: "${meta}",
			component: () =>
				import(
					/* webpackChunkName: "${moduleName}" */
					"@/views/${routePath}"
				)
		}
		`
  )
  fs.writeFileSync(routerJsPath, routerContent)
}

/**
 * 修改aside.vue里的内容
 * @param {string} meta
 * @param {string} fileName
 * @param {string} routeName
 * @param {string} level
 */
function changeAsideVue(meta, fileName, routeName, level, parentMenuId) {
  if (!level) return
  const cwd = process.cwd()
  const asidePath = path.resolve(cwd, 'src/components/Aside.vue')
  let asideContent = fs.readFileSync(asidePath)
  asideContent = asideContent.toString()
  asideContent = asideContent.replace(
    /(localdata:\s*)([^]*?)(,?)(\s*\}\s+\},\s+methods:)/,
    (a, b, str) => {
      eval(`var localdata = ${str}`)
      const menuInfoList = localdata.menuInfoList
      const menu = menuInfoList.find((v) => v.menuName === meta)
      if (!menu) {
        console.log('一级菜单未找到')
        return `${RegExp.$1}${RegExp.$2}${RegExp.$3}${RegExp.$4}`
      }
      if (level == 1) {
        const last = menu.childMenus.slice(-1)[0] || {}
        menu.childMenus.push({
          menuId: (last.menuId || menu.menuId) + 1 + '',
          menuLink: `/${fileName}`,
          menuLvl: 2,
          menuName: routeName,
          pageSort: last.pageSort + 1,
          prnMenuId: menu.menuId
        })
      }
      if (level == 3 && parentMenuId) {
        const fourLvlMenuList = localdata.fourLvlMenuList
        const last_ = fourLvlMenuList.slice(-1)[0] || {}
        fourLvlMenuList.push({
          menuId: (last_.menuId || parentMenuId) + 1 + '',
          menuLink: `/${fileName}`,
          menuName: routeName,
          menuLvl: 4,
          pageSort: 2,
          childMenus: null,
          prnMenuId: parentMenuId
        })
      }
      return `${RegExp.$1}${JSON.stringify(localdata, null, 4)}${RegExp.$3}${
        RegExp.$4
      }`
    }
  )
  fs.writeFileSync(asidePath, asideContent)
}

exports.addRoute = () => {
  const content = process.argv[process.argv.length - 1]
  const { routePath, routeName, template, meta, level, parentMenuId } =
    parseArgs(content)
  const cwd = process.cwd()
  const basePath = path.resolve(cwd, 'src/views')
  if (!fs.existsSync(basePath)) {
    return Promise.reject('路径错误， 该路径下没有src/views目录')
  }
  // 解析出 moduleName 和 fileName
  const moduleName = routePath.split('/').filter((v) => v)[0]
  const fileName = routePath.split('/').slice(-1)[0]
  // 修改router.js文件
  chnageRouterjs(routePath, fileName, routeName, meta, moduleName)
  // 修改aside.vue文件
  changeAsideVue(meta, fileName, routeName, level, parentMenuId)
  // 处理路由路径中不存在的文件夹
  handleRoutePath(routePath, basePath)
  const data = { moduleName, fileName }
  const templateDir = path.resolve(__dirname, './templates')
  const dirPath = routePath.split('/').slice(0, -1).join('/')
  return src(path.join(templateDir, `${template || 'default'}.vue`))
    .pipe(swig({ data }))
    .pipe(rename(`${fileName}.vue`))
    .pipe(dest(path.join(basePath, dirPath)))
}