use std::collections::HashMap;
impl Solution {
    pub fn is_valid(s: String) -> bool {
        let mut st = Vec::with_capacity(s.len());
        // let map = HashMap::from([
        //     (')', '('),
        //     ('}', '{'),
        //     (']', '['),
        // ]);
        let map: HashMap<char, char> = [
            (')', '('),
            (']', '['),
            ('}', '{'),
        ]
            .into_iter()
            .collect();
        for c in s.chars() {
            if let Some(&need) = map.get(&c) {
                // 如果栈为空，说明没有匹配的左括号
                if let Some(top) = st.pop() {
                    if top != need {
                        return false;
                    }
                } else {
                    return false;
                }
            } else if c == '(' || c == '{' || c == '[' {
                st.push(c);
            } else {
                return false;
            }
        }
        st.is_empty()
    }
}
