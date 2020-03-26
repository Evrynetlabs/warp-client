import { useState, useEffect, useRef } from 'react'

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

export const useEventListener = (eventName, handler, element = window) => {
  // Create a ref that stores handler
  const savedHandler = useRef()

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported = element && element.addEventListener
      if (!isSupported) return

      // Create event listener that calls handler function stored in ref
      const eventListener = (event) => savedHandler.current(event)

      // Add event listener
      element.addEventListener(eventName, eventListener)

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener)
      }
    },
    [eventName, element], // Re-run if eventName or element changes
  )
}
