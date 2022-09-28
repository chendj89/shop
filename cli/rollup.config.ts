import { defineConfig } from "rollup";
// 引入json
import json from "@rollup/plugin-json";
// ts转js并生成dts
import tsc from "rollup-plugin-typescript2";
// 导出配置

export default defineConfig([
  {
    input: "./src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      banner: "#! /usr/bin/env node",
    },
    external: ["http", "path", "mime", "fs", "commander"],
    plugins: [json(), tsc()],
  },
  {
    input: "./src/gitdownload.ts",
    output: {
      file: "dist/gitdownload.js",
      format: "es",
    },
    external: ["http", "path", "mime", "fs", "commander"],
    plugins: [json(), tsc()],
  },
  {
    input: "./src/gitdownload.ts",
    output: {
      file: "dist/gitdownload.cjs.js",
      format: "cjs",
      exports: "default",
    },
    external: ["http", "path", "mime", "fs", "commander"],
    plugins: [json(), tsc()],
  },
]);
