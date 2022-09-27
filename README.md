### shop

##### Yarn Workspace 使用指南<sup>[1]</sup>

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

如何让node_modules只能通过yarn安装，禁止npm安装？<sup>[2]</sup>

[1]: https://zhuanlan.zhihu.com/p/381794854
[2]: https://segmentfault.com/q/1010000041816329?utm_source=sf-similar-question