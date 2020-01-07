import React from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import TwemojiContext from './TwemojiContext'
import Checkbox from '../../components/checkbox'
import Emoji from '../../components/emoji'

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
    <TwemojiContext.Consumer>
      {(value) => (
        <span
          className={`${classBlock}__block`}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Checkbox
            classBlock={`${classBlock}__checkbox`}
            indeterminate={isMarked}
            checked={isFlipped}
          >
            <Emoji isTwemoji={value}>
              {isMarked ? mark : isFlipped ? front : back}
            </Emoji>
          </Checkbox>
        </span>
      )}
    </TwemojiContext.Consumer>
  )
}

GameBlock.defaultProps = defaultProps

export default GameBlock
