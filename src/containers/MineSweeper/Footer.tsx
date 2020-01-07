import React from 'react'

type Props = {
  classBlock: string
  bombNum: number
  markedNum: number
  stepNum: number
  time: number
}

const Footer: React.FC<Props> = (props) => {
  const { classBlock, bombNum, markedNum, stepNum, time } = props

  return (
    <div className={`${classBlock}__footer`}>
      <div className={`${classBlock}__bomb-counter`}>
        <span>
          {bombNum - markedNum} / {bombNum}
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
