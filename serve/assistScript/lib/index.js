const { resolve } = require("path");
module.exports = (
    routePath,
    routeName,
    meta,
    level,
    template,
    parentMenuId
) => {
    process.argv.length = 2;
    process.argv.push("addRoute");
    process.argv.push("--gulpfile");
    process.argv.push(resolve(__dirname, "../gulpfile.js"));
    process.argv.push("--cwd");
    process.argv.push(process.cwd());
    process.argv.push(
        `-routePath=${routePath}&routeName=${routeName}&meta=${meta}&level=${level}&template=${template}&parentMenuId=${parentMenuId}`
    );
    require("gulp-cli")();
};
