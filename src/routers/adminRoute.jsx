import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import StructureAccount from "../pages/accountManagement/structureAccount";
import CheckAccount from "../pages/accountManagement/checkAccount";
import DocumentSearch from "../pages/documentSearch";
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from "../pages/documentDetail";
import SyncMonitor from "../pages/syncMonitor";
import StructMonitor from "../pages/structMonitor";
import assetStructureList from '../pages/assetStructureList'

class ContentMain extends React.Component {
  render() {
    return (
      <div>
				<Route path="/index" exact component={StructureAccount} />
				<Route path="/index/checkUser" exact component={CheckAccount} />
				<Route path="/index/documentSearch" component={DocumentSearch} />
				<Route path="/index/assetList" component={AssetList} />
				<Route path="/index/:Id/:status/:page/:tabStatus" component={StructureDetail} />
				<Route path="/index/syncMonitor" component={SyncMonitor} />
				<Route path="/index/structureMonitor" component={StructMonitor} />
				<Route path="/index/assetStructureList" component={assetStructureList} />
	</div>
    )
  }
}

export default ContentMain
