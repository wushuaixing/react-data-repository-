import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import history from "../history";
import Login from "./login";
import Home from "./home";
import DocumentDetail from "../pages/externalSource/document";
import AuctionDetail from "../pages/externalSource/auction";
import NotFound from './notFound'
import DocumentSearch from "../pages/documentSearch";
import NotFirstMark from '@/pages/assetStructureDetailNewPage/notFirstMark/index'
import AutoMark from '@/pages/assetStructureDetailNewPage/autoMark/index'
class App extends React.Component {
	render(){
		return(
			<Router history={history}>
				<div>
					<Switch>
						<Route path="/" exact component={Login} />
						<Route path="/login" component={Login} />
						<Route path="/index" component={Home} />
						<Route path="/documentSearch" component={DocumentSearch} />
						<Route path="/documentDetail/:Id" component={DocumentDetail} />
						<Route path="/auctionDetail/:auctionID" component={AuctionDetail} />
						<Route path="/auctionDetail" component={AuctionDetail} />
						<Route path="/notFirstMark" component={NotFirstMark} />
						<Route path="/autoMark" component={AutoMark} />
						<Route path="*" component={NotFound} />
					</Switch>
				</div>
			</Router>
		)
	}
}
export default App;