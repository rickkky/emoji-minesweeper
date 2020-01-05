import React, { Component } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import './MineSweeper.scss'
import MineSweeperBlock from './Block'
import initGame, { Game } from './initGame'
import spread from './spread'

interface State {
  game: Game
  isFrigthened: boolean
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
  frightened: '😬',
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
      isFrigthened: false,
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
    const { rowNum, colNum, bombNum, blockMap } = game
    const block = blockMap[row * colNum + col]

    if (
      game.status !== 'ongoing' ||
      block.isFlipped ||
      block.isMarked ||
      e.button !== 0
    ) {
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

    this.setState({
      isFrigthened: false,
    })
    this.forceUpdate()
  }

  handleBlockContextMenu = (row: number, col: number, e: React.MouseEvent) => {
    const { game } = this.state
    const { colNum, blockMap } = game
    const block = blockMap[row * colNum + col]

    if (game.status !== 'ongoing' || block.isFlipped) {
      return
    }

    block.isMarked = !block.isMarked
    game.markedNum += block.isMarked ? 1 : -1

    this.forceUpdate()
  }

  handleBlockMouseEnter = (row: number, col: number, e: React.MouseEvent) => {
    const { game } = this.state
    const { colNum, blockMap } = game
    const block = blockMap[row * colNum + col]

    if (block.isFlipped || block.isMarked) {
      return
    }

    this.setState({
      isFrigthened: true,
    })
  }

  handleBlockMouseLeave = (row: number, col: number, e: React.MouseEvent) => {
    this.setState({
      isFrigthened: false,
    })
  }

  get innerProps() {
    return getProps(this.props)
  }

  renderHeader() {
    const { game, isFrigthened } = this.state
    const { status } = game
    const {
      rowNum,
      colNum,
      bombNum,
      ongoing,
      completed,
      failed,
      frightened,
      hovered,
    } = this.innerProps
    let face = ''

    if (status === 'completed') {
      face = completed
    } else if (status === 'failed') {
      face = failed
    } else {
      face = ongoing

      if (isFrigthened) {
        face = frightened
      }
    }

    return (
      <div
        className={`${classBlock}__header`}
        onClick={() => this.handleInit(rowNum, colNum, bombNum)}
      >
        <span className={`${classBlock}__status`}>{face}</span>
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
        const block = blockMap[row * colNum + col]

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
            onMouseEnter={this.handleBlockMouseEnter.bind(this, row, col)}
            onMouseLeave={this.handleBlockMouseLeave.bind(this, row, col)}
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
        {this.renderHeader()}
        {this.renderGrid()}
      </div>
    )
  }
}
