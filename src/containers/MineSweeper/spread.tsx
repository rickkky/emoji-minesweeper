import { BlockMap, BlockState } from './game'

export default function spread(options: {
  rowNum: number
  colNum: number
  blockMap: BlockMap
  row: number
  col: number
  handler: (block: BlockState) => void
}) {
  const { rowNum, colNum, blockMap, row, col, handler } = options
  const block = blockMap[row * colNum + col]

  if (block.isFlipped || block.type === -1) {
    return
  }

  handler(block)

  if (block.type !== 0) {
    return
  }

  // left top
  if (row > 0 && col > 0) {
    spread({
      ...options,
      row: row - 1,
      col: col - 1,
    })
  }

  // top
  if (row > 0) {
    spread({
      ...options,
      row: row - 1,
      col: col,
    })
  }

  // right top
  if (row > 0 && col < colNum - 1) {
    spread({
      ...options,
      row: row - 1,
      col: col + 1,
    })
  }

  // left
  if (col > 0) {
    spread({
      ...options,
      row: row,
      col: col - 1,
    })
  }

  // right
  if (col < colNum - 1) {
    spread({
      ...options,
      row: row,
      col: col + 1,
    })
  }

  // left bottom
  if (row < rowNum - 1 && col > 0) {
    spread({
      ...options,
      row: row + 1,
      col: col - 1,
    })
  }

  // bottom
  if (row < rowNum - 1) {
    spread({
      ...options,
      row: row + 1,
      col: col,
    })
  }

  // right bottom
  if (row < rowNum - 1 && col < colNum - 1) {
    spread({
      ...options,
      row: row + 1,
      col: col + 1,
    })
  }
}
