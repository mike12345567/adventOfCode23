const fs = require("fs")

const REMOVE_BRACKETS_REGEX = /\(*\)*/g
const END = "ZZZ"

function run() {
  const MAP = {}
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  const instructions = lines.shift()
  for (let line of lines) {
    if (line === "") {
      continue
    }
    const [node, LR] = line.split(" = ")
    const [L, R] = LR.replaceAll(REMOVE_BRACKETS_REGEX, "").split(", ")
    MAP[node] = { L, R }
  }
  let current = "AAA", stepCount = 0, charIdx = 0
  do {
    current = MAP[current][instructions.charAt(charIdx)]
    charIdx++
    if (charIdx >= instructions.length) {
      charIdx = 0
    }
    stepCount++
  } while (current !== END)
  console.log(`Steps to reach ZZZ: ${stepCount}`)
}

run()
