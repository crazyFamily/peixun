#!/usr/bin/env node

const pag = require("../package.json");
const { program } = require("commander");
const addRoute = require("..");

program
    .usage("<route-path>")
    .version(pag.version)
    .argument("<route-path>")
    .description("添加一项路由配置")
    .option("-n, --name <name>", "路由name属性")
    .option("-m, --meta <meta>", "路由meta属性")
    .option("-t, --template <template>", "指定一种模版")
    .option("-l, --level <level>", "路由级别")
    .option("-p, --parentMenuId <parentMenuId>", "3级路由的父id")
    .parse();

program.args.length || program.help();

const routePath = program.args[0];
const { name, meta, level, template, parentMenuId } = program.opts();

addRoute(routePath, name, meta, level, template, parentMenuId);
