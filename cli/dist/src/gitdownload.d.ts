import { Dayjs } from "dayjs";
/**
 * 下载github仓库
 * @param {*} opts 对象参数
 * @param {string} opts.repo 仓库地址 用户名/仓库名
 * @param {string} opts.message 下载提示消息 "开始下载"
 * @param {string} opts.dest 存放目录 当前目录
 * @param {number} opts.count 失败后，尝试下载次数 1
 * @param {Function} opts.success 下载成功后的回调函数
 */
export default function gitDownload({ repo, message, dest, count, success, startTime, }: {
    /**
     * 仓库
     */
    repo: `${string}/${string}`;
    /**
     * 存放目录
     */
    dest: string;
    /**
     * 消息
     */
    message?: string;
    /**
     * 重复下载次数
     */
    count?: number;
    /**
     * 成功下载后回调函数
     */
    success?: () => any;
    /**
     * 开始时间
     */
    startTime?: Dayjs;
}): Promise<void>;
