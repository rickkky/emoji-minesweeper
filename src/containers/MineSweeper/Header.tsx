import React from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import TwemojiContext from './TwemojiContext'
import Emoji from '../../components/emoji'
import noop from '../../utils/noop'

type Props = {
  classBlock: string
  ongoing: string
  completed: string
  failed: string
  frightened: string
  hovered: string
  status: 'ongoing' | 'completed' | 'failed'
  isFrightened: boolean
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  onClick: noop as (e: React.MouseEvent<HTMLDivElement>) => void,
})

const getProps = createPropsGetter(defaultProps)

const Header: React.FC<Props> = (props) => {
  const {
    classBlock,
    ongoing,
    completed,
    failed,
    frightened,
    hovered,
    status,
    isFrightened,
    onClick: handleClick,
  } = getProps(props)

  let face = ''

  if (status === 'completed') {
    face = completed
  } else if (status === 'failed') {
    face = failed
  } else {
    face = ongoing

    if (isFrightened) {
      face = frightened
    }
  }

  return (
    <TwemojiContext.Consumer>
      {(twemojiEnabled) => (
        <div className={`${classBlock}__header`} onClick={handleClick}>
          <Emoji className={`${classBlock}__status`} isTwemoji={twemojiEnabled}>
            {face}
          </Emoji>
          <Emoji
            className={`${classBlock}__status ${classBlock}__status--hovered`}
            isTwemoji={twemojiEnabled}
          >
            {hovered}
          </Emoji>
        </div>
      )}
    </TwemojiContext.Consumer>
  )
}

Header.defaultProps = defaultProps

export default Header
