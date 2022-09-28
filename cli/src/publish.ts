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
      path.join(process.cwd(), "cli/dist/gitdownload.js"),
      join("/dist/gitdownload.js")
    );
    shell.cp(
      "-f",
      path.join(process.cwd(), "cli/dist/src/gitdownload.d.ts"),
      join("/dist/gitdownload.d.ts")
    );
    fs.writeFileSync(
      join("/package.json"),
      JSON.stringify(publishPkg, null, 2),
      "utf-8"
    );

    setTimeout(() => {
      console.log(option.scripts.publish);

      shell.cd(opts.dir);
      shell.exec("npm publish");
    }, 1000);
  });
export default publishCommand;
