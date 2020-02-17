/** admin * */
import React from 'react';
import {Route,Switch} from "react-router-dom";

import StructureDetail from './detail';
import Asset from "./assetStruc";
// ==================
// 所需的所有组件
// ==================


class  Structure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/"  component={Asset} />
          <Route path="/:Id/:status" exact component={StructureDetail} />
        </Switch>
      </div>
    )
  }

}
export default Structure;
