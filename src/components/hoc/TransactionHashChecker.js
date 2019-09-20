import React, { useEffect, useState } from 'react'
import { withRouter, Redirect } from 'react-router'
import PropTypes from 'prop-types'

export default function requiredTransactionHash(Component) {
  const TransactionHashChecker = (props) => {
    const [isAuthenticated, userHasAuthenticated] = useState(false)

    useEffect(() => {
      onLoad()
    }, [])

    async function onLoad() {
      userHasAuthenticated(!!props.txHashes.state && !!props.txHashes.error)
    }

    return isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
  }

  TransactionHashChecker.propTypes = {
    txHashes: PropTypes.shape({
      state: PropTypes.shape({
        stellar: PropTypes.string,
        evry: PropTypes.string,
      }),
      loading: PropTypes.bool,
      error: PropTypes.object,
    }),
  }
  return withRouter(TransactionHashChecker)
}
