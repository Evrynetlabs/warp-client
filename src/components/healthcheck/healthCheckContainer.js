import { connect } from 'react-redux'
import { compose } from 'redux'
import HealthCheckRoute from 'Components/healthcheck/HealthCheck'
import { selectHealthCheck } from 'Components/healthcheck/healthCheckSelectors'
import { doHealthCheck } from 'Components/healthcheck/healthCheckActions'

const mapStateToProps = (state) => ({
  healthCheck: selectHealthCheck(state),
})

const mapDispatchToProps = (dispatch) => {
  return {
    doHealthCheck: () => dispatch(doHealthCheck()),
  }
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(withConnect)(HealthCheckRoute)
