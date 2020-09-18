/** home * */
import React from 'react';
import { Route } from 'react-router';
import { message, Layout, Spin } from 'antd';
import { userToken } from '@server/base';
import CacheRoute from 'react-router-cache-route';
import { rule } from '@/components/rule-container';
import TopMenu from '../../components/layout/topMenu';
import LeftMenu from '../../components/layout/leftMenu';

import AdminRoute from '../../routers/adminRoute';
import CheckRoute from '../../routers/checkRoute';

import { BankruptList, BankruptDetail } from '@/pages/bankrupt-structrue';

import Asset from '@/pages/assetStructureList/structureAccount';
import StructureDetail from '@/pages/asset-structure-detail';
import './style.scss';

const { Header, Sider, Content } = Layout;

class HomeIndex extends React.Component {
  constructor(props) {
    super(props);
    const { history: { location: { query } } } = props;
    this.state = {
      loading: !query,
      functions: '',
    };
  }

  componentDidMount() {
    const { history } = this.props;
    const { location: { query } } = history;
    if (query) {
      if (query && query.info === 'success') {
        this.setState({ functions: query.rule });
        message.success('登录成功!');
      }
    } else {
      userToken().then(({ code, data }) => {
        if (code === 200) {
          this.setState({
            functions: data.FUNCTIONS,
            loading: false,
          });
        } else {
          message.error('账号相关信息已失效，请重新登录!');
          history.replace('/login');
        }
      }).catch(() => {
        message.error('网路异常，请稍后再试！');
        history.replace('/login');
      });
    }
  }

  get Routers() {
    const { ruleSource: { rule } } = this.props;
    const { functions } = this.state;
    const BaseCom = /8/.test(functions);
    const DefaultCom = functions ? (BaseCom ? Asset : BankruptList) : () => <Spin />;

    const Routes = [];
    const BankruptRoutes = [
      <Route path="/index/bankrupt" exact component={BankruptList} remark="破产结构化 - 列表" key="bankrupt" />,
      <Route path="/index/bankrupt/detail/:id" component={BankruptDetail} remark="破产结构化 - 详情页" key="bankrupt-detail" />,
    ];
    const StructureRoute = [
      <CacheRoute path={['/', '/index']} exact component={DefaultCom} key="base" remark="默认页面" />,
      // BaseCom && <Route path="/index" exact component={Asset} key='Asset' remark="资产结构化 - 列表" />,
      BaseCom && <Route path="/index/structureDetail/:status/:id" component={StructureDetail} key="StructureDetail" remark="资产结构化 - 详情页" />,
      ...BankruptRoutes,
    ].filter((i) => i);
    if (rule === 'admin') Routes.push(...AdminRoute, ...BankruptRoutes);
    if (rule === 'normal') Routes.push(...StructureRoute);
    if (rule === 'check') Routes.push(...CheckRoute, ...BankruptRoutes);
    return Routes;
  }

  render() {
    const { ruleSource: { userName } } = this.props;
    const { loading } = this.state;
    return loading ? <div className="yc-spin"><Spin tip="Loading..." /></div> : (
      <Layout style={{ height: '100%' }}>
        <Header style={{ height: 'auto', padding: 0 }}><TopMenu user={userName} /></Header>
        <Layout>
          <Sider width={200}><LeftMenu /></Sider>
          <Content id="yc-layout-main"><div className="yc-right-content">{ this.Routers }</div></Content>
        </Layout>
      </Layout>
    );
  }
}

export default rule(HomeIndex);
