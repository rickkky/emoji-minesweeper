export default function createRandomBombArray(options: {
  rowNum: number
  colNum: number
  bombNum: number
  row: number
  col: number
}) {
  const { rowNum, colNum, bombNum, row, col } = options
  const total = rowNum * colNum
  const deck: boolean[] = []

  // create an array with a specific number of bombNum
  for (let i = 0; i < total; ++i) {
    if (i < bombNum) {
      deck.push(true)
    } else {
      deck.push(false)
    }
  }

  // shuffle array
  for (let i = 0; i < total; ++i) {
    const ri = Math.floor(Math.random() * (total - 1))
    const temp = deck[i]

    deck[i] = deck[ri]
    deck[ri] = temp
  }

  const index = row * colNum + col

  // the seed block should not be bomb
  for (let i = index; i !== index - 1; ++i) {
    if (!deck[i]) {
      deck[i] = true
      deck[index] = false

      break
    }

    if (i >= total - 1) {
      i = -1
    }
  }

  return deck
}
