import React from 'react'
import { Route, Switch } from 'react-router'
import { WarpComponent } from 'Components/warp'
import { ResultComponent } from 'Components/result'
import { WithRequireTransactionHash } from 'Components/hoc'

const routes = (
  <div>
    <Switch>
      <Route exact path="/" component={WarpComponent}></Route>
      <Route
        path="/result"
        component={WithRequireTransactionHash(ResultComponent)}
      ></Route>
    </Switch>
  </div>
)

export default routes
