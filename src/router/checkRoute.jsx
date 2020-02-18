import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import CheckList from "../pages/check";
import StructureDetail from "../pages/structure/detail";


class Index extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={CheckList} />
        <Route path="/index/check"  component={CheckList} />
        <Route path="/index/:Id/:status" component={StructureDetail} />
      </div>
    )
  }
}

export default Index
