import { Command } from "commander";
import { version } from "../package.json";
import serveCommand from "./serve";
const program = new Command();

program.addCommand(serveCommand);
program.version(version);
program.parse(process.argv);
