#### cli 

`cc -h`获得更多帮助信息
- 静态服务器
`cc serve`

- 下载github仓库
```ts
/**
 * 下载github仓库
 * @param {*} opts 对象参数
 * @param {string} opts.repo 仓库地址 用户名/仓库名
 * @param {string} opts.message 下载提示消息 "开始下载"
 * @param {string} opts.dest 存放目录 当前目录
 * @param {number} opts.count 失败后，尝试下载次数 1
 * @param {Function} opts.success 下载成功后的回调函数
 */
import gitDownload from "./gitdownload";

gitDownload({
  //...参数
});
```

































[1]: https://github.com/Tie-Dan/tdsp-cli



