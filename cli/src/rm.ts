import { Command } from "commander";
import { dirOption, getOptionInfo } from "./options";
import shell from "shelljs";
/**
 * 删除指令
 */
const rmCommand = new Command("rm");
rmCommand
  .description("删除目录"+getOptionInfo(dirOption))
  .addOption(dirOption)
  .action((opts) => {
    shell.rm("-rf", `${opts.dir}`);
    process.exit(1);
  });

export default rmCommand;
