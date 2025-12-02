/**
 * @param {number[]} cardPoints
 * @param {number} k
 * @return {number}
 */
var maxScore = function (cardPoints, k) {
  // 这道题就是转换一下思路
  // 找到 length -k 这个窗口中最小的和 反过来就是抽取到的最大的和
  let len = cardPoints.length;
  let c = len - k;
  let total = cardPoints.reduce((cur, acc) => {
    return cur + acc;
  }, 0);
  if (c === 0) return total;
  let left = 0;
  let ans = 0;
  let res = total;

  for (let right = 0; right < cardPoints.length; right++) {
    const element = cardPoints[right];
    ans += element;

    if (right - c + 1 < 0) {
      continue;
    }
    if (right - left + 1 === c) {
      res = Math.min(ans, res);

      ans -= cardPoints[left];
      left++;
    }
  }

  return total - res;
};

let aaa = [9, 7, 7, 9, 7, 7, 9],
  k = 7;

var a = maxScore(aaa, k);
console.log("a::", a);
