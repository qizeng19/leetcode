/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var maximumSubarraySum = function (nums, k) {
  let left = 0;
  let ans = 0;
  let res = 0;
  let map = new Map();

  for (let right = 0; right < nums.length; right++) {
    const element = nums[right];
    ans += element;
    map.set(element, (map.get(element) ?? 0) + 1);

    if (right - k + 1 < 0) {
      continue;
    }
    if (right - left + 1 === k) {
      let size = map.size;
      if (size === k) {
        res = Math.max(res, ans);
      }

      const left_val = nums[left];
      ans -= left_val;
      left++;

      let v = map.get(left_val);
      if (v > 1) {
        map.set(left_val, v - 1);
      } else {
        map.delete(left_val);
      }
    }
  }
  return res;
};
