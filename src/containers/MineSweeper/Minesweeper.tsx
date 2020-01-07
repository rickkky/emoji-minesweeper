import React, { Component, createRef } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import {
  createEmptyGame,
  createBlockMap,
  GameStatus,
  BlockMap,
  BlockState,
} from './game'
import spread from './spread'
import TwemojiContext from './TwemojiContext'
import Header from './Header'
import Grid from './Grid'
import Stopwatch from '../../utils/stopwatch'
import Footer from './Footer'

interface State {
  rowNum: number
  colNum: number
  bombNum: number
  totalNum: number
  blockMap: BlockMap | undefined
  flippedNum: number
  markedNum: number
  stepNum: number
  time: number
  status: GameStatus
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
  twemojiEnabled: true,
})

const getProps = createPropsGetter(defaultProps)

const classBlock = 'minesweeper'

export default class Minesweeper extends Component<Props, State> {
  static defaultProps = defaultProps

  containerRef: React.RefObject<HTMLDivElement> = createRef()

  stopwatch: Stopwatch

  constructor(props: Props) {
    super(props)

    const { rowNum, colNum, bombNum } = this.innerProps

    this.state = {
      ...createEmptyGame(rowNum, colNum, bombNum),
      isFrightened: false,
    }

    this.stopwatch = new Stopwatch()
    this.stopwatch.on('tick', this.handleStopwatchTick)
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
      this.setState({
        ...createEmptyGame(rowNum, colNum, bombNum),
      })
      return
    }

    if (
      this.state.status === 'ongoing' &&
      this.state.flippedNum === this.state.totalNum - this.state.bombNum
    ) {
      this.setState({
        status: 'completed',
      })
      this.stopwatch.stop()
      return
    }
  }

  handleHeaderClick = () => {
    const { rowNum, colNum, bombNum } = this.innerProps

    this.setState({ ...createEmptyGame(rowNum, colNum, bombNum) })
    this.stopwatch.stop()
  }

  handleBlockSpread = (block: BlockState) => {
    block.isFlipped = true
    this.setState((p) => ({ flippedNum: p.flippedNum + 1 }))

    if (block.isMarked) {
      block.isMarked = false
      this.setState((p) => ({ markedNum: p.markedNum - 1 }))
    }
  }

  handleStopwatchTick = (evt: { time: number }) => {
    this.setState(() => ({ time: evt.time }))
  }

  handleBlockMouseUp = (row: number, col: number, evt: React.MouseEvent) => {
    // quit if not left button
    if (evt.button !== 0) {
      return
    }

    const { rowNum, colNum, bombNum, totalNum } = this.state
    let { blockMap, status, stepNum } = this.state

    if (!blockMap) {
      blockMap = createBlockMap({
        rowNum,
        colNum,
        bombNum,
        totalNum,
        seedRow: row,
        seedCol: col,
      })
      this.stopwatch.start()
    }

    const block = blockMap[row * colNum + col]

    if (status !== 'ongoing' || block.isFlipped || block.isMarked) {
      return
    }

    stepNum += 1

    if (block.type === -1) {
      block.type = -2
      status = 'failed'
      this.stopwatch.stop()
    }

    blockMap = spread({
      rowNum,
      colNum,
      blockMap,
      row,
      col,
      handle: this.handleBlockSpread,
    })

    this.setState((prevState) => {
      return {
        ...prevState,
        blockMap,
        status,
        stepNum,
      }
    })
  }

  handleBlockContextMenu = (
    row: number,
    col: number,
    evt: React.MouseEvent,
  ) => {
    const { colNum, blockMap, markedNum, status } = this.state

    if (!blockMap) {
      return
    }

    const block = blockMap[row * colNum + col]

    if (status !== 'ongoing' || block.isFlipped) {
      return
    }

    block.isMarked = !block.isMarked

    this.setState({
      markedNum: markedNum + (block.isMarked ? 1 : -1),
      blockMap: [...blockMap],
      isFrightened: false,
    })
  }

  handleBlockMouseEnter = (row: number, col: number, evt: React.MouseEvent) => {
    const { colNum, blockMap } = this.state

    if (!blockMap) {
      this.setState({
        isFrightened: true,
      })
      return
    }

    const block = blockMap[row * colNum + col]

    if (block.isFlipped || block.isMarked) {
      return
    }

    this.setState({
      isFrightened: true,
    })
  }

  handleBlockMouseLeave = (row: number, col: number, evt: React.MouseEvent) => {
    this.setState({
      isFrightened: false,
    })
  }

  get innerProps() {
    return getProps(this.props)
  }

  renderHeader() {
    const { ongoing, completed, failed, frightened, hovered } = this.innerProps

    return (
      <Header
        classBlock={classBlock}
        ongoing={ongoing}
        completed={completed}
        failed={failed}
        frightened={frightened}
        hovered={hovered}
        status={this.state.status}
        isFrightened={this.state.isFrightened}
        onClick={this.handleHeaderClick}
      />
    )
  }

  renderGrid() {
    const innerProps = this.innerProps
    const { rowNum, colNum, blockMap, status } = this.state
    const gridProps = {
      classBlock,
      back: innerProps.back,
      blank: innerProps.blank,
      mark: innerProps.mark,
      bomb: innerProps.bomb,
      boom: innerProps.boom,
      rowNum,
      colNum,
      blockMap,
      status,
    }

    return (
      <Grid
        {...gridProps}
        onMouseUp={this.handleBlockMouseUp}
        onContextMenu={this.handleBlockContextMenu}
        onMouseEnter={this.handleBlockMouseEnter}
        onMouseLeave={this.handleBlockMouseLeave}
      />
    )
  }

  renderFooter() {
    const { bombNum } = this.innerProps
    const { markedNum, stepNum, time } = this.state

    return (
      <Footer
        classBlock={classBlock}
        bombNum={bombNum}
        markedNum={markedNum}
        stepNum={stepNum}
        time={time}
      />
    )
  }

  render() {
    const { twemojiEnabled } = this.innerProps

    return (
      <TwemojiContext.Provider value={twemojiEnabled}>
        <div
          ref={this.containerRef}
          className={`${classBlock}`}
          onContextMenu={(evt) => evt.preventDefault()}
        >
          {this.renderHeader()}
          {this.renderGrid()}
          {this.renderFooter()}
        </div>
      </TwemojiContext.Provider>
    )
  }
}
