/** home * */
import React from 'react';
import TopMenu from "../../components/layout/topMenu";
import LeftMenu from '../../components/layout/leftMenu';
import StructureRoute from "../../routers/structureRoute";
import AdminRoute from "../../routers/adminRoute";
import CheckRoute from "../../routers/checkRoute";
import { message,Layout } from 'antd';
import './style.scss'
import BankruptList from "@/pages/bankrupt-structrue/list";
import BankruptDetail from "@/pages/bankrupt-structrue/detail";
import {Route} from "react-router";

const { Header, Sider, Content } = Layout;


export default class HomeIndex extends React.Component {
  componentDidMount(){
    if(this.props.history.location.query&&this.props.history.location.query.info==='success'){
      message.success('登录成功!')
    }
  }
  render() {
      const user = window.localStorage.userName;
      const role = window.localStorage.userState;
      const Routes = [
        <Route path="/index/bankrupt" exact component={BankruptList} remark="破产结构化 - 列表" key='bankrupt'/>,
        <Route path="/index/bankrupt/detail/:status/:id" component={BankruptDetail} remark="破产结构化 - 详情页" key='bankrupt-detail' />,
      ];

      if (role === '结构化人员') Routes.push(...StructureRoute);
      if (role === '管理员')  Routes.push(...AdminRoute);
      if (role === '检查人员') Routes.push(...CheckRoute);

      return(
        <Layout style={{height:'100%'}}>
          <Header style={{height:"auto",padding:0}}><TopMenu user={user}/></Header>
          <Layout>
            <Sider width={200} > <LeftMenu role={role} /> </Sider>
            <Content id='yc-layout-main'><div className="yc-right-content">{ Routes }</div></Content>
          </Layout>
        </Layout>
      );
    }
};

