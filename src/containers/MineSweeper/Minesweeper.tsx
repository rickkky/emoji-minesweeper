import React, { Component } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import initGame, { Game } from './initGame'
import spread from './spread'
import Header from './Header'
import Grid from './Grid'

interface State {
  game: Game
  isFrightened: boolean
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
  hovered: '😶',
  rowNum: 10,
  colNum: 10,
  bombNum: 10,
})

const getProps = createPropsGetter(defaultProps)

const classBlock = 'minesweeper'

export default class Minesweeper extends Component<Props, State> {
  static defaultProps = defaultProps

  constructor(props: Props) {
    super(props)

    const { rowNum, colNum, bombNum } = getProps(props)

    this.state = {
      game: initGame(rowNum, colNum, bombNum),
      isFrightened: false,
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

    if (game.status !== 'ongoing' || block.isFlipped || block.isMarked) {
      return
    }

    // reset face
    this.setState({
      isFrightened: false,
    })

    // quit if not left button
    if (e.button !== 0) {
      return
    }

    game.stepNum += 1

    if (block.type === -1) {
      block.type = -2
      game.status = 'failed'
      this.forceUpdate()
      return
    }

    spread(row, col, game)

    game.blockMap = [...blockMap]

    if (game.flippedNum === rowNum * colNum - bombNum) {
      game.status = 'completed'
    }

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

    game.blockMap = [...blockMap]

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
      isFrightened: true,
    })
  }

  handleBlockMouseLeave = (row: number, col: number, e: React.MouseEvent) => {
    this.setState({
      isFrightened: false,
    })
  }

  get innerProps() {
    return getProps(this.props)
  }

  renderHeader() {
    const { game, isFrightened } = this.state
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

    return (
      <Header
        classBlock={classBlock}
        ongoing={ongoing}
        completed={completed}
        failed={failed}
        frightened={frightened}
        hovered={hovered}
        status={status}
        isFrightened={isFrightened}
        onClick={() => this.handleInit(rowNum, colNum, bombNum)}
      />
    )
  }

  renderGrid() {
    const { back, blank, mark, bomb, boom, rowNum, colNum } = this.innerProps
    const {
      game: { blockMap, status },
    } = this.state

    return (
      <Grid
        classBlock={classBlock}
        back={back}
        blank={blank}
        mark={mark}
        bomb={bomb}
        boom={boom}
        rowNum={rowNum}
        colNum={colNum}
        blockMap={blockMap}
        status={status}
        onMouseUp={this.handleBlockMouseUp}
        onContextMenu={this.handleBlockContextMenu}
        onMouseEnter={this.handleBlockMouseEnter}
        onMouseLeave={this.handleBlockMouseLeave}
      />
    )
  }

  renderFooter() {
    const { game } = this.state
    const { markedNum, stepNum } = game
    const { bombNum } = this.innerProps

    return (
      <div className={`${classBlock}__footer`}>
        <div className={`${classBlock}__bomb-counter`}>
          <span>
            {bombNum - markedNum} / {bombNum}
          </span>
          <span>BOMBS</span>
        </div>
        <div className={`${classBlock}__step-counter`}>
          <span>{stepNum}</span>
          <span>STEPS</span>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div
        className={`${classBlock}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {this.renderHeader()}
        {this.renderGrid()}
        {this.renderFooter()}
      </div>
    )
  }
}
