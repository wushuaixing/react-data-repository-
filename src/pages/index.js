import {BrowserRouter as Router, BrowserRouter, Route, Switch} from 'react-router-dom'
import AuditManagement from './auditManagement';
import DocumentSearch from './documentSearch';
import AccountService from './accountService';
import AuditMG from './auditMG';
import CustomerManagement from './CustomerManagement';
import SubAdminAccount from './subAdminAccount';
import UserDetails from './userDetails';

import Header from './header';
import './style.scss';
import Cookies from 'js-cookie'

import React, {Component} from 'react';
import SideMenu from "../sideMenu";
import Login from "./login";
import StructureAsset from "./strucAsset";
import StructureDetail from "./structure/detail";
import Check from "./check";
import AccountManage from "./admin/accountManage";

class Index extends Component {

    render() {
        return (
            <div className="home">
                <Header />
                <BrowserRouter>
                    <SideMenu />
                    <Switch>
                        <Route path="/" component={Login} />
                        {/* 当 url 为/时渲染 Dashboard */}
                        {/*<IndexRoute component={Login} />*/}
                        <Route path="/structureAsset" exact component={StructureAsset} />
                        <Route path="/structureAsset/:Id/:status" exact component={StructureDetail} />
                        <Route path="/page/ws" exact component={Check} />
                        <Route path="/admin/account"  exact component={AccountManage} />
                        {/*<Route exact path="/auditManagement" component={AuditManagement}/>
                        <Route exact path="/documentSearch" component={DocumentSearch}/>
                        <Route exact path="/accountService" component={AccountService}/>
                        <Route exact path="/auditMG" component={AuditMG}/>
                        <Route exact path="/customerManagement" component={CustomerManagement}/>
                        <Route exact path="/subAdminAccount" component={SubAdminAccount}/>
                        <Route exact path="/userDetails" component={UserDetails}/>*/}
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default Index;

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token,expires) {
    //如果有失效时间，就设置。默认是浏览器关闭将丢失
    if(expires !== undefined){
        return Cookies.set(TokenKey,token,expires);
    }else{
        return Cookies.set(TokenKey, token)
    }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
