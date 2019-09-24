import { connect } from 'react-redux'
import { compose } from 'redux'
import Warp from 'Components/warp/Warp'
import {
  isToEvrynetSelector,
  selectCollectedTxHashes,
  selectWhitelistedAssets,
  selectAccountBalance,
} from 'Components/warp/warpSelectors'
import {
  toEvrynet,
  toStellar,
  getWhitelistAssets,
  toggleTransferSwitch,
  getAccountBalance,
} from 'Components/warp/warpActions'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router'

const mapStateToProps = (state) => ({
  isToEvrynet: isToEvrynetSelector(state),
  txHashes: selectCollectedTxHashes(state),
  whitelistedAssets: selectWhitelistedAssets(state),
  accountBalance: selectAccountBalance(state),
})

const mapDispatchToProps = (dispatch) => {
  return {
    toEvrynet: (payload) => dispatch(toEvrynet(payload)),
    toStellar: (payload) => dispatch(toStellar(payload)),
    getWhitelistAssets: () => dispatch(getWhitelistAssets()),
    toggleTransferSwitch: () => dispatch(toggleTransferSwitch()),
    getAccountBalance: (payload) => dispatch(getAccountBalance(payload)),
    push: (location) => dispatch(push(location)),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withRouter,
  withConnect,
)(Warp)
