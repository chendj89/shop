import { Command } from "commander";
import { version } from "../package.json";
import serveCommand from "./serve";
import createCommand from "./create";
const program = new Command();

program.addCommand(serveCommand).addCommand(createCommand);
program.version(version);
program.parse(process.argv);
