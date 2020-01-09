import React, { PureComponent } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import { GameStatus, BombNum, ItemStatus } from './Game'
import Block from './Block'
import { classBlock } from './constants'
import noop from '../../utils/noop'

type Props = {
  rowNum: number
  colNum: number
  status: GameStatus
  bombArray: boolean[]
  bombNumArray: BombNum[]
  itemStatusArray: ItemStatus[]
  back: string
  blank: string
  mark: string
  bomb: string
  boom: string
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  onMouseUp: noop as (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLSpanElement>,
  ) => void,
  onContextMenu: noop as (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLSpanElement>,
  ) => void,
  onMouseEnter: noop as (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLSpanElement>,
  ) => void,
  onMouseLeave: noop as (
    row: number,
    col: number,
    e: React.MouseEvent<HTMLSpanElement>,
  ) => void,
})

const getProps = createPropsGetter(defaultProps)

export default class Grid extends PureComponent<Props> {
  static defaultProps = defaultProps

  get innerProps() {
    return getProps(this.props)
  }

  render() {
    const {
      rowNum,
      colNum,
      status,
      bombArray,
      bombNumArray,
      itemStatusArray,
      back,
      blank,
      mark,
      bomb,
      boom,
      onMouseUp: handleMouseUp,
      onContextMenu: handleContextMenu,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    } = this.innerProps

    const rows = []

    for (let row = 0; row < rowNum; ++row) {
      const blocks = []

      for (let col = 0; col < colNum; ++col) {
        const index = row * colNum + col
        const isBomb = bombArray[index]
        const bombNum = bombNumArray[index]
        let itemStatus = itemStatusArray[index]

        if (status === 'completed') {
          if (isBomb) {
            itemStatus = 'marked'
          } else {
            itemStatus = 'flipped'
          }
        } else if (status === 'failed') {
          if (itemStatus !== 'detonated') {
            itemStatus = 'flipped'
          }
        }

        blocks.push(
          <Block
            key={`${row}-${col}`}
            isBomb={isBomb}
            bombNum={bombNum}
            status={itemStatus}
            back={back}
            blank={blank}
            mark={mark}
            bomb={bomb}
            boom={boom}
            onMouseUp={handleMouseUp.bind(undefined, row, col)}
            onContextMenu={handleContextMenu.bind(undefined, row, col)}
            onMouseEnter={handleMouseEnter.bind(undefined, row, col)}
            onMouseLeave={handleMouseLeave.bind(undefined, row, col)}
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
}
