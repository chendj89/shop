#! /usr/bin/env node
import { Option, Command } from 'commander';
import http from 'http';
import path from 'path';
import mime from 'mime';
import fs from 'fs-extra';
import shell from 'shelljs';
import ora from 'ora';
import dayjs from 'dayjs';
import inquirer from 'inquirer';
import chalk from 'chalk';

var version = "1.0.0";

// 目录
let dirOption = new Option("-d,--dir <string>", "请输入资源目录")
    .default(process.cwd())
    .argParser((value) => {
    if (value === ".") {
        // 返回当前目录
        return process.cwd();
    }
    else {
        if (value.startsWith("./")) {
            return path.join(process.cwd(), value);
        }
        else {
            const dir = path.join(process.cwd(), value);
            if (fs.existsSync(dir)) {
                return dir;
            }
            return value;
        }
    }
});
// 端口
let portOption = new Option("-p,--port <number>", "请输入端口号").default(8089);
// 目录
let rootOption = new Option("-r,--root <string>", "根目录").default("");

/**
 * 静态服务器
 */
const serveCommand = new Command("serve");
serveCommand
    .version("0.0.1")
    .description([
    "静态服务器",
    "-d 目录地址(default:'.')",
    "-p 端口号(default:8089)",
    "-r 根目录(default:'')",
].join("\n\t\t\t"))
    .addOption(dirOption)
    .addOption(portOption)
    .addOption(rootOption)
    .action((opts) => {
    http
        .createServer(async (req, res) => {
        // 请求地址
        let urlString = req.url;
        // 文件地址或路由地址
        let filePathName = path.join(opts.dir, urlString);
        // 数据和数据类型
        let { data, mimeType } = await readStaticFile(filePathName);
        if (data && mimeType) {
            res.writeHead(200, {
                "Content-Type": `${mimeType};charset="utf-8"`,
            });
            res.end(data);
        }
        else {
            if (mimeType || mimeType !== "text/html") {
                res.writeHead(404, {
                    "Content-Type": `${mimeType};charset="utf-8"`,
                });
                res.end(undefined);
            }
            else {
                res.writeHead(200, { "Content-Type": `text/html;charset="utf-8"` });
                let indexHtml = path.join(opts.dir, "./index.html");
                if (fs.existsSync(indexHtml)) {
                    res.end(fs.readFileSync(indexHtml, "utf-8"));
                }
                else {
                    res.end("404", "utf-8");
                }
            }
        }
    })
        .listen(opts.port, () => {
        console.log(`localhost:${opts.port}`);
    });
});
/**
 * 读取文件
 * @param filePathName
 * @returns
 */
async function readStaticFile(filePathName) {
    let ext = path.parse(filePathName).ext;
    if (ext) {
        let mimeType = mime.getType(ext);
        // 判断是否存在文件
        if (fs.existsSync(filePathName)) {
            let data = fs.readFileSync(filePathName, "utf-8");
            return { data, mimeType };
        }
        else {
            return { data: undefined, mimeType };
        }
    }
    return {
        ext,
        data: "",
    };
}

/**
 * 下载github仓库
 * @param {*} opts 对象参数
 * @param {string} opts.repo 仓库地址 用户名/仓库名
 * @param {string} opts.message 下载提示消息 "开始下载"
 * @param {string} opts.dest 存放目录 当前目录
 * @param {number} opts.count 失败后，尝试下载次数 1
 * @param {Function} opts.success 下载成功后的回调函数
 */
async function gitDownload({ repo, message = "开始下载", dest, count = 1, success = () => { }, startTime, }) {
    let temp = repo.split("/")[1];
    // 当前进度条的颜色
    let colors = ["red", "green", "yellow"];
    // 开始时间
    let st = dayjs();
    let loading = ora({
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
    });
    loading.color = colors[count % 3];
    loading.text = message;
    loading.start();
    // 删除下载的目录
    shell.rm("-rf", temp);
    shell.exec(`git clone --depth=1 https://github.com/${repo}.git`, {
        async: true,
    }, async (code) => {
        if (code === 0) {
            shell.rm("-rf", [`${temp}/.git`, `${temp}/package-lock.json`]);
            let et = dayjs();
            let dt = et.diff(st, "s");
            loading.succeed(`下载成功(耗时:${dt}s)`);
            loading.stop();
            let ans = await success();
            if (ans) {
                let pkg = path.join(process.cwd(), temp, "package.json");
                if (fs.existsSync(pkg)) {
                    let content = fs.readFileSync(pkg, "utf-8");
                    content = JSON.parse(content);
                    Object.assign(content, ans);
                    content = JSON.stringify(content, null, 2);
                    fs.writeFileSync(pkg, content, "utf-8");
                }
            }
            shell.cp("-rf", `${temp}/*`, dest);
            shell.rm("-rf", temp);
            process.exit(1);
        }
        else {
            // 下载失败
            loading.stop();
            count--;
            if (count <= 0) {
                process.exit(1);
            }
            gitDownload({
                repo,
                message: "重新下载",
                dest,
                count,
                success,
                startTime: st,
            });
        }
    });
}

let list = [
    {
        type: "input",
        name: "author",
        message: "作者:",
    },
    {
        type: "input",
        name: "description",
        message: "描述:",
    },
    {
        type: "input",
        name: "version",
        message: "版本号:",
        default: "1.0.0"
    },
];
async function userOption() {
    return await inquirer.prompt(list);
}

/**
 * 创建模板指令
 */
const createCommand = new Command("create");
createCommand
    .description(["创建模板", "-d 目录地址(default:'.')"].join("\n\t\t\t"))
    .addOption(dirOption)
    .action((opts) => {
    gitDownload({
        repo: "chendj89/cli",
        dest: opts.dir,
        success: async () => {
            let ans = await userOption();
            return ans;
        },
    });
});

/**
 * 删除指令
 */
const rmCommand = new Command("rm");
rmCommand
    .description(["删除目录", "-d 目录地址(default:'.')"].join("\n\t\t\t"))
    .addOption(dirOption)
    .action((opts) => {
    shell.rm("-rf", `${opts.dir}`);
    process.exit(1);
});

chalk.hex("#ff5c00");
const blue = chalk.hex("#118DF0");

/**
 * 列表指令
 */
const lsCommand = new Command("ls");
lsCommand
    .description("列表当前文件")
    .addOption(dirOption)
    .action((opts) => {
    if (fs.existsSync(opts.dir)) {
        const dirs = fs.readdirSync(opts.dir);
        let values = Object.values(dirs);
        console.log(blue(values));
    }
});

const program = new Command();
program
    .addCommand(serveCommand)
    .addCommand(createCommand)
    .addCommand(lsCommand)
    .addCommand(rmCommand);
program.version(version);
program.parse(process.argv);
