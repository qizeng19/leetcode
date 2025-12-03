/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var getAverages = function (nums, k) {
  let c = 2 * k + 1;
  let left = 0;
  let ans = 0;
  let arr = Array(nums.length).fill(-1);

  for (let right = 0; right < nums.length; right++) {
    const element = nums[right];

    ans += element;
    if (right < k * 2) {
      continue;
    }
    if (right - left + 1 === c) {
      arr[right - k] = Math.floor(ans / c);

      ans -= nums[left];
      left++;
    }
  }
  return arr;
};
let nums = [7, 4, 3, 9, 1, 8, 5, 2, 6],
  k = 3;
var b = getAverages(nums, k);
console.log(b);
