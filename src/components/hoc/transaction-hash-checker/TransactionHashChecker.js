import React, { useEffect, useState } from 'react'
import { withRouter, Redirect } from 'react-router'
import PropTypes from 'prop-types'

export default function requiredTransactionHash(Component) {
  const TransactionHashChecker = (props) => {
    const [isAuthenticated, userHasAuthenticated] = useState(false)
    const [pending, setPending] = useState(true)

    useEffect(() => {
      onLoad()
      setPending(false)
    }, [pending])

    function onLoad() {
      userHasAuthenticated(!!props.txHashes.state || !!props.txHashes.error)
    }
    if (pending) return null
    return isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
  }

  TransactionHashChecker.propTypes = {
    txHashes: PropTypes.shape({
      state: PropTypes.shape({
        stellar: PropTypes.string,
        evrynet: PropTypes.string,
      }),
      loading: PropTypes.bool,
      error: PropTypes.object,
    }),
  }
  return withRouter(TransactionHashChecker)
}
