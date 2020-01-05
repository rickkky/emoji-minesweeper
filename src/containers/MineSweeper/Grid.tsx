import React, { PureComponent } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import Block from './Block'
import { BlockMap } from './initGame'
import noop from '../../utils/noop'

type Props = {
  blockMap?: BlockMap
  back: string
  blank: string
  mark: string
  bomb: string
  boom: string
  rowNum: number
  colNum: number
  status: 'ongoing' | 'completed' | 'failed'
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

const classBlock = 'minesweeper'

const numbers = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

export default class Grid extends PureComponent<Props> {
  get innerProps() {
    return getProps(this.props)
  }

  render() {
    const {
      back,
      blank,
      mark,
      bomb,
      boom,
      rowNum,
      colNum,
      blockMap,
      status,
      onMouseUp: handleMouseUp,
      onContextMenu: handleContextMenu,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    } = this.innerProps
    const typeMap: any = {
      ...numbers,
      [-2]: boom,
      [-1]: bomb,
      0: blank,
    }
    const rows = []

    console.log('render')

    if (!blockMap) {
      // not starting
      return <div></div>
    }

    for (let row = 0; row <= rowNum - 1; ++row) {
      const blocks = []

      for (let col = 0; col <= colNum - 1; ++col) {
        const block = blockMap[row * colNum + col]

        if (status !== 'ongoing') {
          block.isFlipped = true

          if (status === 'completed') {
            if (block.type === -1) {
              block.isMarked = true
            }
          } else {
            block.isMarked = false
          }
        }

        blocks.push(
          <Block
            key={`${row}-${col}`}
            back={back}
            front={typeMap[block.type]}
            mark={mark}
            isMarked={block.isMarked}
            isFlipped={block.isFlipped}
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
