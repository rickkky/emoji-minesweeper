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
    this.setState((prevState) => {
      return {
        ...prevState,
        flippedNum: prevState.flippedNum + 1,
      }
    })

    if (block.isMarked) {
      block.isMarked = false
      this.setState((prevState) => {
        return {
          ...prevState,
          markedNum: prevState.markedNum - 1,
        }
      })
    }
  }

  handleStopwatchTick = (e: { time: number }) => {
    this.setState({
      time: e.time,
    })
  }

  handleBlockMouseUp = (row: number, col: number, e: React.MouseEvent) => {
    // quit if not left button
    if (e.button !== 0) {
      return
    }

    const { rowNum, colNum, bombNum, totalNum, status, stepNum } = this.state
    let blockMap: BlockMap

    if (!this.state.blockMap) {
      blockMap = createBlockMap({
        rowNum,
        colNum,
        bombNum,
        totalNum,
        seedRow: row,
        seedCol: col,
      })

      this.setState({ blockMap })

      this.stopwatch.start()
    } else {
      blockMap = this.state.blockMap
    }

    const block = blockMap[row * colNum + col]

    if (status !== 'ongoing' || block.isFlipped || block.isMarked) {
      return
    }

    this.setState({
      isFrightened: false,
      stepNum: stepNum + 1,
    })

    if (block.type === -1) {
      block.type = -2

      this.setState({
        status: 'failed',
      })

      this.stopwatch.stop()

      return
    }

    spread({
      rowNum,
      colNum,
      blockMap,
      row,
      col,
      handler: this.handleBlockSpread,
    })

    this.setState((prevState) => {
      return {
        ...prevState,
        blockMap: [...blockMap],
      }
    })
  }

  handleBlockContextMenu = (row: number, col: number, e: React.MouseEvent) => {
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

  handleBlockMouseEnter = (row: number, col: number, e: React.MouseEvent) => {
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

  handleBlockMouseLeave = (row: number, col: number, e: React.MouseEvent) => {
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
    const { markedNum, stepNum, time } = this.state
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
        <div className={`${classBlock}__time-counter`}>
          <span>{(time / 1000).toFixed(3)}</span>
          <span>TIME</span>
        </div>
      </div>
    )
  }

  render() {
    const { twemojiEnabled } = this.innerProps

    return (
      <TwemojiContext.Provider value={twemojiEnabled}>
        <div
          ref={this.containerRef}
          className={`${classBlock}`}
          onContextMenu={(e) => e.preventDefault()}
        >
          {this.renderHeader()}
          {this.renderGrid()}
          {this.renderFooter()}
        </div>
      </TwemojiContext.Provider>
    )
  }
}
