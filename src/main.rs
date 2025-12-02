impl Solution {
    pub fn min_sub_array_len(target: i32, nums: Vec<i32>) -> i32 {
        let n = nums.len();
        let mut ans = n + 1;
        let mut sum = 0; // 子数组元素和
        let mut left = 0; // 子数组左端点
        for (right, &x) in nums.iter().enumerate() {
            // 枚举子数组右端点
            sum += x;
            while sum - nums[left] >= target {
                // 尽量缩小子数组长度
                sum -= nums[left];
                left += 1; // 左端点右移
            }
            if sum >= target {
                ans = ans.min(right - left + 1);
            }
        }
        if ans <= n {
            ans as i32
        } else {
            0
        }
    }
}

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/minimum-size-subarray-sum/solutions/1959532/biao-ti-xia-biao-zong-suan-cuo-qing-kan-k81nh/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
