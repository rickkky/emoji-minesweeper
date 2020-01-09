import EventDispenser from 'event-dispenser'
import Stopwatch, { TickEvent } from '../../utils/stopwatch'
import createRandomBombArray from './createRandomBombArray'

export type GameStatus = 'pending' | 'ongoing' | 'completed' | 'failed'

export type BombNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type ItemStatus = 'pending' | 'flipped' | 'marked' | 'detonated'

export interface GameEventMap {
  change: undefined
  'stopwatch-tick': TickEvent
}

interface GameProps {
  rowNum: number
  colNum: number
  bombNum: number
}

export default class Game extends EventDispenser<GameEventMap> {
  private _rowNum = 10

  private _colNum = 10

  private _bombNum = 10

  private _status: GameStatus = 'pending'

  private _markNum = 0

  private _facecadeNum = 0

  private _stepNum = 0

  private _time = 0

  private _bombArray: boolean[] = []

  private _bombNumArray: BombNum[] = []

  private _itemStatusArray: ItemStatus[] = []

  private _stopwatch = new Stopwatch()

  private _handleTick = (event: TickEvent) => {
    this._time = event.time
    this.emit('change', undefined)
    this.emit('stopwatch-tick', event)
  }

  constructor(props?: GameProps) {
    super()

    this._stopwatch.on('tick', this._handleTick)

    this.reset(props)
  }

  get rowNum() {
    return this._rowNum
  }

  get colNum() {
    return this._colNum
  }

  get bombNum() {
    return this._bombNum
  }

  get status() {
    return this._status
  }

  get markNum() {
    return this._markNum
  }

  get facecadeNum() {
    return this._facecadeNum
  }

  get stepNum() {
    return this._stepNum
  }

  get time() {
    return this._time
  }

  get bombArray() {
    return this._bombArray
  }

  get bombNumArray() {
    return this._bombNumArray
  }

  get itemStatusArray() {
    return this._itemStatusArray
  }

  get props() {
    return {
      rowNum: this._rowNum,
      colNum: this._colNum,
      bombNum: this._bombNum,
    }
  }

  set props(value) {
    const rowNum = Math.floor(value.rowNum)
    const colNum = Math.floor(value.colNum)
    const bombNum = Math.floor(value.bombNum)
    const total = rowNum * colNum

    if (rowNum <= 0 || colNum <= 0 || bombNum <= 0 || bombNum > total) {
      throw new Error('invalid game props')
    }

    this._rowNum = rowNum
    this._colNum = colNum
    this._bombNum = bombNum

    this.reset()
  }

  reset(props?: GameProps) {
    if (props) {
      this.props = props
    }

    this._status = 'pending'
    this._markNum = 0
    this._facecadeNum = 0
    this._stepNum = 0
    this._time = 0
    this._bombArray = []
    this._bombNumArray = []
    this._itemStatusArray = []
    this._stopwatch.stop()

    this.emit('change', undefined)
  }

  flip(row: number, col: number) {
    if (this._status !== 'ongoing') {
      if (this._status === 'pending') {
        this._start(row, col)
      }

      return
    }

    const { rowNum, colNum, bombNum } = this
    const index = row * colNum + col
    const itemStatus = this._itemStatusArray[index]

    if (itemStatus !== 'pending') {
      return
    }

    this._stepNum += 1

    if (this._bombArray[index]) {
      // boom!!!
      this._status = 'failed'
      this._itemStatusArray[index] = 'detonated'
      this._stopwatch.stop()
    }

    this._spread(row, col)

    if (this._facecadeNum === rowNum * colNum - bombNum) {
      this._status = 'completed'
      this._stopwatch.stop()
    }

    this._itemStatusArray = [...this._itemStatusArray]

    this.emit('change', undefined)
  }

  mark(row: number, col: number) {
    if (this._status !== 'ongoing') {
      return
    }

    const { colNum, itemStatusArray } = this
    const index = row * colNum + col

    if (itemStatusArray[index] === 'pending') {
      itemStatusArray[index] = 'marked'
      this._markNum += 1
    } else if (itemStatusArray[index] === 'marked') {
      itemStatusArray[index] = 'pending'
      this._markNum -= 1
    } else {
      return
    }

    this._itemStatusArray = [...this._itemStatusArray]

    this.emit('change', undefined)
  }

  private _spread(row: number, col: number) {
    const { rowNum, colNum, bombArray, itemStatusArray, bombNumArray } = this
    const index = row * colNum + col

    if (bombArray[index] || itemStatusArray[index] === 'flipped') {
      return
    }

    this._markNum += itemStatusArray[index] === 'marked' ? -1 : 0
    this._facecadeNum += 1
    itemStatusArray[index] = 'flipped'

    if (bombNumArray[index] !== 0) {
      return
    }

    // left top
    if (row > 0 && col > 0) {
      this._spread(row - 1, col - 1)
    }

    // top
    if (row > 0) {
      this._spread(row - 1, col)
    }

    // right top
    if (row > 0 && col < colNum - 1) {
      this._spread(row - 1, col + 1)
    }

    // left
    if (col > 0) {
      this._spread(row, col - 1)
    }

    // right
    if (col < colNum - 1) {
      this._spread(row, col + 1)
    }

    // left bottom
    if (row < rowNum - 1 && col > 0) {
      this._spread(row + 1, col - 1)
    }

    // bottom
    if (row < rowNum - 1) {
      this._spread(row + 1, col)
    }

    // right bottom
    if (row < rowNum - 1 && col < colNum - 1) {
      this._spread(row + 1, col + 1)
    }
  }

  private _start(row: number, col: number) {
    const { rowNum, colNum, bombNum } = this
    const bombArray = createRandomBombArray({
      rowNum: rowNum,
      colNum: colNum,
      bombNum: bombNum,
      row,
      col,
    })
    const itemStatusArray: ItemStatus[] = []
    const bombNumArray: BombNum[] = []

    for (let row = 0; row < this._rowNum; ++row) {
      for (let col = 0; col < this._colNum; ++col) {
        const index = row * this._colNum + col

        itemStatusArray[index] = 'pending'

        let count = 0

        // left top
        if (row > 0 && col > 0) {
          count += bombArray[(row - 1) * colNum + col - 1] ? 1 : 0
        }

        // top
        if (row > 0) {
          count += bombArray[(row - 1) * colNum + col] ? 1 : 0
        }

        // right top
        if (row > 0 && col < colNum - 1) {
          count += bombArray[(row - 1) * colNum + col + 1] ? 1 : 0
        }

        // left
        if (col > 0) {
          count += bombArray[row * colNum + col - 1] ? 1 : 0
        }

        // right
        if (col < colNum - 1) {
          count += bombArray[row * colNum + col + 1] ? 1 : 0
        }

        // left bottom
        if (row < rowNum - 1 && col > 0) {
          count += bombArray[(row + 1) * colNum + col - 1] ? 1 : 0
        }

        // bottom
        if (row < rowNum - 1) {
          count += bombArray[(row + 1) * colNum + col] ? 1 : 0
        }

        // right bottom
        if (row < rowNum - 1 && col < colNum - 1) {
          count += bombArray[(row + 1) * colNum + col + 1] ? 1 : 0
        }

        bombNumArray[index] = count as BombNum
      }
    }

    this._status = 'ongoing'
    this._bombArray = bombArray
    this._itemStatusArray = itemStatusArray
    this._bombNumArray = bombNumArray
    this._stopwatch.start()
    this.flip(row, col)
  }
}
