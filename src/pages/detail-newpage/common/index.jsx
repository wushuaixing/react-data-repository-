import React from "react";
import { withRouter, Route, Switch } from "react-router-dom";
import StructureDetail from "@/pages/asset-structure-detail";
class index extends React.Component {
  render() {
    return (
      <div className="yc-detail-newpage yc-right-content">
        <Switch>
          <Route
            path="/defaultDetail/:status/:id"
            component={StructureDetail}
            remark="详情页"
          />
        </Switch>
      </div>
    );
  }
}
export default withRouter(index);
