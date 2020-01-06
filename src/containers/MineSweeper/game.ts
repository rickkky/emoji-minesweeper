export type GameStatus = 'ongoing' | 'completed' | 'failed'

export type BlockType = -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface BlockState {
  type: BlockType
  isMarked: boolean
  isFlipped: boolean
}

export type BlockMap = BlockState[]

interface Options {
  rowNum: number
  colNum: number
  bombNum: number
  totalNum: number
  seedRow: number
  seedCol: number
}

export function createEmptyGame(
  rowNum: number,
  colNum: number,
  bombNum: number,
) {
  rowNum = Math.floor(rowNum)
  colNum = Math.floor(colNum)
  bombNum = Math.floor(bombNum)

  const totalNum = rowNum * colNum

  if (rowNum <= 0 || colNum <= 0 || bombNum <= 0 || bombNum > totalNum) {
    throw new Error('invalid game params')
  }

  return {
    rowNum,
    colNum,
    bombNum,
    totalNum,
    blockMap: undefined,
    flippedNum: 0,
    markedNum: 0,
    stepNum: 0,
    time: 0,
    status: 'ongoing' as GameStatus,
  }
}

export function createBlockMap(options: Options) {
  const { rowNum, colNum } = options
  const bombMap = createBombMap(options)
  const blockMap = []

  for (let row = 0; row < rowNum; ++row) {
    for (let col = 0; col < colNum; ++col) {
      const index = row * colNum + col

      if (bombMap[index]) {
        blockMap[index] = {
          type: -1,
          isMarked: false,
          isFlipped: false,
        }
        continue
      }

      let count = 0

      // left top
      if (row > 0 && col > 0) {
        count += bombMap[(row - 1) * colNum + col - 1] ? 1 : 0
      }

      // top
      if (row > 0) {
        count += bombMap[(row - 1) * colNum + col] ? 1 : 0
      }

      // right top
      if (row > 0 && col < colNum - 1) {
        count += bombMap[(row - 1) * colNum + col + 1] ? 1 : 0
      }

      // left
      if (col > 0) {
        count += bombMap[row * colNum + col - 1] ? 1 : 0
      }

      // right
      if (col < colNum - 1) {
        count += bombMap[row * colNum + col + 1] ? 1 : 0
      }

      // left bottom
      if (row < rowNum - 1 && col > 0) {
        count += bombMap[(row + 1) * colNum + col - 1] ? 1 : 0
      }

      // bottom
      if (row < rowNum - 1) {
        count += bombMap[(row + 1) * colNum + col] ? 1 : 0
      }

      // right bottom
      if (row < rowNum - 1 && col < colNum - 1) {
        count += bombMap[(row + 1) * colNum + col + 1] ? 1 : 0
      }

      blockMap[index] = {
        type: count,
        isMarked: false,
        isFlipped: false,
      }
    }
  }

  return blockMap as BlockMap
}

function createBombMap(options: Options) {
  const { colNum, bombNum, totalNum, seedRow, seedCol } = options
  const bombMap: boolean[] = []

  // create an array with a specific number of bombs
  for (let i = 0; i < totalNum; ++i) {
    if (i < bombNum) {
      bombMap.push(true)
    } else {
      bombMap.push(false)
    }
  }

  // shuffle array
  for (let i = 0; i < totalNum; ++i) {
    const ri = Math.floor(Math.random() * (totalNum - 1))
    const temp = bombMap[i]
    bombMap[i] = bombMap[ri]
    bombMap[ri] = temp
  }

  const index = seedRow * colNum + seedCol

  // the seed block should not be bomb
  for (let i = index; i !== index - 1; ++i) {
    if (!bombMap[i]) {
      bombMap[i] = true
      bombMap[index] = false
      return bombMap
    }

    if (i >= totalNum - 1) {
      i = -1
    }
  }

  return bombMap
}
