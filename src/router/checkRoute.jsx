import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import CheckList from "../pages/check";


class Index extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={CheckList} />
      </div>
    )
  }
}

export default Index
