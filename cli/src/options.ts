import path from "path";
import { Option } from "commander";
import fs from "fs-extra";

/**
 * 连接符\n\t\t\t
 */
let lineFlag = `\n\t\t\t`;

// 目录
let dirOption = new Option("-d,--dir <string>", "资源目录")
  .default(process.cwd())
  .argParser((value: string) => {
    if (value === ".") {
      // 返回当前目录
      return process.cwd();
    } else {
      let dir = path.join(process.cwd(), value);
      // 判断相对目录是否存在-子目录、相对目录
      if (fs.existsSync(dir)) {
        return dir;
      } else {
        return value;
      }
    }
  });
// 端口
let portOption = new Option("-p,--port <number>", "端口号").default(8089);
// 目录
let rootOption = new Option("-r,--root <string>", "根目录").default("");
// 名称
let fromOption = new Option("-f,--from <string>", "仓库名").default("");

// "-d 目录地址(default:'.')"

let getOptionInfo = (option: Option | Option[]) => {
  if (option instanceof Array) {
    return option.map((item) => {
      return (
        lineFlag +
        `${item.flags} ${item.description}(default:${item.defaultValue})`
      );
    });
  } else {
    return (
      lineFlag +
      `${option.flags} ${option.description}(default:${option.defaultValue})`
    );
  }
};

export {
  lineFlag,
  dirOption,
  portOption,
  rootOption,
  fromOption,
  getOptionInfo,
};
