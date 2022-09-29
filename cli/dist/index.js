#! /usr/bin/env node
import { Option, Command } from 'commander';
import http from 'http';
import path from 'path';
import mime from 'mime';
import fs from 'fs-extra';
import shell from 'shelljs';
import dayjs from 'dayjs';
import inquirer from 'inquirer';
import chalk from 'chalk';

var version$1 = "1.0.0";

/**
 * 连接符\n\t\t\t
 */
let lineFlag = `\n\t\t\t`;
// 目录
let dirOption = new Option("-d,--dir <string>", "资源目录")
    .default(process.cwd())
    .argParser((value) => {
    if (value === ".") {
        // 返回当前目录
        return process.cwd();
    }
    else {
        let dir = path.join(process.cwd(), value);
        // 判断相对目录是否存在-子目录、相对目录
        if (fs.existsSync(dir)) {
            return dir;
        }
        else {
            return value;
        }
    }
});
// 端口
let portOption = new Option("-p,--port <number>", "端口号").default(8089);
// 目录
let rootOption = new Option("-r,--root <string>", "根目录").default("");
// 名称
let fromOption = new Option("-f,--from <string>", "仓库名").default("");
// "-d 目录地址(default:'.')"
let getOptionInfo = (option) => {
    if (option instanceof Array) {
        return option.map((item) => {
            return (lineFlag +
                `${item.flags} ${item.description}(default:${item.defaultValue})`);
        });
    }
    else {
        return (lineFlag +
            `${option.flags} ${option.description}(default:${option.defaultValue})`);
    }
};

/**
 * 静态服务器
 */
const serveCommand = new Command("serve");
serveCommand
    .version("0.0.1")
    .description("静态服务器" + getOptionInfo([dirOption, portOption, rootOption]))
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

let MOVE_LEFT = Buffer.from("1b5b3130303044", "hex").toString();
let MOVE_UP = Buffer.from("1b5b3141", "hex").toString();
let CLEAR_LINE = Buffer.from("1b5b304b", "hex").toString();
let stringWidth = (str) => str;
function lineLog(stream) {
    let write = stream.write;
    let str;
    stream.write = function (data) {
        if (str && data !== str)
            str = null;
        return write.apply(this, arguments);
    };
    if (stream === process.stderr || stream === process.stdout) {
        process.on("exit", function () {
            if (str !== null)
                stream.write("");
        });
    }
    let prevLineCount = 0;
    let log = function () {
        str = "";
        let nextStr = Array.prototype.join.call(arguments, " ");
        // Clear screen
        for (let i = 0; i < prevLineCount; i++) {
            str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : "");
        }
        // Actual log output
        str += nextStr;
        stream.write(str);
        // How many lines to remove on next clear screen
        let prevLines = nextStr.split("\n");
        prevLineCount = 0;
        for (let i = 0; i < prevLines.length; i++) {
            prevLineCount +=
                Math.ceil(stringWidth(prevLines[i]) / stream.columns) || 1;
        }
    };
    log.clear = function () {
        stream.write("");
    };
    return log;
}
let stdout = lineLog(process.stdout);
lineLog(process.stderr);

let frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
/**
 * 下载github仓库
 * @param {*} opts 对象参数
 * @param {string} opts.repo 仓库地址 用户名/仓库名
 * @param {string} opts.message 下载提示消息 "开始下载"
 * @param {string} opts.dest 存放目录 当前目录
 * @param {number} opts.count 失败后，尝试下载次数 1
 * @param {array} opts.ignore 不想要的文件或者目录 [".git","package-lock.json"]
 * @param {Function} opts.success 下载成功后的回调函数
 */
