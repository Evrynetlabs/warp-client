import React from 'react'
import { Route, Switch } from 'react-router'
import { WarpComponent } from 'Components/warp'
import { ResultComponent } from 'Components/result'
//import { WithRequireTransactionHash } from 'Components/hoc'

const routes = (
  <Switch>
    <Route exact path="/" component={WarpComponent}></Route>
    <Route path="/result" component={ResultComponent}></Route>
  </Switch>
)

export default routes
