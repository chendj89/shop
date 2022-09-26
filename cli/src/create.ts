import shell from "shelljs";
import fs from "fs-extra";
import ora from "ora";
import dayjs from "dayjs";
import { Command, Option } from "commander";

const createCommand = new Command("create");

async function download({ repo }) {
  let startTime = dayjs();
  let loding = ora().start();
  shell.exec(`git clone --depth=1 https://github.com/${repo}.git`, {
    async: true,
  });
}
