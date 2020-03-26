import React, { useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Route } from 'react-router'
import { ErrorPageComponent } from 'Components/errors'
import { isValidElementType } from 'react-is'

export default function HealthCheckRoute({ component: Component, ...rest }) {
  useLayoutEffect(() => {
    const fetchData = async () => {
      await rest.doHealthCheck()
    }
    fetchData()
  }, [])

  return (
    <Route
      {...rest}
      render={(props) => {
        return rest.healthCheck.loading ? null : rest.healthCheck.state ? (
          <Component {...props} />
        ) : (
          <ErrorPageComponent></ErrorPageComponent>
        )
      }}
    />
  )
}

const elementTypePropTypeChecker = (props, propName, componentName) => {
  if (props[propName] && !isValidElementType(props[propName])) {
    return new Error(
      `Invalid prop '${propName}' supplied to '${componentName}': the prop is not a valid React component`,
    )
  }
}

HealthCheckRoute.propTypes = {
  healthCheck: PropTypes.shape({
    state: PropTypes.bool,
    loading: PropTypes.bool,
    error: PropTypes.object,
  }).isRequired,
  component: elementTypePropTypeChecker,
  doHealthCheck: PropTypes.func.isRequired,
}
