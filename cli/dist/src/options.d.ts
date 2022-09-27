import { Option } from "commander";
/**
 * 连接符\n\t\t\t
 */
declare let lineFlag: string;
declare let dirOption: Option;
declare let portOption: Option;
declare let rootOption: Option;
declare let nameOption: Option;
declare let getOptionInfo: (option: Option | Option[]) => string | string[];
export { lineFlag, dirOption, portOption, rootOption, nameOption, getOptionInfo, };
