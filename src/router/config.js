/**
 * created by anran on 2020-02-13.
 */
import React, { Component } from "react";
import {Route, Switch, withRouter} from "react-router";
import Login from "../pages/login";
import StructureAsset from "../pages/home";
import StructureDetail from "../pages/structure/detail";
import Check from "../pages/check";
import {BrowserRouter as Router} from "react-router-dom";
import AccountManage from "../pages/admin/accountManage";

class Routers extends Component {
	/**
	 * 生命周期函数
	 *
	 */
	// 组件挂载
	componentDidMount() {
		console.log(this.props.location);
	}
	render() {
		return (
			<div>
				<Router>
					<Route path="/" component={Login}>
						{/* 当 url 为/时渲染 Dashboard */}
						{/*<IndexRoute component={Login} />*/}
						<Route path="/structureAsset" exact component={StructureAsset} />
						<Route path="/structureAsset/:Id/:status" exact component={StructureDetail} />
						<Route path="/page/ws" exact component={Check} />
						<Route path="/admin/account"  exact component={AccountManage} />
					</Route>
				</Router>
			</div>
		);
	}
}
export default Routers;


