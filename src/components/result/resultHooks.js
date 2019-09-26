import { useState } from 'react'
import classNames from 'classnames'
import config from '@/config'
const {
  chain: { STELLAR, EVRYNET },
} = config

export const useInitStyles = () => {
  const _initStyles = () => {
    const main = classNames({
      Result: true,
    })
    const content = `${main}__content`
    const redirect = `${main}__redirect`
    const title = `${content}__title`
    const body = `${content}__body`
    const footer = `${content}__footer`
    const footerContent = `${footer}__content`
    const footerContentBody = `${footerContent}__body`
    const amount = `${body}__amount`
    const status = `${body}__status`
    const account = `${body}__account`
    const accountText = `${account}__text`
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
      accountText,
      redirect,
      footerContent,
      footerContentBody,
    }
  }
  const [styles] = useState(_initStyles())

  return { styles }
}

export const useSourceDestinationType = (isToEvrynet) => {
  const __getChain = (isToEvrynet) => {
    if (isToEvrynet) {
      return {
        src: STELLAR,
        dest: EVRYNET,
      }
    }
    return {
      src: EVRYNET,
      dest: STELLAR,
    }
  }
  const [chain] = useState(__getChain(isToEvrynet))
  return { chain }
}
