/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
  let left = 0;
  let ansLeft=-1;
  const m = s.length;
  let ansRight=m

  const cntS = Array(128).fill(0);
  const cntT = Array(128).fill(0);

  for(const c of t) {
    cntT[c.codePointAt(0)]++
  }



  for(let right=0;right<m;right++) {
    cntS[s[right].charPointAt(0)]++;
    while(isCover(cntS, cntT)) {
      if(right-left < ansRight - ansLeft) {
        ansLeft = left
        ansRight = right
      }
      cntS[s[left].codePointAt(0)]--;
      left++;
    }

  }
  return ansLeft<0 ? "" : s.subString(ansLeft, ansRight+1);
};

function isCovered(s, t) {
    for(let i='A'.codePointAt(0);i<'Z'.codePointAt(0); i++) {
      if(s[i] < t[i]) return false
    }
    for(let i='a'.codePointAt(0);i<'z'.codePointAt(0); i++) {
      if(s[i] < t[i]) return false
    }
    return true
}
