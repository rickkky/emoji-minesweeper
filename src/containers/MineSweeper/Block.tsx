import React from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import { ItemStatus, BombNum } from './Game'
import { classBlock, numbers } from './constants'
import Emoji from '../../components/emoji'

type Props = {
  back: string
  blank: string
  mark: string
  bomb: string
  boom: string
  onMouseUp?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLSpanElement>) => void
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  isBomb: false,
  bombNum: 0 as BombNum,
  status: 'pending' as ItemStatus,
})

const getProps = createPropsGetter(defaultProps)

const Block: React.FC<Props> = (props) => {
  const {
    isBomb,
    bombNum,
    status,
    back,
    blank,
    mark,
    bomb,
    boom,
    onMouseUp: handleMouseUp,
    onContextMenu: handleContextMenu,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  } = getProps(props)
  const myNumbers = { ...numbers, 0: blank }

  console.log(status)

  return (
    <span
      className={`${classBlock}__block ${classBlock}__block--${status}`}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Emoji isTwemoji>
        {status === 'pending'
          ? back
          : status === 'marked'
          ? mark
          : status === 'detonated'
          ? boom
          : isBomb
          ? bomb
          : (myNumbers as any)[bombNum]}
      </Emoji>
    </span>
  )
}

Block.defaultProps = defaultProps

export default Block
