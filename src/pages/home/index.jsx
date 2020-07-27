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
import {Route} from "react-router";

const { Header, Sider, Content } = Layout;

class  Index extends React.Component {
  componentDidMount(){
    if(this.props.history.location.query&&this.props.history.location.query.info==='success'){
      message.success('登录成功!')
    }
  }
  render() {
      const user = window.localStorage.userName;
      const role = window.localStorage.userState;
      const Routes = [<Route path="/index/bankrupt" component={BankruptList} remark="破产列表" />];

      if (role === '结构化人员') Routes.push(...StructureRoute);
      if (role === '管理员')  Routes.push(...AdminRoute);
      if (role === '检查人员') Routes.push(...CheckRoute);

      return(
        <Layout style={{height:'100%'}}>
          <Header style={{height:"auto",padding:0}}><TopMenu user={user}/></Header>
          <Layout>
            <Sider width={200} > <LeftMenu role={role} /> </Sider>
            <Content><div className="yc-right-content">{ Routes }</div></Content>
          </Layout>
        </Layout>
      );
    }
}
export default Index;
