var findMaxAverage = function (nums, k) {
  let maxS = -Infinity; // 窗口元素和的最大值
  let s = 0; // 维护窗口元素和
  for (let i = 0; i < nums.length; i++) {
    // 1. 进入窗口
    s += nums[i];
    if (i < k - 1) {
      // 窗口大小不足 k
      continue;
    }
    // 2. 更新答案
    maxS = Math.max(maxS, s);
    // 3. 离开窗口
    s -= nums[i - k + 1];
  }
  return maxS / k;
};

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/maximum-average-subarray-i/solutions/3061219/mo-ban-ding-chang-hua-dong-chuang-kou-py-1jxk/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
var findMaxAverage2 = function (nums, k) {
  let left = 0;
  let ans = 0;
  let res = -Infinity;

  for (let right = 0; right < nums.length; right++) {
    ans += nums[right];

    if (right - left + 1 === k) {
      res = Math.max(ans, res);

      ans -= nums[left];
      left++;
    }
  }
  return res / k;
};
