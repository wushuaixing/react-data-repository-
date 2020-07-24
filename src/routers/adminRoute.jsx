import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import StructureAccount from "../pages/accountManagement/structure";
import CheckAccount from "../pages/accountManagement/check";
import StructureDetail from "@/pages/assetStructureDetail/admin";
import SyncMonitor from "../pages/syncMonitor";
import StructMonitor from "../pages/structMonitor";
import AssetList from '../pages/assetStructureList'
import BankruptList from "@/pages/bankrupt-structrue/list";

class ContentMain extends React.Component {
	render() {
		return (
			<div>
				<Route path="/index"  exact component={StructureAccount} />
				<Route path="/index/structureUser"  component={StructureAccount} />
				<Route path="/index/checkUser" exact component={CheckAccount} />
				<Route path="/index/assetList" component={AssetList} />
				<Route path="/index/structureDetail/:status/:id" component={StructureDetail} />
				<Route path="/index/syncMonitor" component={SyncMonitor} />
				<Route path="/index/structureMonitor" component={StructMonitor} />
				<Route path="/index/bankrupt" component={BankruptList} remark="破产列表" />

			</div>
		)
	}
}

export default ContentMain
