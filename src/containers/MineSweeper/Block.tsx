import React from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import './Block.scss'
import Checkbox from '../../components/Checkbox'

type Props = {
  back: string
  front: string
  mark: string
  onMouseUp?: (e: React.MouseEvent<HTMLSpanElement>) => void
  onContextMenu?: (e: React.MouseEvent<HTMLSpanElement>) => void
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  isMarked: false,
  isFlipped: false,
})

const getProps = createPropsGetter(defaultProps)

const GameBlock: React.FC<Props> = (props) => {
  const {
    isFlipped,
    isMarked,
    back,
    front,
    mark,
    onMouseUp: handleMouseUp,
    onContextMenu: handleContextMenu,
  } = getProps(props)

  return (
    <span
      className='mine-sweeper__block'
      onMouseUp={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <Checkbox
        classBlock='mine-sweeper__checkbox'
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
