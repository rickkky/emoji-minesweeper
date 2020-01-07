import React, { Fragment } from 'react'
import { createPropsGetter, createDefaultProps } from 'create-props-getter'
import twemoji from 'twemoji'
import combineClassNames from 'combine-class-names'
import './Emoji.scss'

type Props = {
  key?: string
  className?: string
  size?: number
} & Partial<typeof defaultProps>

const defaultProps = createDefaultProps({
  children: '',
  isTwemoji: true,
})

const getProps = createPropsGetter(defaultProps)

const Twemoji: React.FC<Props> = (props) => {
  const { children, key } = getProps(props)
  const nodes: React.ReactNode[] = []
  let index = 0

  twemoji.parse(children, {
    folder: 'svg',
    ext: '.svg',
    callback: (code: string, options: any) => {
      nodes.push(
        <img
          key={`${key || ''}--${++index}`}
          className='emoji__twemoji'
          draggable='false'
          alt={twemoji.convert.fromCodePoint(code)}
          src={`${options.base}${options.size}/${code}${options.ext}`}
        />,
      )
      return ''
    },
  })

  return <Fragment>{nodes}</Fragment>
}

Twemoji.defaultProps = defaultProps

const Emoji: React.FC<Props> = (props) => {
  const { className, children, isTwemoji, key, size } = getProps(props)

  return (
    <span
      key={key}
      className={combineClassNames(className || '', 'emoji', {
        'emoji--twemoji': isTwemoji,
      }).join(' ')}
      style={
        size
          ? {
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${size}px`,
              lineHeight: `${size}px`,
            }
          : undefined
      }
      role='img'
      aria-label={children}
    >
      {isTwemoji ? <Twemoji {...props} /> : children}
    </span>
  )
}

Emoji.defaultProps = defaultProps

export default Emoji
