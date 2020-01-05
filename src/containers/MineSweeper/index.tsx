import React, { Component } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import './MineSweeper.scss'
import MineSweeperBlock from './Block'
import initGame, { Game } from './initGame'
import spread from './spread'

interface State {
  game: Game
}

type Props = {} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  back: '⬜',
  blank: '◻️',
  mark: '🚩',
  bomb: '💣',
  boom: '💥',
  ongoing: '😀',
  completed: '😎',
  failed: '😵',
  hovered: '😳',
  rowNum: 10,
  colNum: 10,
  bombNum: 10,
})

const getProps = createPropsGetter(defaultProps)

const classBlock = 'mine-sweeper'

const numbers = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

export default class MineSweeper extends Component<Props, State> {
  static defaultProps = defaultProps

  constructor(props: Props) {
    super(props)

    const { rowNum, colNum, bombNum } = getProps(props)

    this.state = {
      game: initGame(rowNum, colNum, bombNum),
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { rowNum, colNum, bombNum } = this.innerProps
    const {
      rowNum: prevRowNum,
      colNum: prevColNum,
      bombNum: prevBombNum,
    } = getProps(prevProps)

    if (
      rowNum !== prevRowNum ||
      colNum !== prevColNum ||
      bombNum !== prevBombNum
    ) {
      this.handleInit(rowNum, colNum, bombNum)
    }
  }

  handleInit = (rowNum: number, colNum: number, bombNum: number) => {
    this.setState({
      game: initGame(rowNum, colNum, bombNum),
    })
  }

  handleBlockMouseUp = (row: number, col: number, e: React.MouseEvent) => {
    const { game } = this.state

    if (game.status !== 'ongoing') {
      return
    }

    if (e.button === 0) {
      this.handleBlockLeftMouseUp(row, col, e)
    }
  }

  handleBlockLeftMouseUp = (row: number, col: number, e: React.MouseEvent) => {
    const { game } = this.state
    const { rowNum, colNum, bombNum, blockMap } = game
    const index = row * colNum + col
    const block = blockMap[index]

    if (block.isFlipped || block.isMarked) {
      return
    }

    if (block.type === -1) {
      block.type = -2
      game.status = 'failed'
      this.forceUpdate()
      return
    }

    spread(row, col, game)

    if (game.flippedNum === rowNum * colNum - bombNum) {
      game.status = 'completed'
    }

    this.forceUpdate()
  }

  handleBlockContextMenu = (row: number, col: number, e: React.MouseEvent) => {
    const { game } = this.state
    const { colNum, blockMap } = game
    const index = row * colNum + col
    const block = blockMap[index]

    if (block.isFlipped) {
      return
    }

    block.isMarked = !block.isMarked
    game.markedNum += block.isMarked ? 1 : -1

    this.forceUpdate()
  }

  get innerProps() {
    return getProps(this.props)
  }

  renderStatusBar() {
    const { game } = this.state
    const { status } = game
    const {
      rowNum,
      colNum,
      bombNum,
      ongoing,
      completed,
      failed,
      hovered,
    } = this.innerProps
    let emoji = ''

    if (status === 'completed') {
      emoji = completed
    } else if (status === 'failed') {
      emoji = failed
    } else {
      emoji = ongoing
    }

    return (
      <div
        className={`${classBlock}__status-bar`}
        onClick={() => this.handleInit(rowNum, colNum, bombNum)}
      >
        <span className={`${classBlock}__status`}>{emoji}</span>
        <span
          className={`${classBlock}__status ${classBlock}__status--hovered`}
        >
          {hovered}
        </span>
      </div>
    )
  }

  renderGrid() {
    const { game } = this.state
    const { blockMap, status } = game
    const { rowNum, colNum, bomb, blank, back, mark, boom } = this.innerProps
    const types: any = {
      ...numbers,
      [-2]: boom,
      [-1]: bomb,
      0: blank,
    }
    const isEnded = status !== 'ongoing'

    const rows = []

    for (let row = 0; row <= rowNum - 1; ++row) {
      const blocks = []

      for (let col = 0; col <= colNum - 1; ++col) {
        const index = row * colNum + col
        const block = blockMap[index]

        if (isEnded) {
          block.isFlipped = true

          if (status === 'failed') {
            block.isMarked = false
          } else {
            if (block.type === -1) {
              block.isMarked = true
            }
          }
        }

        blocks.push(
          <MineSweeperBlock
            key={`${row}-${col}`}
            back={back}
            front={types[block.type]}
            mark={mark}
            isMarked={block.isMarked}
            isFlipped={block.isFlipped}
            onMouseUp={this.handleBlockMouseUp.bind(this, row, col)}
            onContextMenu={this.handleBlockContextMenu.bind(this, row, col)}
          />,
        )
      }

      rows.push(
        <div key={`${row}`} className={`${classBlock}__row`}>
          {blocks}
        </div>,
      )
    }

    return <div className={`${classBlock}__grid`}>{rows}</div>
  }

  render() {
    return (
      <div
        className={`${classBlock}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {this.renderStatusBar()}
        {this.renderGrid()}
      </div>
    )
  }
}
