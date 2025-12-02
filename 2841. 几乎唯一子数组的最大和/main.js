/**
 * @param {number[]} nums
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var maxSum = function (nums, m, k) {
  let left = 0;
  let ans = 0;
  let res = 0;
  let cnt = new Map();

  for (let right = 0; right < nums.length; right++) {
    const element = nums[right];
    ans += element; // 入
    cnt.set(element, (cnt.get(element) ?? 0) + 1); // 入

    if (right - left + 1 === k) {
      if (cnt.size >= m) {
        res = Math.max(ans, res); // 更新
      }

      // 出
      let left_val = nums[left];
      const c = cnt.get(left_val);
      if (c > 1) {
        cnt.set(left_val, c - 1);
      } else {
        cnt.delete(left_val);
      }

      ans -= nums[left];

      left++;
    }
  }
  return res;
};

let nums = [1, 2, 2, 1],
  m = 2,
  k = 2;
var cc = maxSum(nums, m, k);
console.log("cc:", cc);
