import { useState } from 'react'
import classNames from 'classnames'

export const useInitStyles = () => {
  const _initStyles = () => {
    const main = classNames({
      Result: true,
    })
    const content = `${main}__content`
    const title = `${content}__title`
    const body = `${content}__body`
    const footer = `${main}__footer`
    const amount = `${body}__amount`
    const status = `${body}__status`
    const account = `${body}__account`
    const swap = `${body}__swap`
    return {
      main,
      content,
      title,
      footer,
      body,
      amount,
      status,
      account,
      swap,
    }
  }
  const [styles] = useState(_initStyles())

  return { styles }
}
