import { Command } from "commander";
import { dirOption } from "./options";
import shell from "shelljs";
/**
 * 删除指令
 */
const rmCommand = new Command("rm");
rmCommand
  .description(["删除目录", "-d 目录地址(default:'.')"].join("\n\t\t\t"))
  .addOption(dirOption)
  .action((opts) => {
    shell.rm("-rf", `${opts.dir}`);
    process.exit(1);
  });

export default rmCommand;
