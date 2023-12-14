const fs = require("fs")
const { performance } = require("perf_hooks")

function fixSpaces(str) {
  return str.trim().replaceAll(/ +/g, " ")
}

function getNumbers(str) {
  return str
    .split(" ")
    .splice(1)
    .map(el => parseInt(el))
}

function run() {
  const input = fs.readFileSync("./input2.txt", "utf8")
  const start = performance.now()
  const lines = input.split("\n")
  const times = getNumbers(fixSpaces(lines[0]))
  const distances = getNumbers(fixSpaces(lines[1]))
  let output = 1
  for (let race = 0; race < times.length; race++) {
    const time = times[race]
    const record = distances[race]
    let ways = 0
    let latestMax = 0
    for (let ms = 0; ms < time; ms++) {
      const raceDistance = ms * (time - ms)
      if (raceDistance >= latestMax) {
        latestMax = raceDistance
      } else if (raceDistance < record) {
        break
      }
      if (raceDistance > record) {
        ways++
      }
    }
    output = output * ways
  }
  console.log(`The total for this is: ${output}`)
  const end = performance.now()
  console.log(`This took: ${Math.floor(end - start)}ms`)
}

run()
