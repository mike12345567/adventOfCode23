const fs = require("fs")

const weakToStrong = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]

function pairCharacters(hand) {
  const map = {}
  for (let char of hand) {
    if (!map[char]) {
      map[char] = 0
    }
    map[char]++
  }
  return map
}

function strength(char) {
  return weakToStrong.indexOf(char) + 1
}

function determineRank(hand, pairs) {
  const counts = []
  for (let count of Object.values(pairs)) {
    if (count === 1) {
      continue
    }
    counts.push(count)
  }
  counts.sort((a, b) => b - a)
  switch (counts.toString()) {
    case "5":
      return 7
    case "4":
      return 6
    case "3,2":
      return 5
    case "3":
      return 4
    case "2,2":
      return 3
    case "2":
      return 2
    default:
      return 1
  }
  return highest
}

function run() {
  const input = fs.readFileSync("./input.txt", "utf8")
  const lines = input.split("\n")

  const ranks = []
  for (let line of lines) {
    const [hand, bid] = line.trim().split(" ")
    const pairs = pairCharacters(hand)
    const rank = determineRank(hand, pairs)
    ranks.push({ rank, hand, bid })
  }
  // sort hands
  const sorted = ranks.sort((a, b) => {
    if (a.rank < b.rank) {
      return -1
    }
    if (a.rank > b.rank) {
      return 1
    }
    let idx = 0
    for (let char of a.hand) {
      const bChar = b.hand[idx]
      if (char !== bChar) {
        return strength(char) - strength(bChar)
      }
      idx++
    }
  })
  let sum = 0
  let count = 0
  for (let ranked of sorted) {
    sum += parseInt(ranked.bid) * (count + 1)
    console.log(count, ranked.hand, ranked.bid, sum)
    count++
  }
  console.log(`The sum of bids is: ${sum}`)
}

run()
