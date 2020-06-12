import React from 'react';
import { Menu, Button } from 'antd';
import { getAvailableNav, } from "@api";
import { Link, withRouter } from "react-router-dom";
import admin from "@/assets/img/admin.png";
import check from "@/assets/img/check.png";
import user from "@/assets/img/user.png";
import sync from "@/assets/img/sync.png";
import structure from "@/assets/img/structure.png";
import './index.scss'
const { SubMenu } = Menu;
let storage = window.localStorage;
const menuRoute = {
  7: "/index", //结构化账号（管理员）
  18: "/index/checkUser",//检查账号（管理员）
  8: "/index",//资产结构化列表（结构化人员）
  15: "/index",//资产结构化列表检查（检查人员）
  20: "/index/assetList",//资产结构化列表（管理员）
  // 17: "/index/documentSearch",//文书搜索（检查人员）
  16: "/documentSearch",//文书搜索（管理员+检查人员）
  9: "/documentSearch",//文书搜索（结构化人员）
  21: "/index/syncMonitor",//抓取与同步监控（管理员）
  22: "/index/structureMonitor",//结构化情况监控（管理员）
};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ["0","1"],
      menuList: [],
      defaultKey: [],
    };
  }
  handleClick(){
    //console.log(this)
  }
  componentDidMount() {
    // this.getMenu();
    getAvailableNav().then(res => {
      let menuIcon;
      if (storage["userState"] === "管理员") {
        menuIcon = admin;
        this.setState({
          defaultKey: ["7"],
        })
      } else if (storage["userState"] === "结构化人员") {
        menuIcon = user;
        this.setState({
          defaultKey: ["8"],
        })
      } else if (storage["userState"] === "检查人员") {
        menuIcon = check;
        this.setState({
          defaultKey: ["15"],
        })
      } else {
        this.props.history.push("/login");
      }
      if (res.data.code === 200 && storage["userState"]) {
        let mainMenu = [];
        for (let key in res.data.data) {
          if (storage["userState"] === "管理员" && key === "账号管理") {
            menuIcon = admin;
          }
          if (storage["userState"] === "管理员" && key === "数据抓取与同步监控") {
            menuIcon = sync;
          }
          if (storage["userState"] === "管理员" && key === "结构化情况数据监控") {
            menuIcon = structure;
          }
          else if (storage["userState"] === "管理员" && key === "资产结构化") {
            menuIcon = user;
          }
          //暂时设置管理员两个模块和资产结构化下文书详情不可见
          if ((key === "结构化情况数据监控" || key === "数据抓取与同步监控" || key === "资产结构化")) {
            if (key === "资产结构化") {
              let list = {
                title: key,
                icon: menuIcon,
                subs: res.data.data[key].slice(1),
              };
              mainMenu.push(list);
            }
          } else {
            let list = {
              title: key,
              icon: menuIcon,
              subs: res.data.data[key],
            };
            mainMenu.push(list);
          }
        }
        this.setState({
          menuList: mainMenu,
        });
      } else if (res.data.code === 403) {
        localStorage.removeItem("userState");
        localStorage.removeItem("userName");
        this.props.history.push('/login');
      }
    })
  }

  renderSubMenu = ({ id, title, icon, subs }, index) => {
    let _index = index.toString();
    return (
      <Menu.SubMenu key={_index}
        title={
          <span style={{ position: 'relative', left: -6 }}>
            <img style={{ marginRight: 6, marginTop: -3 }} src={icon} width="15" height="16" alt="" />
            <span>{title}</span>
          </span>
        }
      >
        {
          subs && subs.map(item => {
            if (item.id === 7 || item.id === 8 || item.id === 9 ||
              item.id === 15 || item.id === 16 || item.id === 17 ||
              item.id === 18 || item.id === 20 ||
              item.id === 21 || item.id === 22) {
              return this.renderMenuItem(item)
            }
            else {
              return null;
            }
          })
        }
      </Menu.SubMenu>
    )
  };

  renderMenuItem = ({ id, icon, title }) => {
    let key = menuRoute[id];
    let target = ([9, 16].indexOf(id) >= 0) ? '_blank' : '_self' //文书搜索新开页
    //console.log(id, key)
    return (
      <Menu.Item key={id} onClick={this.handleClick}>
        <Link to={key} target={target}>
          <span style={{ fontSize: 14 }}>{title}</span>
        </Link>
      </Menu.Item>
    )
  };

  onOpenChange(key) {
    const { openKeys } = this.state;
    this.setState({
      openKeys:key
    })
  };

  getDefaultKey = () => {
    if (storage["userState"] === "管理员") {
      return ["20"]
    } else if (storage["userState"] === "结构化人员") {
      return ["8"]
    } else if (storage["userState"] === "检查人员") {
      return ["15"]
    }
  };

  render() {
    const { menuList, openKeys } = this.state;
    const defaultKey = this.getDefaultKey();
    return (
      <div>
        <Menu
          mode="inline"
          theme="dark"
          inlineIndent={16}
          openKeys={openKeys}
          defaultSelectedKeys={defaultKey}
          selectable={true}
          onOpenChange={this.onOpenChange.bind(this)}>
          {
            menuList.map((item, index) => {
              return item.subs && item.subs.length > 0 ? this.renderSubMenu(item, index) : this.renderMenuItem(item)
            })}
        </Menu>
      </div>
    );
  }
}

export default withRouter(Sider)
