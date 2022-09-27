import { Command } from "commander";
import { dirOption, getOptionInfo } from "./options";
import fs from "fs-extra";
import { blue, red } from "./colors";
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
      } else {
        console.log(red("无"));
      }
    }
    process.exit(1);
  });
export default lsCommand;
