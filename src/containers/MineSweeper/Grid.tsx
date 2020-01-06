import React, { PureComponent } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import Block from './Block'
import { BlockMap } from './game'
import noop from '../../utils/noop'

type Props = {
  classBlock: string
  back: string
  blank: string
  mark: string
  bomb: string
  boom: string
  rowNum: number
  colNum: number
  status: 'ongoing' | 'completed' | 'failed'
  blockMap?: BlockMap
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

const numbers = ['', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']

export default class Grid extends PureComponent<Props> {
  static defaultProps = defaultProps

  get innerProps() {
    return getProps(this.props)
  }

  render() {
    const {
      classBlock,
      back,
      blank,
      mark,
      bomb,
      boom,
      rowNum,
      colNum,
      status,
      blockMap,
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

    for (let row = 0; row <= rowNum - 1; ++row) {
      const blocks = []

      for (let col = 0; col <= colNum - 1; ++col) {
        if (!blockMap) {
          blocks.push(
            <Block
              key={`${row}-${col}`}
              classBlock={classBlock}
              back={back}
              front={back}
              mark={mark}
              isMarked={false}
              isFlipped={false}
              onMouseUp={handleMouseUp.bind(undefined, row, col)}
              onMouseEnter={handleMouseEnter.bind(undefined, row, col)}
              onMouseLeave={handleMouseLeave.bind(undefined, row, col)}
            />,
          )
          continue
        }

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
            classBlock={classBlock}
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
