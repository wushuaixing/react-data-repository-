import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import { message } from 'antd';
import Login from "./login";
import Home from "./home";
import DocumentDetail from "../pages/externalSource/document";
import AuctionDetail from "../pages/externalSource/auction";
import NotFound from './errorPage/notFound'
import DocumentSearch from "../pages/documentSearch";
import AutoMark from './detail-newpage/autoMark/index';
import NotFirstMark from './detail-newpage/notFirstMark/index';
import DetailNewPage from './detail-newpage/common/index';
import HouseHoldDetail from './debt-structure/house-hold-detail';

message.config({
	maxCount:1,
	top:300,
});

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
					<Route path="/documentDetail/:Id/:wid/:content" component={DocumentDetail} remark="文书搜索-详情页" />
					<Route path="/auctionDetail/:auctionID/:isDebt/:type" component={AuctionDetail} remark="关联链接-详情页" />
					{/*<Route path="/auctionDetail" component={AuctionDetail} remark="登录界面" />*/}
					<Route path="/notFirstMark" component={NotFirstMark} remark="非初标-详情页" />
					<Route path="/autoMark" component={AutoMark} remark="自动标注-详情页" />
					<Route path="/defaultDetail" component={DetailNewPage} remark="详情-新开页" />
					<Route path="/houseHoldDetail/:packageId/:id/:type/:isEdit/:debtId/:debtorsId" component={ HouseHoldDetail } remark="债权结构化-户详情页" />
					<Route path="/unknownRelationShipDetail/:packageId/:id/:type/:isEdit/:debtId" component={ HouseHoldDetail } remark="债权结构化-户详情页" />
					<Route path="*" component={NotFound} remark="非注册页面" />
				</Switch>
			</Router>
		)
	}
}

export default App;
