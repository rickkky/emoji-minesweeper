import React from 'react'
import { classBlock } from './constants'

type Props = {
  bombNum: number
  markNum: number
  stepNum: number
  time: number
}

const Footer: React.FC<Props> = (props) => {
  const { bombNum, markNum, stepNum, time } = props

  return (
    <div className={`${classBlock}__footer`}>
      <div className={`${classBlock}__bomb-counter`}>
        <span>
          {bombNum - markNum} / {bombNum}
        </span>
        <span>BOMBS</span>
      </div>
      <div className={`${classBlock}__step-counter`}>
        <span>{stepNum}</span>
        <span>STEPS</span>
      </div>
      <div className={`${classBlock}__time-counter`}>
        <span>{(time / 1000).toFixed(3)}</span>
        <span>TIME</span>
      </div>
    </div>
  )
}

export default Footer
