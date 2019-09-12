import { connect } from 'react-redux'
import { compose } from 'redux'
import Warp from 'Components/warp/Warp'
import {
  isToEvrySelector,
  selectCollectedTxHashes,
  selectWhitelistedAssets,
} from 'Components/warp/warpSelectors'
import {
  toEvry,
  toStellar,
  getWhitelistAssets,
  toggleTransferSwitch,
} from 'Components/warp/warpActions'

const mapStateToProps = (state) => ({
  isToEvry: isToEvrySelector(state),
  txHashes: selectCollectedTxHashes(state),
  whitelistedAssets: selectWhitelistedAssets(state),
})

const mapDispatchToProps = (dispatch) => {
  return {
    toEvry: (payload) => dispatch(toEvry(payload)),
    toStellar: (payload) => dispatch(toStellar(payload)),
    getWhitelistAssets: () => dispatch(getWhitelistAssets()),
    toggleTransferSwitch: () => dispatch(toggleTransferSwitch()),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(withConnect)(Warp)
