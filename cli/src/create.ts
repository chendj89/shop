import { Command } from "commander";
import { dirOption, fromOption, getOptionInfo } from "./options";
import gitDownload from "./gitdownload";
import userOption from "./userOption";
import { red } from "./colors";
/**
 * 创建模板指令
 */
const createCommand = new Command("create");

createCommand
  .description("创建模板" + getOptionInfo([dirOption, fromOption]))
  .addOption(dirOption)
  .addOption(fromOption)
  .action((opts) => {
    console.log(opts);
    if (opts.from) {
      gitDownload({
        repo: opts.from,
        dest: opts.dir,
        success: async () => {
          let ans = await userOption();
          return ans;
        },
      });
    }else {
      console.log(red(`需要仓库名，例如：cc create -f chendj89/cli`))
    }
  });

export default createCommand;
