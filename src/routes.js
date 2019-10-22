import React from 'react'
import { Route, Switch } from 'react-router'
import { WarpComponent } from 'Components/warp'
import { ResultComponent } from 'Components/result'

const routes = (
  <Switch>
    <Route exact path="/" component={WarpComponent}></Route>
    <Route path="/result" component={ResultComponent}></Route>
  </Switch>
)

export default routes
