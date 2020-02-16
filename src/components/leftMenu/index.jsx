import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import './style.scss';
import {getAvailableNav, } from "../../server/api";
import {Link} from "react-router-dom";

const { SubMenu } = Menu;
const menuRoute= {
  7: "/index",
  18: "/check",
  8: "/structure",
  15: "/CheckAssetStrure",
  20: "/CheckAssetStrure",
  17: "/DocumentSearch",
  16: "/DocumentSearch",
  9: "/DocumentSearch",
  21:"/syncMonitor",
  22:"/structureMonitor",
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
    getAvailableNav().then(res=>{
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
    }).catch(()=>{
        // 异常处理
    })
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
          style={{ width: 180, height:1200 }}
          selectedKeys={selectedKeys}
          inlineCollapsed={this.state.collapsed}
          onClick={({key}) => this.setState({selectedKeys: [key]})}
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

export default Sider
