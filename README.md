### shop

##### [Yarn Workspace 使用指南](https://zhuanlan.zhihu.com/p/381794854)

- `"private": true` Workspace 才会生效
- 其中`"packages/*"`是社区的常见写法，也可以枚举所有`package： "workspaces": ["package-a", "package-b"]`

1、添加依赖模块

```shell
# 向cli中安装shelljs 其他包则不安装
yarn workspace cli add -D shelljs
```

2、执行包中的脚本命令

```shell
yarn workspace cli run test
```





#### 调试

```shell
# 进入cli所在目录,用管理员身份运行cmd指令
npm link
```