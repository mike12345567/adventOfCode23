const fs = require("fs")

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

function run() {
  const lines = fs.readFileSync("input.txt", "utf8").trim().split("\n")
  const map = lines.map(line => line.split(""))
  const maxX = map[0].length,
    maxY = map.length
  const energised = new Map()
  energised.set("x0,y0", 1)

  function isDead(beam) {
    return beam.x >= maxX || beam.x < 0 || beam.y >= maxY || beam.y < 0
  }

  const MAX_LOOP = 2000000
  let beams = [newBeam()]
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
  print(maxX, maxY, energised)
  console.log(`Found routes: ${[...energised].length}`)
}

run()
