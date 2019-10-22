import withLoading from 'Components/hoc/loading/Loading'
import {
  startLoading,
  stopLoading,
} from 'Components/hoc/loading/loadingActions'
import { compose } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  loadingObjs: state.loading,
})

const mapDispatchToProps = (dispatch) => ({
  startLoading: (loadingID) => dispatch(startLoading(loadingID)),
  stopLoading: (loadingID) => dispatch(stopLoading(loadingID)),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  withLoading,
)
