import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import {getAvailableNav,} from "../../server/api";
import {Link,withRouter} from "react-router-dom";

let storage = window.localStorage;
const menuRoute= {
  7: "/index", //结构化账号
  18: "/index/checkUser",//检查账号
  8: "/index",//
  15: "/index",//
  20: "/index/assetList",//资产结构化列表（管理员）
  17: "/index/documentSearch",//
  16: "/index/documentSearch",//文书搜索（管理员）
  9: "/index/documentSearch",//
  21:"/index/syncMonitor",//抓取与同步监控
  22:"/index/structureMonitor",//结构化情况监控
};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ['sub1'],
      menuList: [],
      selectedKeys:[],
    };
  }

  componentDidMount() {
    this.getMenu();
  }

  async getMenu(){
    const res = await getAvailableNav();
    // getAvailableNav().then(res=>{
    if(res.data.code === 200 && storage["userState"]){
      let mainMenu=[];
      for (let key in res.data.data) {
        let list={
          title:key,
          subs:res.data.data[key],
        };
        mainMenu.push(list);
      }
      this.setState({
        menuList:mainMenu,
      });
    }else if(res.data.code === 403){
      localStorage.removeItem("userState");
      localStorage.removeItem("userName");
      this.props.history.push('/login');
    }
    // }).catch(()=>{
    //     // 异常处理
    // })
  }

  renderSubMenu = ({id, title, subs}) => {
    let key = menuRoute[id];
    return (
      <Menu.SubMenu key={id} title={<span>{title}</span>}>
        {
          subs && subs.map(item => {
            return this.renderMenuItem(item)
          })
        }
      </Menu.SubMenu>
    )
  };

  renderMenuItem = ({id, title}) => {
    let key = menuRoute[id];
    return (
      <Menu.Item key={id}>
        {/*{icon && <Icon type={icon}/>}*/}
        {/*<span>{title}</span>*/}
        <Link to={key}>
          <span>{title}</span>
        </Link>
      </Menu.Item>
    )
  };

  render() {
    const { menuList,selectedKeys } = this.state;
    return (
      <div>
        <Menu
          mode="inline"
          theme="dark"
          style={{ width: 180, height:2000 }}
          inlineCollapsed={this.state.collapsed}
        >
          {
            menuList.map(item => {
            return item.subs && item.subs.length > 0 ? this.renderSubMenu(item) : this.renderMenuItem(item)
          })}
        </Menu>
      </div>
    );
  }
}

export default withRouter(Sider)
