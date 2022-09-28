import { Command } from "commander";
import shell from "shelljs";
import fs from "fs-extra";
import path from "path";
import { publishInquirer } from "./inquirer";
import { dirOption, getOptionInfo } from "./options";
import publishPkg from "./pkg/publish.json";
/**
 * 列表指令
 */
const publishCommand = new Command("publish");
publishCommand
  .description("发布版本:" + getOptionInfo([dirOption]))
  .addOption(dirOption)
  .action(async (opts) => {
    let join = (str: string) => {
      return path.join(opts.dir, str);
    };
    let ans = await publishInquirer();
    let option: any = {
      ...ans,
      name: `@chencc/${ans.repo}`,
      main: "./",
      repository: {
        type: "git",
        url: `https://github.com/chendj89/${ans.repo}.git`,
      },
    };
    Object.assign(publishPkg, option);
    shell.rm("-rf", join(""));
    shell.mkdir([join(""), join("/dist")]);
    shell.cp(
      "-f",
      path.join(process.cwd(), "cli/dist/gitdownload.cjs.js"),
      join("/dist/index.js")
    );
    shell.cp(
      "-f",
      path.join(process.cwd(), "cli/dist/src/gitdownload.d.ts"),
      join("/dist/index.d.ts")
    );
    fs.writeFileSync(
      join("/package.json"),
      JSON.stringify(publishPkg, null, 2),
      "utf-8"
    );
    process.exit(1);
  });
export default publishCommand;
