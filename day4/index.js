const fs = require("fs")

function fixSpaces(str) {
  return str.trim().replaceAll(/ +/g, " ")
}

function run() {
  const input = fs.readFileSync("./input.txt", "utf8")
  const lines = input.split("\n")

  let sum = 0
  for (let line of lines) {
    const [winning, mine] = line.split("|")
    const [card, numbers] = winning.split(":")
    const winningNumbers = fixSpaces(numbers).split(" ")
    const myNumbers = fixSpaces(mine).split(" ")
    const filtered = myNumbers.filter(num => winningNumbers.indexOf(num) !== -1)
    if (filtered.length === 0) {
      continue
    }
    if (filtered.length === 1) {
      sum += 1
    } else {
      sum += Math.pow(2, filtered.length - 1)
    }
  }
  console.log(`Sum is: ${sum}`)
}

run()