async function gitDownload({ repo, message = "开始下载", dest, count = 1, success = () => { }, ignore = [".git", "package-lock.json"], startTime, }) {
    let temp = repo.split("/")[1];
    // 当前进度条的颜色
    // let colors: Color[] = ["red", "green", "yellow"];
    // 开始时间
    let st = dayjs();
    // let loading = ora({
    //   spinner: {
    //     interval: 80,
    //     frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    //   },
    // });
    stdout(message);
    let i = 0;
    setInterval(() => {
        stdout(frames[i % 9] + "  " + message);
    }, 80);
    // loading.color = colors[count % 3];
    // loading.text = message;
    // loading.start();
    // 删除下载的目录
    shell.rm("-rf", temp);
    shell.exec(`git clone --depth=1 https://github.com/${repo}.git`, {
        async: true,
    }, async (code) => {
        if (code === 0) {
            const tempIgnore = ignore.map((item) => {
                return path.join(temp, item);
            });
            shell.rm("-rf", tempIgnore);
            let et = dayjs();
            let dt = et.diff(st, "s");
            stdout(`👌下载成功(耗时:${dt}s)`);
            // loading.succeed();
            // loading.stop();
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
            // loading.stop();
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
        default: "1.0.0",
    },
];
const publish = [
    {
        type: "list",
        message: "请选择发布项目:",
        name: "repo",
        askAnswered: true,
        choices: ["gitdownload", "cli"],
    },
    {
        type: "input",
        name: "version",
        message: "版本号:",
        default: "1.0.0",
    },
    {
        type: "input",
        name: "type",
        message: "模式:",
        default: "module",
    },
    {
        type: "input",
        name: "scripts",
        message: "npm上传:",
        default: "",
    },
];
async function userInquirer() {
    return await inquirer.prompt(list);
}
async function publishInquirer() {
    return await inquirer.prompt(publish).then((ans) => {
        if (ans.repo == "gitdownload") {
            ans.dependencies = {
                shelljs: "^0.8.5",
                ora: "^6.1.2",
                dayjs: "^1.11.5",
                "fs-extra": "^10.1.0",
            };
        }
        return ans;
    });
}

// https://www.colordrop.io/
chalk.hex("#ff5c00");
const blue = chalk.hex("#118DF0");
const red = chalk.hex("#e41749");

/**
 * 创建模板指令
 */
const createCommand = new Command("create");
createCommand
    .description("创建模板" + getOptionInfo([dirOption, fromOption]))
    .addOption(dirOption)
    .addOption(fromOption)
    .action((opts) => {
    if (opts.from) {
        gitDownload({
            repo: opts.from,
            dest: opts.dir,
            success: async () => {
                let ans = await userInquirer();
                return ans;
            },
        });
    }
    else {
        console.log(red(`需要仓库名，例如：cc create -f chendj89/cli`));
    }
});

/**
 * 删除指令
 */
const rmCommand = new Command("rm");
rmCommand
    .description("删除目录" + getOptionInfo(dirOption))
    .addOption(dirOption)
    .action((opts) => {
    shell.rm("-rf", `${opts.dir}`);
    process.exit(1);
});

/**
 * 列表指令
 */
const lsCommand = new Command("ls");
lsCommand
    .description("列表当前文件:" + getOptionInfo(dirOption))
    .addOption(dirOption)
    .action((opts) => {
    if (fs.existsSync(opts.dir)) {
        const dirs = fs.readdirSync(opts.dir);
        let values = Object.values(dirs);
        if (values.length) {
            console.log(blue(values));
        }
        else {
            console.log(red("无"));
        }
    }
    process.exit(1);
});

var name = "";
var version = "";
var scripts = {
};
var devDependencies = {
};
var files = [
	"dist"
];
var type = "module";
var description = "";
var main = "dist/index.js";
var module = "dist/index.mjs";
var types = "dist/index.d.ts";
var exports = {
	"./*": "./*",
	".": {
		browser: "./dist/index.module.js",
		"import": "./dist/index.mjs",
		require: "./dist/index.js"
	}
};
var repository = {
	type: "git",
	url: ""
};
var publishConfig = {
	access: "public",
	registry: "https://registry.npmjs.org/"
};
var publishPkg = {
	name: name,
	version: version,
	scripts: scripts,
	devDependencies: devDependencies,
	files: files,
	type: type,
	description: description,
	main: main,
	module: module,
	types: types,
	exports: exports,
	repository: repository,
	publishConfig: publishConfig
};

/**
 * 列表指令
 */
const publishCommand = new Command("publish");
publishCommand
    .description("发布版本:" + getOptionInfo([dirOption]))
    .addOption(dirOption)
    .action(async (opts) => {
    let join = (str) => {
        return path.join(opts.dir, str);
    };
    let ans = await publishInquirer();
    let option = {
        ...ans,
        name: `@chencc/${ans.repo}`,
        main: "./",
        repository: {
            type: "git",
            url: `https://github.com/chendj89/${ans.repo}.git`,
        },
    };
    Object.assign(publishPkg, option);
    shell.rm("-rf", join(""));
    shell.mkdir([join(""), join("/dist")]);
    shell.cp("-f", path.join(process.cwd(), "cli/dist/gitdownload.js"), join("/dist/index.js"));
    shell.cp("-f", path.join(process.cwd(), "cli/dist/gitdownload.mjs"), join("/dist/index.mjs"));
    shell.cp("-f", path.join(process.cwd(), "cli/dist/gitdownload.module.js"), join("/dist/index.module.js"));
    shell.cp("-f", path.join(process.cwd(), "cli/dist/src/gitdownload.d.ts"), join("/dist/index.d.ts"));
    fs.writeFileSync(join("/package.json"), JSON.stringify(publishPkg, null, 2), "utf-8");
    process.exit(1);
});

const program = new Command();
program
    .addCommand(serveCommand)
    .addCommand(createCommand)
    .addCommand(lsCommand)
    .addCommand(publishCommand)
    .addCommand(rmCommand);
program.version(version$1);
program.parse(process.argv);
