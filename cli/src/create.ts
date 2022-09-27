import { Command } from "commander";
import { dirOption } from "./options";
import gitDownload from "./gitdownload";
import userOption from "./userOption";
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

export default createCommand;
