import React, { useState } from 'react'
import createPropsGetter, {
  createDefaultProps,
  WithDefault,
} from 'create-props-getter'
import combineClassNames from 'combine-class-names'
import './Checkbox.scss'

export interface CheckboxChangeEvent {
  target: CheckboxInnerProps
  nativeEvent: Event
  stopPropagation: () => void
  preventDefault: () => void
}

export type CheckboxProps = Props

export interface CheckboxInnerProps
  extends WithDefault<Props, typeof defaultProps> {
  checked: boolean
}

interface Props extends Partial<typeof defaultProps> {
  id?: string
  className?: string
  style?: React.CSSProperties
  checked?: boolean
  role?: string
  name?: string
  disabled?: boolean
  autoFocus?: boolean
  inputRef?: React.RefObject<HTMLInputElement>
  children?: React.ReactNode
  onChange?: (e: CheckboxChangeEvent) => void
  onClick?: (e: React.MouseEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

const defaultProps = createDefaultProps({
  classBlock: 'ric-checkbox',
  defaultChecked: false,
  indeterminate: false,
})

const getProps = createPropsGetter(defaultProps)

const Checkbox: React.FC<Props> = (props: Props) => {
  const {
    id,
    className,
    classBlock,
    style,
    role,
    name,
    defaultChecked,
    checked,
    indeterminate,
    disabled,
    autoFocus,
    inputRef,
    children,
    onChange,
    onClick: handleClick,
    onFocus: handleFocus,
    onBlur: handleBlur,
  } = getProps(props)

  const [innerChecked, setInnerChecked] = useState(
    indeterminate
      ? true
      : typeof checked === 'boolean'
      ? checked
      : defaultChecked,
  )

  const realChecked = indeterminate
    ? true
    : typeof checked === 'boolean'
    ? checked
    : innerChecked

  const containerClassName = combineClassNames(
    className || '',
    `${classBlock}`,
    {
      [`${classBlock}--checked`]: realChecked,
      [`${classBlock}--indeterminate`]: indeterminate,
      [`${classBlock}--disabled`]: !!disabled,
    },
  ).join(' ')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) {
      return
    }

    if (!(typeof checked === 'boolean')) {
      setInnerChecked(e.target.checked)
    }

    if (onChange) {
      onChange({
        target: {
          ...getProps(props),
          checked: e.target.checked,
        },
        nativeEvent: e.nativeEvent,
        stopPropagation() {
          e.stopPropagation()
        },
        preventDefault() {
          e.preventDefault()
        },
      })
    }
  }

  return (
    <span className={containerClassName} style={style}>
      <input
        ref={inputRef}
        id={id}
        className={`${classBlock}__input`}
        name={name}
        type='checkbox'
        checked={realChecked}
        disabled={disabled}
        autoFocus={autoFocus}
        role={role}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <span className={`${classBlock}__inner`}>{children}</span>
    </span>
  )
}

Checkbox.defaultProps = defaultProps

export default Checkbox
