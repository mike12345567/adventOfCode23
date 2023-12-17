const fs = require("fs")

const PART_2 = true

const LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down"

function newBeam(x = 0, y = 0, direction = RIGHT) {
  return { x, y, direction }
}

function mirrors(direction, char) {
  const swaps =
    char === "/"
      ? [
          { a: RIGHT, b: UP },
          { a: LEFT, b: DOWN },
        ]
      : char === "\\"
        ? [
            { a: RIGHT, b: DOWN },
            { a: LEFT, b: UP },
          ]
        : []
  const found = swaps.find(el => el.a === direction || el.b === direction)
  if (!found) {
    return direction
  }
  return found.a === direction ? found.b : found.a
}

function move(direction, x, y) {
  switch (direction) {
    case LEFT:
      return { x: x - 1, y }
    case RIGHT:
      return { x: x + 1, y }
    case UP:
      return { x, y: y - 1 }
    case DOWN:
      return { x, y: y + 1 }
  }
}

function print(maxX, maxY, energised) {
  for (let y = 0; y < maxY; y++) {
    const line = []
    for (let x = 0; x < maxX; x++) {
      if (energised.has(`x${x},y${y}`)) {
        line.push("#")
      } else {
        line.push(".")
      }
    }
    console.log(line.join(""))
  }
}

function generateStarts(maxX, maxY) {
  let starts = []
  for (let x = 0; x < maxX; x++) {
    starts.push(newBeam(x, 0, DOWN ))
    starts.push(newBeam(x, maxY - 1, UP))
  }
  for (let y = 0; y < maxY; y++) {
    starts.push(newBeam(0, y, RIGHT))
    starts.push(newBeam(maxX - 1, y, LEFT))
  }
  return starts
}

function run() {
  const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n")
  const map = lines.map(line => line.split(""))
  const maxX = map[0].length,
    maxY = map.length

  function isDead(beam) {
    return beam.x >= maxX || beam.x < 0 || beam.y >= maxY || beam.y < 0
  }

  const MAX_LOOP = 2000000

  const starts = PART_2 ? generateStarts(maxX, maxY) : newBeam()
  let highest = 0
  for (let start of starts) {
    let beams = [start]
    const energised = new Map()
    energised.set(`x${start.x},y${start.y}`, 1)
    do {
      for (let beam of beams) {
        // branch is dead
        if (isDead(beam)) {
          continue
        }
        const char = map[beam.y][beam.x]
        beam.direction = mirrors(beam.direction, char)
        // check for splitters
        if (
          char === "|" &&
          (beam.direction === LEFT || beam.direction === RIGHT)
        ) {
          beams.push(newBeam(beam.x, beam.y, UP))
          beam.direction = DOWN
        } else if (
          char === "-" &&
          (beam.direction === UP || beam.direction === DOWN)
        ) {
          beams.push(newBeam(beam.x, beam.y, LEFT))
          beam.direction = RIGHT
        } else {
          const movement = move(beam.direction, beam.x, beam.y)
          beam.x = movement.x
          beam.y = movement.y
        }
        if (!isDead(beam)) {
          energised.set(`x${beam.x},y${beam.y}`, 1)
        }
      }
      beams = beams.filter(beam => !isDead(beam))
    } while (beams.find(beam => !isDead(beam)) && beams.length < MAX_LOOP)
    const len = [...energised].length
    if (len > highest) {
      //print(maxX, maxY, energised)
      highest = len
    }
  }
  console.log(`Found routes: ${highest}`)
}

run()
