type BlockType = -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

interface BlockState {
  type: BlockType
  isMarked: boolean
  isFlipped: boolean
}

export type BlockMap = BlockState[]

export type Game = ReturnType<typeof initGame>

export default function initGame(
  rowNum: number,
  colNum: number,
  bombNum: number,
) {
  rowNum = Math.floor(rowNum)
  colNum = Math.floor(colNum)
  bombNum = Math.floor(bombNum)

  const total = rowNum * colNum

  if (rowNum <= 0 || colNum <= 0 || bombNum <= 0 || bombNum > total) {
    throw new Error('invalid game params')
  }

  const bombMap = createBombMap(rowNum, colNum, bombNum)
  const blockMap = []

  for (let i = 0; i < rowNum; ++i) {
    for (let j = 0; j < colNum; ++j) {
      const index = i * colNum + j

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
      if (i > 0 && j > 0) {
        count += bombMap[(i - 1) * colNum + j - 1] ? 1 : 0
      }

      // top
      if (i > 0) {
        count += bombMap[(i - 1) * colNum + j] ? 1 : 0
      }

      // right top
      if (i > 0 && j < colNum - 1) {
        count += bombMap[(i - 1) * colNum + j + 1] ? 1 : 0
      }

      // left
      if (j > 0) {
        count += bombMap[i * colNum + j - 1] ? 1 : 0
      }

      // right
      if (j < colNum - 1) {
        count += bombMap[i * colNum + j + 1] ? 1 : 0
      }

      // left bottom
      if (i < rowNum - 1 && j > 0) {
        count += bombMap[(i + 1) * colNum + j - 1] ? 1 : 0
      }

      // bottom
      if (i < rowNum - 1) {
        count += bombMap[(i + 1) * colNum + j] ? 1 : 0
      }

      // right bottom
      if (i < rowNum - 1 && j < colNum - 1) {
        count += bombMap[(i + 1) * colNum + j + 1] ? 1 : 0
      }

      blockMap[index] = {
        type: count,
        isMarked: false,
        isFlipped: false,
      }
    }
  }

  return {
    rowNum,
    colNum,
    bombNum,
    bombMap,
    blockMap: blockMap as BlockMap,
    flippedNum: 0,
    markedNum: 0,
    stepNum: 0,
    status: 'ongoing' as 'ongoing' | 'completed' | 'failed',
  }
}

function createBombMap(rowNum: number, colNum: number, bombNum: number) {
  const total = rowNum * colNum

  const bombMap = []

  for (let i = 0; i < total; ++i) {
    if (i < bombNum) {
      bombMap.push(true)
    } else {
      bombMap.push(false)
    }
  }

  shuffle(bombMap)

  return bombMap
}

function shuffle(bombMap: boolean[]) {
  const length = bombMap.length

  for (let i = 0; i < bombMap.length; ++i) {
    const ri = Math.floor(Math.random() * (length - 1))
    const temp = bombMap[i]
    bombMap[i] = bombMap[ri]
    bombMap[ri] = temp
  }
}
