const fs = require("fs")

const PART_2 = true
const EXPANSION_FACTOR = PART_2 ? 1000000 : 1

function findGalaxies(universe) {
  let galaxyCoords = {},
    galaxyCount = 0
  for (let y = 0; y < universe.length; y++) {
    const row = universe[y]
    for (let x = 0; x < row.length; x++) {
      let galaxy = row[x]
      if (galaxy === "#") {
        galaxyCoords[++galaxyCount] = [x, y]
      }
    }
  }
  return galaxyCoords
}

function print(universe) {
  for (let line of universe) {
    console.log(line.join(""))
  }
}

function run() {
  const lines = fs.readFileSync("./input.txt", "utf8").split("\n")
  const universe = lines.map(line => line.split(""))
  // first find galaxies
  let galaxyCoords = findGalaxies(universe)
  const galaxyArray = Object.values(galaxyCoords)
  const emptyCols = Array.from(Array(universe[0].length).keys()).filter(
    y => !galaxyArray.find(el => el[0] === y)
  )
  const emptyRows = Array.from(Array(universe.length).keys()).filter(
    x => !galaxyArray.find(el => el[1] === x)
  )
  // expand empty
  if (!PART_2) {
    let addedRows = 0
    for (let emptyIdx of emptyRows) {
      universe.splice(
        emptyIdx + addedRows++,
        0,
        Array(universe[0].length).fill(".")
      )
    }
    let addedCols = 0
    for (let emptyIdx of emptyCols) {
      for (let row of universe) {
        row.splice(emptyIdx + addedCols, 0, ".")
      }
      addedCols++
    }
    // re-find galaxies in expanded universe
    galaxyCoords = findGalaxies(universe)
  }
  const galaxies = Object.values(galaxyCoords)
  const distances = []
  const complete = []
  for (let galaxyCoord of galaxies) {
    complete.push(galaxyCoord)
    galaxies
      .filter(coord => !complete.find(crd => crd === coord))
      .forEach(coord => {
        const x1 = galaxyCoord[0],
          y1 = galaxyCoord[1]
        const x2 = coord[0],
          y2 = coord[1]
        const lowX = Math.min(x1, x2),
          lowY = Math.min(y1, y2)
        const highX = Math.max(x1, x2),
          highY = Math.max(y1, y2)
        const emptyX = emptyCols.filter(col => lowX <= col && highX >= col)
        const emptyY = emptyRows.filter(row => lowY <= row && highY >= row)
        let result = Math.abs(x1 - x2) + emptyX.length * (EXPANSION_FACTOR - 1)
        result += Math.abs(y1 - y2) + emptyY.length * (EXPANSION_FACTOR - 1)
        distances.push(result)
      })
  }
  let sum = Object.values(distances).reduce((a, b) => a + b, 0)
  print(universe)
  console.log(`Sum of distances: ${sum}`)
}

run()
