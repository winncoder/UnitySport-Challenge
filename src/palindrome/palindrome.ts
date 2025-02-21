import * as readline from 'readline'
const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const isPalindrome1 = (txt: string): boolean => {
  let reverse = ''
  for (let i = txt.length - 1; i >= 0; i--) {
    reverse += txt[i]
  }
  return txt === reverse
}

export const isPalindrome2 = (txt: string): boolean => {
  // level
  // 0 == 4
  // 1 == 3
  // 2 == 2
  for (let i = 0; i < txt.length / 2; i++) {
    if (txt[i] !== txt[txt.length - 1 - i]) {
      return false
    }
  }
  return true
}

read.question('Input: ', (input) => {
  console.log(`Output isPalindrome1: ${isPalindrome1(input)}`)
  console.log(`Output isPalindrome2: ${isPalindrome2(input)}`)
  read.close()
})
