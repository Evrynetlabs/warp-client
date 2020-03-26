import withLoading from 'Components/hoc/loading/Loading'
import {
  startLoading,
  stopLoading,
} from 'Components/hoc/loading/loadingActions'
import { compose } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  isLoading: state.loading.isLoading,
})

const mapDispatchToProps = (dispatch) => ({
  startLoading: () => dispatch(startLoading()),
  stopLoading: () => dispatch(stopLoading()),
})

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  withLoading,
)
