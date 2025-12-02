var maxVowels = function (s, k) {
  let ans = 0,
    vowel = 0;
  for (let i = 0; i < s.length; i++) {
    // 枚举窗口右端点 i
    // 1. 右端点进入窗口
    if (
      s[i] === "a" ||
      s[i] === "e" ||
      s[i] === "i" ||
      s[i] === "o" ||
      s[i] === "u"
    ) {
      vowel++;
    }

    const left = i - k + 1; // 窗口左端点
    if (left < 0) {
      // 窗口大小不足 k，尚未形成第一个窗口
      continue;
    }

    // 2. 更新答案
    ans = Math.max(ans, vowel);

    // 3. 左端点离开窗口，为下一个循环做准备
    let out = s[left];
    if (
      out === "a" ||
      out === "e" ||
      out === "i" ||
      out === "o" ||
      out === "u"
    ) {
      vowel--;
    }
  }
  return ans;
};

// 作者：灵茶山艾府
// 链接：https://leetcode.cn/problems/maximum-number-of-vowels-in-a-substring-of-given-length/solutions/2809359/tao-lu-jiao-ni-jie-jue-ding-chang-hua-ch-fzfo/
// 来源：力扣（LeetCode）
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
var maxVowels2 = function (s, k) {
  // 输入：s = "abciiidef", k = 3
  let left = 0;
  let ans = 0;
  let res = 0;

  for (let right = 0; right < s.length; right++) {
    if (
      s[right] === "a" ||
      s[right] === "e" ||
      s[right] === "i" ||
      s[right] === "o" ||
      s[right] === "u"
    ) {
      ans++;
    }

    if (right - left + 1 == k) {
      res = Math.max(ans, res);

      if (
        s[left] === "a" ||
        s[left] === "e" ||
        s[left] === "i" ||
        s[left] === "o" ||
        s[left] === "u"
      ) {
        ans--;
      }
      left++;
    }
  }
  return res;
};
