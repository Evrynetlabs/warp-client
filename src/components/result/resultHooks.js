import React from 'react'
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
    const titleFailed = `${title}--failed`
    const body = `${content}__body`
    const footer = `${content}__footer`
    const footerContent = `${footer}__content`
    const footerContentBody = `${footerContent}__body`
    const amount = `${body}__amount`
    const status = `${body}__status`
    const statusFailed = `${status}--failed`
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
      titleFailed,
      statusFailed,
    }
  }
  const [styles] = useState(_initStyles())

  return { styles }
}

export const useGetPageTypeItems = (props) => {
  function _getChain(isToEvrynet) {
    return isToEvrynet
      ? {
          src: STELLAR,
          dest: EVRYNET,
        }
      : {
          src: EVRYNET,
          dest: STELLAR,
        }
  }

  function _getResultIcon(isSuccess) {
    return isSuccess ? (
      <i className="fas fa-check-circle" />
    ) : (
      <i className="fas fa-times-circle" />
    )
  }

  function _getResultTitle(isSuccess) {
    return isSuccess ? 'TRANSACTION CONFIRMED' : 'TRANSACTION FAILED'
  }

  function _getPageItems(props) {
    const isSuccess = !props.txHashes.error
    return {
      chain: _getChain(props.isToEvrynet),
      icon: _getResultIcon(isSuccess),
      title: _getResultTitle(isSuccess),
      isSuccess,
    }
  }

  const [items] = useState(_getPageItems(props))
  return { items }
}
