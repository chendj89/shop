/**
 * 睡眠
 * @param time 1秒
 * @returns
 */
export function sleep(time: number = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}
