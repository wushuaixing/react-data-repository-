import React from 'react'
//引入路由
import {Route} from 'react-router-dom';
import CacheRoute from 'react-router-cache-route';
import AssetList from "../pages/assetStructureList/checkAccount";
import StructureDetail from '@/pages/asset-structure-detail';

const ContentMain = [
  <CacheRoute path="/index" exact component={AssetList} key='AssetList'  when="always"/>,
  <Route path={[
    "/index/structureDetail/:status/:id/:isNotConfirm/:tabIndex",
    "/index/structureDetail/:status/:id/:isNotConfirm"
  ]} component={StructureDetail} key='StructureDetail' />
];

export default ContentMain
