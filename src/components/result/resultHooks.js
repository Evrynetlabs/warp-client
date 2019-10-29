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

  function _getPageItems(props) {
    return {
      chain: _getChain(props.isToEvrynet),
      title: 'Transfer Complete',
    }
  }

  const [items] = useState(_getPageItems(props))
  return { items }
}
