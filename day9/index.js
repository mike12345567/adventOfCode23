const fs = require("fs")

const PART_2 = true

function getDifferences(sequence) {
  let differences = []
  for (let i = 1; i < sequence.length; i++) {
    const last = sequence[i]
    const secondLast = sequence[i - 1]
    const diff = PART_2 ? secondLast - last : last - secondLast
    differences.push(diff)
  }
  return differences
}

function run() {
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  let sum = 0
  for (let line of lines) {
    let sequence = line
      .trim()
      .split(" ")
      .map(el => parseInt(el))
    if (PART_2) {
      sequence = sequence.reverse()
    }
    let latest = getDifferences(sequence),
      allDifferences = [sequence, latest]
    do {
      latest = getDifferences(latest)
      allDifferences.push(latest)
    } while (latest.find(el => el !== 0))
    let value = 0
    for (let difference of allDifferences.reverse()) {
      const len = difference.length
      const last = difference[len - 1]
      value = PART_2 ? last - value : last + value
    }
    sum += value
  }
  console.log(`The sum is: ${sum}`)
}

run()
