import shell from "shelljs";
import fs from "fs-extra";
import ora, { Color } from "ora";
import dayjs from "dayjs";
import { Command } from "commander";
import { dirOption } from "./options";
import path from "path";
import { sleep } from "./utils";
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
  let colors: Color[] = ["green", "yellow", "green"];
  let theme = colors[count];
  count--;
  let dirName = "";
  if (repo.includes("/")) {
    let repoArray = repo.split("/");
    dirName = path.join(dest, repoArray[1]);
  }
  // 删除之前存在的目录
  shell.rm("-rf", dirName);

  let startTime = dayjs();
  let loding = ora({
    spinner: {
      interval: 80, // Optional
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    },
  }).start();
  loding.text = message;
  loding.color = theme;
  shell.exec(
    `git clone --depth=1 https://github.com/${repo}.git`,
    {
      async: true,
    },
    async (code) => {
      if (code === 0) {
        loding.succeed("下次成功");
        loding.stop();
      } else {
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
    }
  );
}

export default createCommand;
