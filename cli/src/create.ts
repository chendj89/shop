import { Command } from "commander";
import { dirOption, nameOption, getOptionInfo } from "./options";
import gitDownload from "./gitdownload";
import userOption from "./userOption";
/**
 * 创建模板指令
 */
const createCommand = new Command("create");

createCommand
  .description("创建模板" + getOptionInfo([dirOption, nameOption]))
  .addOption(dirOption)
  .addOption(nameOption)
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
