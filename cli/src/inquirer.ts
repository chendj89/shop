import inquirer, { Question } from "inquirer";

let list: Question[] = [
  {
    type: "input",
    name: "author",
    message: "作者:",
  },
  {
    type: "input",
    name: "description",
    message: "描述:",
  },
  {
    type: "input",
    name: "version",
    message: "版本号:",
    default: "1.0.0",
  },
];
interface Prompt extends Question {
  choices?: any[];
}
const publish: Prompt[] = [
  {
    type: "list",
    message: "请选择发布项目:",
    name: "repo",
    askAnswered: true,
    choices: ["gitdownload", "cli"],
  },
  {
    type: "input",
    name: "version",
    message: "版本号:",
    default: "1.0.0",
  },
  {
    type: "input",
    name: "type",
    message: "模式:",
    default: "module",
  },
  {
    type: "input",
    name: "scripts",
    message: "npm上传:",
    default: "",
  },
];

export async function userInquirer() {
  return await inquirer.prompt(list);
}
export async function publishInquirer() {
  return await inquirer.prompt(publish).then((ans) => {
    if (ans.repo == "gitdownload") {
      ans.dependencies = {
        shelljs: "^0.8.5",
        ora: "^6.1.2",
        dayjs: "^1.11.5",
        "fs-extra": "^10.1.0",
      };
    }
    return ans;
  });
}
