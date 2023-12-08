const fs = require("fs")

const REMOVE_BRACKETS_REGEX = /\(*\)*/g
const END = "ZZZ"
const PART_2 = true

function lcm(inputs) {
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b)
  }
  function lcm(a, b) {
    return (a * b) / gcd(a, b)
  }
  let result = inputs[0]
  for (let i = 1; i < inputs.length; i++) {
    result = lcm(result, inputs[i])
  }
  return result
}

function part1Solver(instructions, map) {
  let current = "AAA", stepCount = 0, charIdx = 0
  do {
    current = map[current][instructions.charAt(charIdx++)]
    if (charIdx >= instructions.length) {
      charIdx = 0
    }
    stepCount++
  } while (current !== END)
  return stepCount
}

function part2Solver(instructions, starts, map) {
  let pathCounts = []
  for (let start of starts) {
    let found = 0, count = 0, charIdx = 0, current = start
    do {
      const instruction = instructions.charAt(charIdx++)
      if (charIdx >= instructions.length) {
        charIdx = 0
      }
      found = 0
      current = map[current][instruction]
      count++
    } while (!current.endsWith("Z"))
    pathCounts.push(count)
  }
  return lcm(pathCounts)
}

function run() {
  const MAP = {}
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  const instructions = lines.shift()
  const starts = []
  for (let line of lines) {
    if (line === "") {
      continue
    }
    const [node, LR] = line.split(" = ")
    if (node.endsWith("A")) {
      starts.push(node)
    }
    const [L, R] = LR.replaceAll(REMOVE_BRACKETS_REGEX, "").split(", ")
    MAP[node] = { L, R }
  }
  const count = !PART_2 ? part1Solver(instructions, MAP) : part2Solver(instructions, starts, MAP)
  console.log(`Steps to reach end: ${count}`)
}

run()
