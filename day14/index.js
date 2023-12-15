const fs = require("fs")

function rotate(lines) {
  const length = lines.length
  const charLength = lines[0].length
  let rotated = Array.from(
    {
      length: charLength,
    },
    () =>
      Array.from(
        {
          length,
        },
        () => "?"
      )
  )
  for (let line = 0; line < length; line++) {
    for (let char = 0; char < charLength; char++) {
      rotated[char][length - 1 - line] = lines[line][char]
    }
  }
  return rotated
}

function roll(lines) {
  const length = lines.length
  const charLength = lines[0].length
  for (let char = 0; char < charLength; char++) {
    for (let line = 0; line < length; line++) {
      for (let i = 0; i < length; i++) {
        if (lines[i][char] === "O" && i > 0 && lines[i - 1][char] === ".") {
          lines[i][char] = "."
          lines[i - 1][char] = "O"
        }
      }
    }
  }
  return lines
}

function score(lines) {
  let ans = 0
  const length = lines.length
  const charLength = lines[0].length
  for (let line = 0; line < length; line++) {
    for (let char = 0; char < charLength; char++) {
      if (lines[line][char] === "O") {
        ans += length - line
      }
    }
  }
  return ans
}

function main() {
  let lines = fs.readFileSync("input.txt", "utf8").trim().split("\n")
  lines = lines.map(row => [...row])

  let grid = new Map()
  const target = Math.pow(10, 9)
  let current = 0

  while (current < target) {
    current += 1
    for (let rotation = 0; rotation < 4; rotation++) {
      lines = roll(lines)
      if (current === 1 && rotation === 0) {
        console.log(`Part 1 score: ${score(lines)}`)
      }
      lines = rotate(lines)
    }

    const line = lines.map(row => row.join("")).join("\n")
    if (grid.has(line)) {
      const cycleLength = current - grid.get(line)
      const amt = Math.floor((target - current) / cycleLength)
      current += amt * cycleLength
    }
    grid.set(line, current)
  }
  console.log(`Part 2 final score: ${score(lines)}`)
}

main()
