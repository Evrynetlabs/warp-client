import React, { useState } from 'react'
import classNames from 'classnames'
import 'Components/shared/select.scss'
import map from 'lodash/map'
import PropTypes from 'prop-types'
import { useInitStyles } from 'Components/shared/selectHooks'

export default function Select(props) {
  const [isOpen, setOpen] = useState(false)
  const { styles } = useInitStyles()
  const { options, selectedItem, children, onChange } = props

  function renderOptions() {
    return map(options, (option, idx) => {
      const itemClasses = classNames(styles.option, {
        [styles.optionSelected]: selectedItem === option.value,
      })
      return (
        <li
          className={itemClasses}
          key={idx}
          onClick={() => {
            onChange({
              name: option.name,
              value: option.value,
            })
          }}
        >
          {option.label}
        </li>
      )
    })
  }

  function handleClick() {
    setOpen(!isOpen)
  }

  let optionsElem = options ? renderOptions(options) : children

  return (
    <div className={styles.main}>
      <div
        className={styles.value}
        onClick={(e) => {
          handleClick(e)
        }}
      >
        <span className={styles.valueText}>
          {selectedItem ? selectedItem || '' : ''}
        </span>
        {isOpen ? (
          <i className="fas fa-angle-up"></i>
        ) : (
          <i className="fas fa-angle-down"></i>
        )}
      </div>
      <ul
        className={classNames(styles.options, {
          [styles.optionsOpened]: isOpen,
        })}
      >
        {optionsElem}
      </ul>
    </div>
  )
}

Select.propTypes = {
  options: PropTypes.array,
  selectedItem: PropTypes.string,
  children: PropTypes.element,
  onChange: PropTypes.func,
}
