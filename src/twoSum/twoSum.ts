import * as readline from 'readline'

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

export const isTwoSum1 = (nums: number[], target: number): number[][] => {
  const result: number[][] = []
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        result.push([i, j])
      }
    }
  }
  return result
}

export const isTwoSum2 = (nums: number[], target: number): number[][] => {
  const result: number[][] = []
  const map = new Map<number, number>()

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i]
    if (map.has(complement)) {
      result.push([map.get(complement)!, i])
    }
    map.set(nums[i], i)
  }

  return result
}

read.question('Nums: ', (numsInput) => {
  const nums = numsInput.split(' ').map(Number)

  read.question('Target: ', (targetInput) => {
    const target = Number(targetInput)

    console.log(`Output isTwoSum1: ${JSON.stringify(isTwoSum1(nums, target))}`)
    console.log(`Output isTwoSum2: ${JSON.stringify(isTwoSum2(nums, target))}`)

    read.close()
  })
})
