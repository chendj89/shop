import path from "path";
import { Option } from "commander";
import fs from "fs-extra";

// 目录
let dirOption = new Option("-d,--dir <string>", "请输入资源目录")
  .default(process.cwd())
  .argParser((value: string) => {
    if (value === ".") {
      // 返回当前目录
      return process.cwd();
    } else {
      if (value.startsWith("./")) {
        return path.join(process.cwd(), value);
      } else {
        const dir = path.join(process.cwd(), value);
        if (fs.existsSync(dir)) {
          return dir;
        }
        return value;
      }
    }
  });
// 端口
let portOption = new Option("-p,--port <number>", "请输入端口号").default(8089);
// 目录
let rootOption = new Option("-r,--root <string>", "根目录").default("");
export { dirOption, portOption, rootOption };
