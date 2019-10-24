import React from 'react'
import { useState } from 'react'
import { ReactComponent as EvrynetIcon } from '@/assets/icons/evrynet-dark.svg'
import { ReactComponent as StellarIcon } from '@/assets/icons/stellar-dark.svg'

export const useGetPageTypeItems = (props) => {
  function _getChain(isToEvrynet) {
    return isToEvrynet
      ? {
          src: StellarIcon,
          dest: EvrynetIcon,
        }
      : {
          src: EvrynetIcon,
          dest: StellarIcon,
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
    return isSuccess ? 'Transfer Complete' : 'TRANSACTION FAILED'
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
