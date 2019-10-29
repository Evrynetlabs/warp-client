import requiredTransactionHash from 'Components/hoc/transaction-hash-checker/TransactionHashChecker'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectCollectedTxHashes } from 'Components/hoc/transaction-hash-checker/transactionHashCheckerSelectors'

const mapStateToProps = (state) => ({
  txHashes: selectCollectedTxHashes(state),
})

const withConnect = connect(mapStateToProps)

export default compose(
  withConnect,
  requiredTransactionHash,
)
