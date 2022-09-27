import { Command } from "commander";
import { dirOption, getOptionInfo } from "./options";
import fs from "fs-extra";
import { blue } from "./colors";
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
      console.log(blue(values));
    }
  });
export default lsCommand;
