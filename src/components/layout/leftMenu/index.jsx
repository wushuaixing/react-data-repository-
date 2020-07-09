import React from 'react';
import { Menu } from 'antd';
import { getAvailableNav, } from "@api";
import { Link, withRouter } from "react-router-dom";
import admin from "@/assets/img/admin.png";
import check from "@/assets/img/check.png";
import user from "@/assets/img/user.png";
import sync from "@/assets/img/sync.png";
import structure from "@/assets/img/structure.png";
import './index.scss'
let storage = window.localStorage;
const menuRoute = {
  7: "/index/structureUser", //结构化账号（管理员）
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


const sourceData = {
  "任务管理": [{
    "id": 14,
    "title": "结构化任务分配"
  }],
  "账号管理": [
    {
      "id": 7,
      "title": "结构化账号"
    },
    {
      "id": 18,
      "title": "检查账号"
    }
  ],
  "结构化检查": [
    {
      "id": 16,
      "title": "文书搜索"
    },
    {
      "id": 19,
      "title": "检查详情"
    },
    {
      "id": 20,
      "title": "资产结构化列表"
    }
  ]
};

const getSource = (data={})=>{
  const keysArray = Object.keys(data);
  if(keysArray.length===0) return [];
  return keysArray.map(i=>({
    title:i,
    children:data[i].map(item=>({
      ...item,
      link:menuRoute[item.id]
    })),
  }))
};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ["0", "1"],
      menuList: [],
      defaultKey: [],
      menuSource:{}
    };
  }
  handleClick() {
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
        storage["userState"] !== "管理员" && mainMenu[0].subs.push({
          id: '文书搜索',
          title: '文书搜索'
        })
        this.setState({

          menuList: mainMenu,
        });
      } else if (res.data.code === 403) {
        localStorage.removeItem("userState");
        localStorage.removeItem("userName");
        this.props.history.push('/login');
      }
    })
    getAvailableNav().then(res=>{
      if(res.data.code ===200){
        this.setState({ menuSource:res.data.data })
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
              item.id === 21 || item.id === 22 || item.id === '文书搜索') {
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
    return (
      <Menu.Item key={id} className='item_position' >
        {
          id === '文书搜索' ?
            <div onClick={(e) => { e.stopPropagation();window.open('/documentSearch') }}>
              <div className='item_remark' />
              <span style={{ fontSize: 14 }}>{title}</span>
            </div> :
            <Link to={key}>
              <span style={{ fontSize: 14 }}>{title}</span>
            </Link>
        }
      </Menu.Item>
    )
  };

  onOpenChange(key) {
    this.setState({
      openKeys: key
    })
  };

  getDefaultKey = () => {
    if (storage["userState"] === "管理员") {
      return ["7"]
    } else if (storage["userState"] === "结构化人员") {
      return ["8"]
    } else if (storage["userState"] === "检查人员") {
      return ["15"]
    }
  };

  render() {
    const { menuList, openKeys, menuSource } = this.state;
    const { pathname } = this.props.location;
    let defaultKey = this.getDefaultKey();
    if(pathname!=='/index'){
      for(let i in menuRoute){
        if(menuRoute[i]===pathname){
          defaultKey = [i.toString()];break;
        }
      }
    }
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
            })
          }
        </Menu>
        <Menu
          mode="inline"
          theme="dark"
          inlineIndent={14}
          openKeys={openKeys}
          defaultSelectedKeys={defaultKey}
          onOpenChange={this.onOpenChange.bind(this)}
          id="sider-menu-wrapper"
        >
          {
            getSource(menuSource).map(({title,children,img},index)=>(
              <Menu.SubMenu
                className="sider-menu_sub-menu"
                key={`subKey_${index}`}
                title={
                  <span className='sider-menu_sub-menu_title'>
                    <img style={{ marginRight: 8, marginTop: -4 }} src={ img || structure} width="15" height="16" alt="" />
                    {title}
                  </span>}
              >
                {
                  children.map((item,_index)=>(
                    <Menu.Item key={item.id} className="sider-menu_item item_position">
                      {
                        item.title === '文书搜索' ? (
                          <div onClick={(e) => { e.stopPropagation();window.open('/documentSearch') }}>
                            <div className='item_remark' />
                            {item.title}
                          </div>
                        ): item.title
                      }
                    </Menu.Item>
                  ))
                }
              </Menu.SubMenu>
            ))
          }
        </Menu>
      </div>
    );
  }
}
// Todo network 网络延迟显示慢的问题
export default withRouter(Sider)
