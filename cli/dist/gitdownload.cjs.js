'use strict';

var shell = require('shelljs');
var ora = require('ora');
var dayjs = require('dayjs');
var fs = require('fs-extra');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var shell__default = /*#__PURE__*/_interopDefaultLegacy(shell);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);
var dayjs__default = /*#__PURE__*/_interopDefaultLegacy(dayjs);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

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
    let colors = ["red", "green", "yellow"];
    // 开始时间
    let st = dayjs__default["default"]();
    let loading = ora__default["default"]({
        spinner: {
            interval: 80,
            frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
        },
    });
    loading.color = colors[count % 3];
    loading.text = message;
    loading.start();
    // 删除下载的目录
    shell__default["default"].rm("-rf", temp);
    shell__default["default"].exec(`git clone --depth=1 https://github.com/${repo}.git`, {
        async: true,
    }, async (code) => {
        if (code === 0) {
            const tempIgnore = ignore.map((item) => {
                return path__default["default"].join(temp, item);
            });
            shell__default["default"].rm("-rf", tempIgnore);
            let et = dayjs__default["default"]();
            let dt = et.diff(st, "s");
            loading.succeed(`👌下载成功(耗时:${dt}s)`);
            loading.stop();
            let ans = await success();
            if (ans) {
                let pkg = path__default["default"].join(process.cwd(), temp, "package.json");
                if (fs__default["default"].existsSync(pkg)) {
                    let content = fs__default["default"].readFileSync(pkg, "utf-8");
                    content = JSON.parse(content);
                    Object.assign(content, ans);
                    content = JSON.stringify(content, null, 2);
                    fs__default["default"].writeFileSync(pkg, content, "utf-8");
                }
            }
            shell__default["default"].cp("-rf", `${temp}/*`, dest);
            shell__default["default"].rm("-rf", temp);
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

module.exports = gitDownload;
