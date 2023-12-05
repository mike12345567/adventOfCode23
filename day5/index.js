const fs = require("fs")
const { Worker } = require("worker_threads")


const maps = {}

const PART_TWO = true

async function run() {
  const contents = fs.readFileSync("./input.txt", "utf8")
  const lines = contents.split("\n")
  let seedNumbers = lines.shift().trim().split(" ").splice(1).map(el => parseInt(el))
  if (PART_TWO) {
    let temp = []
    let flip = false, start = 0
    for (let number of seedNumbers) {
      if (!flip) {
        start = number
        flip = true
      } else {
        temp.push({ start, end: start + number })
        flip = false
      }
    }
    seedNumbers = temp
  } else {
    seedNumbers = seedNumbers.map(el => ({ start: el, end: el }))
  }
  let layer = 0, name
  for (let line of lines) {
    if (line.trim() === "") {
      continue
    }
    if (line.includes("-to-")) {
      name = line
      layer++
    } else {
      let [dest, src, range] = line.trim().split(" ").map(el => parseInt(el))
      maps[layer] ??= []
      maps[layer].push({ name, start: src, max: src + range, modifier: dest - src })
    }
  }
  let lowest = 66405002
  let promises = []
  for (let { start, end } of seedNumbers) {
    console.log(`Starting seed: ${start} - ending: ${end}`)
    promises.push(new Promise((resolve) => {
      const worker = new Worker("./worker", {
        workerData: { start, end, maps },
      })
      worker.on("message", (result) => {
        console.log(`start: ${start} - end: ${end} - lowest: ${result}`)
        resolve(result)
      })
    }))
  }
  const allNumbers = await Promise.all(promises)
  for (let number of allNumbers) {
    if (lowest > number) {
      lowest = number
    }
  }
  console.log(`Lowest: ${lowest}`)
}

run().then(() => {
  console.log("Finished!")
})
