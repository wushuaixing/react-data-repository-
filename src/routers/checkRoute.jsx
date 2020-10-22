import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from '@/pages/asset-structure-detail';
import DebtList from "../pages/debt-structure/list";

const ContentMain = [
  <CacheRoute path="/index" exact component={AssetList} key='AssetList'  when="always"/>,
  <CacheRoute path="/index/debtList" exact component={DebtList} key='DebtList'  when="always"/>,
  <Route path={"/index/structureDetail/:status/:id"} component={StructureDetail} key='StructureDetail' />
];

export default ContentMain
