#! /usr/bin/env node
import { Option, Command } from 'commander';
import http from 'http';
import path from 'path';
import mime from 'mime';
import fs from 'fs-extra';
import shell from 'shelljs';
import ora from 'ora';
import dayjs from 'dayjs';

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
 * 睡眠
 * @param time 1秒
 * @returns
 */
function sleep(time = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

const createCommand = new Command("create");
createCommand
    .description(["创建模板", "-d 目录地址(default:'.')"].join("\n\t\t\t"))
    .addOption(dirOption)
    .action((opts) => {
    let count = 2;
    download({
        repo: "chendj89/cli",
        dest: opts.dir,
        message: "开始下载",
        count,
    });
});
async function download({ repo, dest, count, message }) {
    let colors = ["green", "yellow", "green"];
    let theme = colors[count];
    count--;
    let dirName = "";
    if (repo.includes("/")) {
        let repoArray = repo.split("/");
        dirName = path.join(dest, repoArray[1]);
    }
    // 删除之前存在的目录
    shell.rm("-rf", dirName);
    dayjs();
    let loding = ora({
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
    }).start();
    loding.text = message;
    loding.color = theme;
    shell.exec(`git clone --depth=1 https://github.com/${repo}.git`, {
        async: true,
    }, async (code) => {
        if (code === 0) {
            loding.succeed("下次成功");
            loding.stop();
        }
        else {
            loding.stop();
            await sleep(1000);
            if (count > 0) {
                download({
                    repo,
                    dest,
                    count,
                    message: "重新下载",
                });
            }
        }
    });
}

const program = new Command();
program.addCommand(serveCommand).addCommand(createCommand);
program.version(version);
program.parse(process.argv);
