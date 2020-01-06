import React from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import Checkbox from '../../components/Checkbox'

type Props = {
  classBlock: string
  back: string
  front: string
  mark: string
  onMouseUp?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onMouseEnter?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onMouseLeave?: (e: React.MouseEvent<HTMLSpanElement>) => void
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  isMarked: false,
  isFlipped: false,
})

const getProps = createPropsGetter(defaultProps)

const GameBlock: React.FC<Props> = (props) => {
  const {
    classBlock,
    isFlipped,
    isMarked,
    back,
    front,
    mark,
    onMouseUp: handleMouseUp,
    onContextMenu: handleContextMenu,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  } = getProps(props)

  return (
    <span
      className={`${classBlock}__block`}
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Checkbox
        className={`${classBlock}__checkbox`}
        indeterminate={isMarked}
        checked={isFlipped}
      >
        {isMarked ? mark : isFlipped ? front : back}
      </Checkbox>
    </span>
  )
}

GameBlock.defaultProps = defaultProps

export default GameBlock
