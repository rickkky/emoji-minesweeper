import { Game } from './initGame'

export default function spread(row: number, col: number, game: Game) {
  const { rowNum, colNum, blockMap } = game
  const block = blockMap[row * colNum + col]

  if (block.isFlipped || block.type === -1) {
    return
  }

  block.isFlipped = true
  game.flippedNum += 1

  if (block.isMarked) {
    block.isMarked = false
    game.markedNum -= 1
  }

  if (block.type !== 0) {
    return
  }

  // left top
  if (row > 0 && col > 0) {
    spread(row - 1, col - 1, game)
  }

  // top
  if (row > 0) {
    spread(row - 1, col, game)
  }

  // right top
  if (row > 0 && col < colNum - 1) {
    spread(row - 1, col + 1, game)
  }

  // left
  if (col > 0) {
    spread(row, col - 1, game)
  }

  // right
  if (col < colNum - 1) {
    spread(row, col + 1, game)
  }

  // left bottom
  if (row < rowNum - 1 && col > 0) {
    spread(row + 1, col - 1, game)
  }

  // bottom
  if (row < rowNum - 1) {
    spread(row + 1, col, game)
  }

  // right bottom
  if (row < rowNum - 1 && col < colNum - 1) {
    spread(row + 1, col + 1, game)
  }
}
