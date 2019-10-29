import React from 'react'
import { Route, Switch } from 'react-router'
import { WarpComponent } from 'Components/warp'

const routes = (
  <Switch>
    <Route exact path="/" component={WarpComponent}></Route>
  </Switch>
)

export default routes
