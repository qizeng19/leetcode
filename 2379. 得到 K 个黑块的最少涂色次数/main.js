/**
 * @param {string} blocks
 * @param {number} k
 * @return {number}
 */
var minimumRecolors = function (blocks, k) {
  let left = 0;
  let ans = 0;
  let res = blocks.length;

  for (let right = 0; right < blocks.length; right++) {
    const element = blocks[right];
    if (element === "W") {
      ans += 1; // 入
    }

    if (right - left + 1 === k) {
      res = Math.min(res, ans); // 更

      if (blocks[left] === "W") {
        ans -= 1; // 出
      }
      left++;
    }
  }
  return res;
};
let blocks = "WBBWWBBWBW",
  k = 7;

let ans = minimumRecolors(blocks, k);
console.log(ans);
