var numOfSubarrays = function (arr, k, threshold) {
  let ans = 0;
  let s = 0; // 维护窗口元素和
  for (let i = 0; i < arr.length; i++) {
    // 1. 进入窗口
    s += arr[i];
    if (i < k - 1) {
      // 窗口大小不足 k
      continue;
    }
    // 2. 更新答案
    if (s >= k * threshold) {
      ans++;
    }
    // 3. 离开窗口
    s -= arr[i - k + 1];
  }
  return ans;
};

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/solutions/3061222/mo-ban-ding-chang-hua-dong-chuang-kou-py-85sh/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

var numOfSubarrays2 = function (arr, k, threshold) {
  let left = 0;
  let ans = 0;
  let res = 0;

  for (let right = 0; right < arr.length; right++) {
    const element = arr[right];
    ans += element; // 入

    if (right - left + 1 === k) {
      if (ans >= k * threshold) {
        res++; // 更新
      }
      ans -= arr[left]; // 出
      left++; // 出
    }
  }
  return res;
};
