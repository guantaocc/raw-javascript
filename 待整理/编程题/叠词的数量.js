/**
 * 
Input: 'abcdaaabbccccdddefgaaa'
Output: 4

1. 输出叠词的数量
2. 输出去重叠词的数量
3. 用正则实现
 */

let str = 'abcdaaabbccccdddefgaaabaacb'

// 栈实现
function calcSameWord(str){
  let stack = []
  let count = 0
  let uniqueCount = 0
  for(let i = 0; i < str.length; i++){
    let char = str.charAt(i)
    if(stack.length === 0){
      stack.push(char)
    }else {
      // 判断栈中的字符相同则入栈
      if(stack[stack.length - 1] === char){
        stack.push(char)
      }else {
        if(stack.length > 1){
          count++
        }
        // clear stack
        while(stack.length > 0){
          stack.pop()
        }
        stack.push(char)
        uniqueCount++
      }
    }
  }
  if(stack.length > 1){
    // 栈中最后一个叠词
    count++
  }
  if(stack.length > 0){
    uniqueCount++
  }
  console.log(stack)
  return {
    count,
    uniqueCount
  }
}

// 正则实现
function calcSameWordByRegxp(str){
  let count = 0
  let uniqueCount = 0
  let regx = /([\w\W])\1+/g
  let regx2 = /([\w\W])(?!\1+)/g

  let matchSame = str.match(regx)
  let matchNotSame = str.match(regx2)

  count = matchSame ? matchSame.length : 0
  uniqueCount = matchNotSame ? matchNotSame.length : 0
  return {
    count,
    uniqueCount
  }
}

// console.log(calcSameWord(str))

console.log(calcSameWordByRegxp(str))