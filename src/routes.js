import React from 'react'
import { Switch, Redirect } from 'react-router'
import { WarpComponent } from 'Components/warp'
import { HealthCheckRoute } from 'Components/healthcheck'

const routes = (
  <Switch>
    <HealthCheckRoute
      exact
      path="/"
      component={WarpComponent}
    ></HealthCheckRoute>
    <Redirect from="/:else" to="/" />
  </Switch>
)

export default routes
