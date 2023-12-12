const { parentPort, workerData } = require("worker_threads")
const { lines, part2 } = workerData

const HASH = "#"
const DOT = "."
const QUESTION = "?"
const UNFOLD_COUNT = 5

function execute(lines) {
  let linePrep = line => {
    let [puzzle, sequence] = line.split(" ")
    if (part2) {
      puzzle = Array(UNFOLD_COUNT).fill(puzzle).join("?")
      sequence = Array(UNFOLD_COUNT).fill(sequence).join(",")
    }
    sequence = sequence.split(",").map(n => parseInt(n))
    return { puzzle, sequence }
  }

  let sum = 0
  for (let line of lines) {
    const { puzzle, sequence } = linePrep(line)
    sum += process(puzzle, sequence)
  }
  return sum
}

function process(puzzle, sequence) {
  let alreadyMapped = new Map()
  const recurse = (puzzleNo = 0, seqNo = 0, current = 0) => {
    let key = `${puzzleNo},${seqNo},${current}`
    if (alreadyMapped.has(key)) {
      return alreadyMapped.get(key)
    }

    if (puzzleNo === puzzle.length) {
      if (seqNo === sequence.length && current === 0) {
        return 1
      } else if (seqNo === sequence.length - 1 && sequence[seqNo] === current) {
        return 1
      } else {
        return 0
      }
    }

    let ans = 0
    const combo = [DOT, HASH]
    combo.forEach(check => {
      if (puzzle[puzzleNo] === check || puzzle[puzzleNo] === QUESTION) {
        if (check === DOT && current === 0) {
          ans += recurse(puzzleNo + 1, seqNo, 0)
        } else if (check === DOT && current > 0 && seqNo < sequence.length && sequence[seqNo] === current) {
          ans += recurse(puzzleNo + 1, seqNo + 1, 0)
        } else if (check === HASH) {
          ans += recurse(puzzleNo + 1, seqNo, current + 1)
        }
      }
    })

    alreadyMapped.set(key, ans)
    return ans
  }
  return recurse()
}

parentPort.postMessage(execute(lines))