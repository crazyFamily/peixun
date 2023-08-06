const { log } = require("console");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer-core");

const executablePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

async function base(obj) {
    if (!obj) return;
    const { url, username, password, re } = obj;
    const browser = await puppeteer.launch({
        executablePath,
        headless: true,
        defaultViewport: { width: 1280, height: 800 },
        args: ["--start-maximized"],
    });
    const page = await browser.newPage();
    await page.goto(url);
    const dialogRig = await page.$("#dialogRig");
    await dialogRig?.click();
    await page.type("#_umname", username, { delay: 10 });
    const pwd = await page.$("#umpwd");
    await pwd.click();
    await pwd.type(password);
    const submit = await page.$("#submit");
    await submit.click();
    const cookie = await new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const cookies = await page.cookies();
                const cookie = cookies
                    .map((v) => `${v.name}=${v.value}`)
                    .join("; ");
                return resolve(cookie);
            } catch {
                return reject();
            }
        }, 3000);
    });
    await browser.close();
    const proxyConfig = path.join(__dirname, "../../../proxyConfig.js");
    let content = fs.readFileSync(proxyConfig).toString();
    content = content.replace(re, (_, $1, $2, $3) => {
        return `${$1}${cookie}${$3}`;
    });
    fs.writeFileSync(proxyConfig, content);
}

async function getCookie() {
    const parse = process.argv[2];
    if (!parse) {
        console.log("没有环境参数");
        process.exit(1);
    }
    let obj = null;
    if (parse === "dev") {
        obj = {
            username: "wanwen129",
            password: "1q2w3e4r5t",
            url: "http://tms-new.dev.pab.com.cn",
            re: /(?<=http:\/\/tms-new.dev.pab.com.cn\/tms-new\/api[^]*?)(headers[^]*?\{[^]*?Cookie[^]*?")([^]*?)(",\s+\},)/g,
        };
    } else if (parse === "fat") {
        obj = {
            username: "wujun003",
            password: "ceshi005",
            url: "http://tms-new.fat.qa.pab.com.cn",
            re: /(?<=http:\/\/tms-new.fat.qa.pab.com.cn\/tms-new\/api[^]*?)(headers[^]*?\{[^]*?Cookie[^]*?")([^]*?)(",\s+\},)/g,
        };
    }
    base(obj);
}

if (require.main.filename === module.filename) {
    getCookie();
}

