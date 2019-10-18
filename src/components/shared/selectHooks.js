import { useState } from 'react'

export const useInitStyles = () => {
  const _initStyles = () => {
    const main = 'ui-select'
    const value = `${main}__value-display`
    const valueText = `${value}__text`
    const options = `${main}__options`
    const optionsOpened = `${options}--opened`
    const option = `${main}__option`
    const optionSelected = `${option}--selected`
    return {
      main,
      value,
      valueText,
      options,
      optionsOpened,
      option,
      optionSelected,
    }
  }
  const [styles] = useState(_initStyles())
  return { styles }
}
