import requiredTransactionHash from 'Components/hoc/TransactionHashChecker'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { selectCollectedTxHashes } from 'Components/hoc/transactionHashCheckerSelectors'

const mapStateToProps = (state) => ({
  txHashes: selectCollectedTxHashes(state),
})

const withConnect = connect(mapStateToProps)

export default compose(
  withConnect,
  requiredTransactionHash,
)
