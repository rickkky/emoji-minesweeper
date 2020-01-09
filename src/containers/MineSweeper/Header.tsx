import React, { useState } from 'react'
import { GameStatus } from './Game'
import { classBlock } from './constants'
import Emoji from '../../components/emoji'

type Props = {
  status: GameStatus
  isScared: boolean
  smiley: string
  happy: string
  sad: string
  scared: string
  calm: string
  onClick: (e: React.MouseEvent) => void
}

const Header: React.FC<Props> = (props) => {
  const {
    status,
    isScared,
    smiley,
    happy,
    sad,
    scared,
    calm,
    onClick: handleClick,
  } = props

  const [isCalm, setIsCalm] = useState(false)

  let face = smiley

  if (isCalm) {
    face = calm
  } else if (isScared) {
    face = scared
  } else if (status === 'failed') {
    face = sad
  } else if (status === 'completed') {
    face = happy
  }

  return (
    <div
      className={`${classBlock}__header`}
      onClick={handleClick}
      onMouseEnter={() => setIsCalm(true)}
      onMouseLeave={() => setIsCalm(false)}
    >
      <Emoji isTwemoji>{face}</Emoji>
    </div>
  )
}

export default Header
