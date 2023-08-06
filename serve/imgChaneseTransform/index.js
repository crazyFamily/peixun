const fs = require("fs");
const path = require("path");
const pinyin = require("pinyin");
/**
 * 将项目中的中文图片转换为拼音
 * @param {string} dirname 图片目录
 */
function handleImg(dirname) {
    const images = fs.readdirSync(dirname);
    images.forEach((img) => {
        const imgPath = path.join(dirname, img);
        const stat = fs.statSync(imgPath);
        if (stat.isDirectory()) {
            handleImg(imgPath);
        } else {
            // 拿到图片名
            const raw = img;
            // 替换图片名重的中文
            const _pinyin = raw.replace(/[\u4e00-\u9fa5]/g, (str) => {
                return pinyin(str, { style: pinyin.STYLE_NORMAL })
                    .flat()
                    .join("");
            });
            const imgObj = {
                raw,
                pinyin: _pinyin,
                // 统计图片是否使用过
                num: 0,
            };
// 要替换的文件目录
const dirPaths = [
    "../../src/views",
    "../../src/components",
    "../../src/assets/commonScss",
    "../../src/assets/stylesheets",
];
dirPaths.forEach((dirPath) => {
    ergodicFile(imgObj, path.resolve(__dirname, dirPath));
});
// 未使用的图片删除掉
if (imgObj.num === 0) {
    fs.rmSync(imgPath);
    return;
}
// 替换完毕后修改图片名
fs.renameSync(imgPath, path.join(dirname, _pinyin));
}
});
}

/**
* 遍历views里所有文件并替换图片名
* @param {object} img
* @param {string} dirPath
*/
function ergodicFile(img, dirPath) {
    const re = new RegExp("\\/" + img.raw, "g");
    const files = fs.readdirSync(dirPath);
    files.forEach((fileName) => {
        const filePath = path.join(dirPath, fileName);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            ergodicFile(img, filePath);
        } else {
            const content = fs.readFileSync(filePath).toString();
            const num = img.num;
            const newContent = content.replace(re, (str) => {
                img.num++;
                return "/" + img.pinyin;
            });
            if (num !== img.num) {
                fs.writeFileSync(filePath, newContent);
            }
        }
    });
}

if (require.main.filename === module.filename) {
    const paths = ["../../src/assets/images", "../../src/assets/svg"];
    paths.forEach((dirPath) => {
        const absPath = path.resolve(__dirname, dirPath);
        handleImg(absPath);
    });
}
