import { connect } from 'react-redux'
import { compose } from 'redux'
import Warp from 'Components/warp/Warp'
import {
  selectCollectedTxHashes,
  selectWhitelistedAssets,
} from 'Components/warp/warpSelectors'
import { toEvry, getWhitelistAssets } from 'Components/warp/warpActions'

const mapStateToProps = (state) => ({
  txHashes: selectCollectedTxHashes(state),
  whitelistedAssets: selectWhitelistedAssets(state),
})

const mapDispatchToProps = (dispatch) => {
  return {
    toEvry: (payload) => dispatch(toEvry(payload)),
    getWhitelistAssets: () => dispatch(getWhitelistAssets()),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(withConnect)(Warp)
