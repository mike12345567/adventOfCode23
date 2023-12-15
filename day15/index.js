const fs = require("fs")

/**
 * perform the HASH
 * @param {String} string
 */
function HASH(string) {
  let currentValue = 0
  for (let i = 0; i < string.length; i++) {
    currentValue = ((currentValue + string.charCodeAt(i)) * 17) % 256
  }
  return currentValue
}

function run() {
  const line = fs.readFileSync("input.txt", "utf8").trim().replaceAll("\n", "")
  const strings = line.split(",")
  let part1Sum = 0,
    boxes = {}
  for (let string of strings) {
    part1Sum += HASH(string)
    const operator = string.includes("=") ? "=" : "-"
    const [label, focalLength] = string.split(operator)
    const boxNumber = HASH(label)
    if (!boxes[boxNumber]) {
      boxes[boxNumber] = []
    }
    const found = boxes[boxNumber].find(el => label === el.label)
    if (operator === "=") {
      if (found) {
        found.focalLength = focalLength
      } else {
        boxes[boxNumber].push({ label, focalLength })
      }
    } else if (operator === "-") {
      const idx = boxes[boxNumber].indexOf(found)
      if (idx !== -1) {
        boxes[boxNumber].splice(idx, 1)
      }
    }
  }
  let part2Sum = 0
  for (let i = 0; i < 256; i++) {
    if (!boxes[i]) {
      continue
    }
    const box = boxes[i]
    for (let slot = 0; slot < box.length; slot++) {
      const focal = box[slot].focalLength
      part2Sum += (i + 1) * (slot + 1) * focal
    }
  }
  console.log(`Final part 1 sum is: ${part1Sum}`)
  console.log(`Final part 2 sum is: ${part2Sum}`)
}

run()
