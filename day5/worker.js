const { parentPort, workerData } = require("worker_threads")

const { start, end, maps } = workerData

let lowest = Number.MAX_SAFE_INTEGER
for (let seed = start; seed < end; seed++) {
  let current = seed
  for (let layer of Object.values(maps)) {
    for (let option of layer) {
      if (option.start <= current && option.max >= current) {
        current = current + option.modifier
        break
      }
    }
  }
  if (current < lowest) {
    lowest = current
  }
}

parentPort.postMessage(lowest)