/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  let stack = [];
  let map = {
    ")": "(",
    "]": "[",
    "}": "{",
  };
  for (let i = 0; i < s.length; i++) {
    if (map[s[i]]) {
      // 如果是右括号，则出栈
      let data = stack.pop();
      if (data != map[s[i]]) return false; // 如果出栈的元素不等于对应的左括号，则返回 false
    } else {
      stack.push(s[i]); // 如果是左括号，则入栈
    }
  }
  return stack.length === 0;
};
