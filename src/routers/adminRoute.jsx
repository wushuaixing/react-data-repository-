import React from 'react'
//引入路由
import { Route } from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import StructureAccount from "../pages/accountManagement/structure";
import CheckAccount from "../pages/accountManagement/check";
import StructureDetail from "@/pages/assetStructureDetail/admin";
import SyncMonitor from "../pages/syncMonitor";
import StructMonitor from "../pages/structMonitor";
import AssetList from '../pages/assetStructureList'

const ContentMain = [
	<Route path="/index"  exact component={StructureAccount} key='a1'/>,
	<Route path="/index/structureUser"  component={StructureAccount} key='a2' />,
	<Route path="/index/checkUser" exact component={CheckAccount} key='a3'/>,
	<CacheRoute path="/index/assetList" component={AssetList} key='a7' when="always"/>,
	<Route path="/index/structureDetail/:status/:id" component={StructureDetail} key='a4'/>,
	<Route path="/index/syncMonitor" component={SyncMonitor} key='a5'/>,
	<Route path="/index/structureMonitor" component={StructMonitor} key='a6'/>,
];

export default ContentMain
