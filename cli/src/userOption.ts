import inquirer from "inquirer";

let list = [
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
    default:"1.0.0"
  },
];
export default async function userOption() {
  return await inquirer.prompt(list);
}
