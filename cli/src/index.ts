import { Command } from "commander";
import { version } from "../package.json";
import serveCommand from "./serve";
import createCommand from "./create";
import rmCommand from "./rm";
import lsCommand from "./ls";
import { lineFlag } from "./options";
import { yellow, blue } from "./colors";
import shell from "shelljs";
const program = new Command();
program
  .addCommand(serveCommand)
  .addCommand(createCommand)
  .addCommand(lsCommand)
  .addCommand(rmCommand);
program.version(version);
program.parse(process.argv);
