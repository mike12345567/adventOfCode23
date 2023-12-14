const fs = require("fs")

function fixSpaces(str) {
  return str.trim().replaceAll(/ +/g, " ")
}

function run() {
  const input = fs.readFileSync("./input.txt", "utf8")
  const lines = input.split("\n")

  let sum = 0
  let copies = {}
  for (let line of lines) {
    const [winning, mine] = line.split("|")
    const [card, numbers] = winning.split(":")
    const cardNumber = parseInt(fixSpaces(card).split(" ")[1])
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
    // count how many copies win also
    const wins = 1 + (copies[cardNumber] || 0)
    // add copies
    for (let i = 1; i < filtered.length + 1; i++) {
      if (!copies[cardNumber + i]) {
        copies[cardNumber + i] = 1 * wins
      } else {
        copies[cardNumber + i] += 1 * wins
      }
    }
  }
  const cardCount =
    lines.length + Object.values(copies).reduce((prev, el) => prev + el, 0)
  console.log(`Card count is: ${cardCount}`)
  console.log(`Sum is: ${sum}`)
}

run()
