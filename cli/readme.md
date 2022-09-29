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

















nodeJs--进步史<sup>[2]</sup>


1,cls    //清屏
2,exit   //退出
3,mkdir  //创建文件夹
4,dir    //查看文件夹列表
5,rmdir  //删除文件夹
6,tasklist   //查看总共多少运行程序 
7,taskkill   //taskkill /f /im chrome.exe  会直接关掉谷歌进程
7,start  //start www.baidu.com  浏览器会打开
8,netstat -ano   //端口号的占用情况



node封装一个控制台进度条插件<sup>[4]</sup>








[1]: https://github.com/Tie-Dan/tdsp-cli
[2]: https://zhuanlan.zhihu.com/p/285194639
[3]: https://github.com/banlify/33-js-concepts
[4]: https://juejin.cn/post/7125309713608081439
