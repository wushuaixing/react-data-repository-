import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import { message } from 'antd';
import Login from "./login";
import Home from "./home";
import DocumentDetail from "../pages/externalSource/document";
import AuctionDetail from "../pages/externalSource/auction";
import NotFound from './errorPage/notFound'
import DocumentSearch from "../pages/documentSearch";
import NotFirstMark from '@/pages/assetStructureDetailNewPage/notFirstMark/index'
import AutoMark from '@/pages/assetStructureDetailNewPage/autoMark/index'

message.config({ maxCount:1 });

// TODO 缺少权限判断

class App extends React.Component {
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/" exact component={Home} remark="默认界面"/>
					<Route path="/login" component={Login} remark="登录界面" />
					<Route path="/index" component={Home} remark="首页" />
					<Route path="/documentSearch" component={DocumentSearch}  remark="文书搜索" />
					<Route path="/documentDetail/:Id/:content" component={DocumentDetail} remark="文书搜索-详情页" />
					<Route path="/auctionDetail/:auctionID" component={AuctionDetail} remark="关联链接-详情页" />
					{/*<Route path="/auctionDetail" component={AuctionDetail} remark="登录界面" />*/}
					<Route path="/notFirstMark" component={NotFirstMark} remark="非初标-详情页" />
					<Route path="/autoMark" component={AutoMark} remark="自动标注-详情页" />
					<Route path="*" component={NotFound} remark="非注册页面" />
				</Switch>
			</Router>
		)
	}
}

export default App;
