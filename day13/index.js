const fs = require("fs")

const PART_2 = true

function areSameLine(line1, line2, incorrect = 0) {
  let same
  // handle one possible incorrect
  if (PART_2) {
    let differences = incorrect
    for (let i = 0; i < line1.length; i++) {
      if (line1[i] !== line2[i]) {
        differences++
      }
      if (differences > 1) {
        break
      }
    }
    same = differences <= 1
    if (differences === 1) {
      incorrect = 1
    }
  } else {
    same = line1 === line2
  }
  return { incorrect, same }
}

function confirm(possibleIdx, pattern, incorrect) {
  let symmetrical = true, line1, line2, expansion = 1
  do {
    line1 = pattern[possibleIdx + expansion]
    line2 = pattern[possibleIdx - 1 - expansion]
    expansion++
    if (line1 === undefined || line2 === undefined) {
      break
    }
    const output = areSameLine(line1, line2)
    incorrect += output.incorrect
    if (!output.same) {
      symmetrical = false
    }
  } while (symmetrical)
  return PART_2 ? incorrect === 1 && symmetrical : symmetrical
}

function check(patterns, { horizontal }) {
  const found = []
  let patternNumber = 0
  for (let pattern of patterns) {
    let previousLine = "", lineIdx = -1
    let lineNumber = 0
    for (let line of pattern) {
      if (previousLine) {
        const output = areSameLine(previousLine, line)
        if (output.same && confirm(lineNumber, pattern, output.incorrect)) {
          lineIdx = lineNumber - 1
          break
        }
      }
      lineNumber++
      previousLine = line
    }
    if (lineIdx !== -1) {
      found.push({ index: patterns.indexOf(pattern), horizontal, lineIdx })
    }
    patternNumber++
  }
  return found
}

function run() {
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  const verticalPatterns = []
  let pattern = []
  for (let line of lines) {
    if (line === "") {
      verticalPatterns.push(pattern)
      pattern = []
      continue
    }
    pattern.push(line)
  }
  verticalPatterns.push(pattern)

  const horizontalPatterns = []
  for (let pattern of Object.values(verticalPatterns)) {
    const horizontal = {}
    for (let line of pattern) {
      for (let i = 0; i < line.length; i++) {
        horizontal[i] = [...horizontal[i] || [], line[i]]
      }
    }
    const finalHoriz = []
    for (let array of Object.values(horizontal)) {
      finalHoriz.push(array.join(""))
    }
    horizontalPatterns.push(finalHoriz)
  }

  // check horizontal
  let patternsFound = check(horizontalPatterns, { horizontal: true })
  // check vertical
  patternsFound = patternsFound.concat(check(verticalPatterns, { horizontal: false }))

  // tally it all up
  let sum = 0
  patternsFound = patternsFound.sort((a, b) => a.index - b.index)
  for (let found of patternsFound) {
    console.log(`Grid: ${found.index}`)
    console.log(`${found.horizontal ? "horizontal" : "vertical"} ${found.lineIdx}`)
    if (found.horizontal) {
      sum += found.lineIdx + 1
    } else {
      sum += ((found.lineIdx) + 1) * 100
    }
  }
  console.log(`The sum as requests is: ${sum}`)
}

run()
