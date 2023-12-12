const fs = require("fs")
const { Worker } = require("worker_threads")

const THREADS = 16

function divide(array) {
  const partSize = Math.ceil(array.length / THREADS)
  const parts = []
  for (let i = 0; i < array.length; i += partSize) {
    parts.push(array.slice(i, i + partSize))
  }
  return parts
}


async function thread(lines, { part2 }) {
  return new Promise((resolve) => {
    const worker = new Worker("./worker", {
      workerData: { lines, part2 },
    })
    worker.on("message", (result) => {
      resolve(result)
    })
  })
}

async function run() {
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")

  const sumPart1 = await thread(lines, { part2: false })
  console.log(`Part 1: Sum of possible options: ${sumPart1}`)

  const promises = []
  for (let division of divide(lines)) {
    promises.push(thread(division, { part2: true }))
  }
  const sumPart2 = (await Promise.all(promises)).reduce((a, b) => a + b, 0)
  console.log(`Part 2: Sum of possible options: ${sumPart2}`)
}

run().catch(err => {
  console.error(err)
})
