import { connect } from 'react-redux'
import { compose } from 'redux'
import Warp from 'Components/warp/Warp'
import { collectTxHashes } from 'Components/warp/warpSelectors'
import { toEvry } from 'Components/warp/warpActions'

const mapStateToProps = (state) => ({
  txHashes: collectTxHashes(state),
})

const mapDispatchToProps = (dispatch) => {
  return {
    toEvry: (payload) => dispatch(toEvry(payload)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(withConnect)(Warp)
