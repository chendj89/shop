import http from "http";
import path from "path";
import mime from "mime";
// fs
import fs from "fs-extra";
import { Command } from "commander";
import { dirOption, portOption, rootOption,getOptionInfo } from "./options";
/**
 * 静态服务器
 */
const serveCommand = new Command("serve");

serveCommand
  .version("0.0.1")
  .description(
   "静态服务器"+getOptionInfo([dirOption,portOption,rootOption])
  )
  .addOption(dirOption)
  .addOption(portOption)
  .addOption(rootOption)
  .action((opts) => {
    http
      .createServer(async (req: any, res: any) => {
        // 请求地址
        let urlString = req.url;
        // 文件地址或路由地址
        let filePathName = path.join(opts.dir, urlString);
        // 数据和数据类型
        let { data, mimeType } = await readStaticFile(filePathName);
        if (data && mimeType) {
          res.writeHead(200, {
            "Content-Type": `${mimeType};charset="utf-8"`,
          });
          res.end(data);
        } else {
          if (mimeType || mimeType !== "text/html") {
            res.writeHead(404, {
              "Content-Type": `${mimeType};charset="utf-8"`,
            });
            res.end(undefined);
          } else {
            res.writeHead(200, { "Content-Type": `text/html;charset="utf-8"` });
            let indexHtml = path.join(opts.dir, "./index.html");
            if (fs.existsSync(indexHtml)) {
              res.end(fs.readFileSync(indexHtml, "utf-8"));
            } else {
              res.end("404", "utf-8");
            }
          }
        }
      })
      .listen(opts.port, () => {
        console.log(`localhost:${opts.port}`);
      });
  });
/**
 * 读取文件
 * @param filePathName
 * @returns
 */
async function readStaticFile(filePathName: any) {
  let ext = path.parse(filePathName).ext;
  if (ext) {
    let mimeType = mime.getType(ext);
    // 判断是否存在文件
    if (fs.existsSync(filePathName)) {
      let data = fs.readFileSync(filePathName, "utf-8");
      return { data, mimeType };
    } else {
      return { data: undefined, mimeType };
    }
  }
  return {
    ext,
    data: "",
  };
}
export default serveCommand;
