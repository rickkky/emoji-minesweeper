import React, { Component } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import Game from './Game'
import Header from './Header'
import Grid from './Grid'
import Footer from './Footer'
import { classBlock } from './constants'

interface State {
  isScared: boolean
}

type Props = {} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  back: '⬜',
  blank: '◻️',
  mark: '🚩',
  bomb: '💣',
  boom: '💥',
  smiley: '😀',
  happy: '😎',
  sad: '😵',
  scared: '😬',
  calm: '😶',
})

const getProps = createPropsGetter(defaultProps)

export default class Container extends Component<Props, State> {
  static defaultProps = defaultProps

  game = new Game()

  constructor(props: Props) {
    super(props)

    this.state = {
      isScared: false,
    }

    this.game.on('change', this.handleChange)
  }

  handleChange = () => {
    this.setState({ isScared: false })
    this.forceUpdate()
  }

  handleHeaderClick = () => {
    this.game.reset()
  }

  handleContextMenu = (evt: React.MouseEvent) => {
    evt.preventDefault()
  }

  handleBlockMouseUp = (row: number, col: number, evt: React.MouseEvent) => {
    // quit if not left button
    if (evt.button !== 0) {
      return
    }

    this.game.flip(row, col)
  }

  handleBlockContextMenu = (
    row: number,
    col: number,
    evt: React.MouseEvent,
  ) => {
    this.game.mark(row, col)
  }

  handleBlockMouseEnter = (row: number, col: number, evt: React.MouseEvent) => {
    const { colNum, status, itemStatusArray } = this.game

    this.setState({
      isScared:
        status === 'pending' ||
        (status === 'ongoing' &&
          itemStatusArray[row * colNum + col] === 'pending'),
    })
  }

  handleBlockMouseLeave = (row: number, col: number, evt: React.MouseEvent) => {
    this.setState({ isScared: false })
  }

  get innerProps() {
    return getProps(this.props)
  }

  renderHeader() {
    const { smiley, happy, sad, scared, calm } = this.innerProps

    return (
      <Header
        status={this.game.status}
        isScared={this.state.isScared}
        smiley={smiley}
        happy={happy}
        sad={sad}
        scared={scared}
        calm={calm}
        onClick={this.handleHeaderClick}
      />
    )
  }

  renderGrid() {
    const { back, blank, mark, bomb, boom } = this.innerProps
    const {
      rowNum,
      colNum,
      status,
      bombArray,
      bombNumArray,
      itemStatusArray,
    } = this.game

    return (
      <Grid
        rowNum={rowNum}
        colNum={colNum}
        status={status}
        bombArray={bombArray}
        bombNumArray={bombNumArray}
        itemStatusArray={itemStatusArray}
        back={back}
        blank={blank}
        mark={mark}
        bomb={bomb}
        boom={boom}
        onMouseUp={this.handleBlockMouseUp}
        onContextMenu={this.handleBlockContextMenu}
        onMouseEnter={this.handleBlockMouseEnter}
        onMouseLeave={this.handleBlockMouseLeave}
      />
    )
  }

  renderFooter() {
    const { bombNum, markNum, stepNum, time } = this.game

    return (
      <Footer
        bombNum={bombNum}
        markNum={markNum}
        stepNum={stepNum}
        time={time}
      />
    )
  }

  render() {
    const { status } = this.game

    return (
      <div
        className={`${classBlock} ${classBlock}--${status}`}
        onContextMenu={this.handleContextMenu}
      >
        {this.renderHeader()}
        {this.renderGrid()}
        {this.renderFooter()}
      </div>
    )
  }
}
