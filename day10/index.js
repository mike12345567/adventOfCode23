const fs = require("fs")

const DIRECTION_TRANSFORM = {
  "0-": 0,
  "07": 1,
  "0J": 3,
  "2-": 2,
  "2F": 1,
  "2L": 3,
  "1|": 1,
  "1L": 0,
  "1J": 2,
  "3|": 3,
  "3F": 0,
  37: 2,
}

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

function run() {
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  const height = lines.length
  const width = lines[0].length

  const fullMap = []
  for (let i = 0; i < height; i++) {
    fullMap.push(new Array(width).fill(0))
  }

  let startX = -1
  let startY = -1

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (lines[i].includes("S")) {
        startX = i
        startY = lines[i].indexOf("S")
      }
    }
  }

  const correct = ["-7J", "|LJ", "-FL", "|F7"]
  const startDirections = []

  for (let i = 0; i < 4; i++) {
    const pos = DIRECTIONS[i]
    const x = startX + pos[0]
    const y = startY + pos[1]

    if (
      x >= 0 &&
      x < height &&
      y >= 0 &&
      y < width &&
      correct[i].includes(lines[x][y])
    ) {
      startDirections.push(i)
    }
  }

  const validStarts = startDirections.includes(3)

  let currentDirection = startDirections[0]
  let currentX = startX + DIRECTIONS[currentDirection][0]
  let currentY = startY + DIRECTIONS[currentDirection][1]
  let furthest = 1
  fullMap[startX][startY] = 1

  while (!(currentX === startX && currentY === startY)) {
    fullMap[currentX][currentY] = 1
    furthest += 1
    currentDirection =
      DIRECTION_TRANSFORM[`${currentDirection}${lines[currentX][currentY]}`]
    currentX = currentX + DIRECTIONS[currentDirection][0]
    currentY = currentY + DIRECTIONS[currentDirection][1]
  }

  console.log(`Part 1: ${Math.floor(furthest / 2)}`)

  let enclosedCount = 0

  for (let i = 0; i < height; i++) {
    let enclosed = false

    for (let j = 0; j < width; j++) {
      if (fullMap[i][j]) {
        if (
          "|JL".includes(lines[i][j]) ||
          (lines[i][j] === "S" && validStarts)
        ) {
          enclosed = !enclosed
        }
      } else {
        enclosedCount += enclosed
      }
    }
  }

  console.log(`Part 2: ${enclosedCount}`)
}

run()
