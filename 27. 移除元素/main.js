/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function (nums, val) {
  let k = 0; //慢指针
  let len = nums.length;
  for (let i = 0; i < len; i++) {
    if (val != nums[i]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
};
