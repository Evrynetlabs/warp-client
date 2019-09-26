import { connect } from 'react-redux'
import { compose } from 'redux'
import Result from 'Components/result/Result'
import { withRouter } from 'react-router'
import { push } from 'connected-react-router'

const withConnect = connect(
  null,
  { push },
)

export default compose(
  withRouter,
  withConnect,
)(Result)
