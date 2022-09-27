import shell from "shelljs";
import ora, { Color } from "ora";
import dayjs, { Dayjs } from "dayjs";
import fs from "fs-extra";
import path from "path";
/**
 * 下载github仓库
 * @param {*} opts 对象参数
 * @param {string} opts.repo 仓库地址 用户名/仓库名
 * @param {string} opts.message 下载提示消息 "开始下载"
 * @param {string} opts.dest 存放目录 当前目录
 * @param {number} opts.count 失败后，尝试下载次数 1
 * @param {Function} opts.success 下载成功后的回调函数
 */
export default async function gitDownload({
  repo,
  message = "开始下载",
  dest,
  count = 1,
  success = () => {},
  startTime,
}: {
  /**
   * 仓库
   */
  repo: `${string}/${string}`;
  /**
   * 存放目录
   */
  dest: string;
  /**
   * 消息
   */
  message?: string;
  /**
   * 重复下载次数
   */
  count?: number;
  /**
   * 成功下载后回调函数
   */
  success?: () => any;
  /**
   * 开始时间
   */
  startTime?: Dayjs;
}) {
  let temp: string = repo.split("/")[1];
  // 当前进度条的颜色
  let colors: Color[] = ["red", "green", "yellow"];
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
  shell.exec(
    `git clone --depth=1 https://github.com/${repo}.git`,
    {
      async: true,
    },
    async (code) => {
      if (code === 0) {
        shell.rm("-rf", [`${temp}/.git`, `${temp}/package-lock.json`]);
        let et = dayjs();
        let dt = et.diff(st, "s");
        loading.succeed(`👌下载成功(耗时:${dt}s)`);
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
      } else {
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
    }
  );
}
