import { BlockMap, BlockState } from './game'

export default function spread(options: {
  rowNum: number
  colNum: number
  blockMap: BlockMap
  row: number
  col: number
  handle: (block: BlockState) => void
}) {
  const { rowNum, colNum, row, col, handle } = options
  let { blockMap } = options
  const block = blockMap[row * colNum + col]

  if (block.isFlipped || block.type === -1) {
    return blockMap
  }

  handle(block)
  blockMap = [...blockMap]

  if (block.type !== 0) {
    return blockMap
  }

  // left top
  if (row > 0 && col > 0) {
    spread({
      ...options,
      blockMap,
      row: row - 1,
      col: col - 1,
    })
  }

  // top
  if (row > 0) {
    spread({
      ...options,
      blockMap,
      row: row - 1,
      col: col,
    })
  }

  // right top
  if (row > 0 && col < colNum - 1) {
    spread({
      ...options,
      blockMap,
      row: row - 1,
      col: col + 1,
    })
  }

  // left
  if (col > 0) {
    spread({
      ...options,
      blockMap,
      row: row,
      col: col - 1,
    })
  }

  // right
  if (col < colNum - 1) {
    spread({
      ...options,
      blockMap,
      row: row,
      col: col + 1,
    })
  }

  // left bottom
  if (row < rowNum - 1 && col > 0) {
    spread({
      ...options,
      blockMap,
      row: row + 1,
      col: col - 1,
    })
  }

  // bottom
  if (row < rowNum - 1) {
    spread({
      ...options,
      blockMap,
      row: row + 1,
      col: col,
    })
  }

  // right bottom
  if (row < rowNum - 1 && col < colNum - 1) {
    spread({
      ...options,
      blockMap,
      row: row + 1,
      col: col + 1,
    })
  }

  return blockMap
}
